from flask import Flask, request, jsonify
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
from pydub import AudioSegment
import numpy as np
import os
import torch
import requests
from medical_summary_generator import MedicalSummaryGenerator


# Configure device
device = "cuda" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

# Load transcription model and processor
model_id = "openai/whisper-small"
model = AutoModelForSpeechSeq2Seq.from_pretrained(model_id, torch_dtype=torch_dtype)
model.to(device)

processor = AutoProcessor.from_pretrained(model_id)

# Initialize the transcription pipeline
pipe = pipeline(
    "automatic-speech-recognition",
    model=model,
    tokenizer=processor.tokenizer,
    feature_extractor=processor.feature_extractor,
    max_new_tokens=128,
    chunk_length_s=5,
    batch_size=2,
    return_timestamps=True,
    torch_dtype=torch_dtype,
    device=device,
   
)

summary_generator = MedicalSummaryGenerator(os.getenv("HUGGING_FACE_API_TOKEN"))


# Function to convert audio and transcribe it
def mp3_to_array(mp3_path):
    try:
        audio = AudioSegment.from_mp3(mp3_path)
        audio = audio.set_channels(1).set_frame_rate(16000)
        audio_np = np.array(audio.get_array_of_samples())
        return audio_np.astype(np.float32) / 32768.0
    except Exception as e:
        raise ValueError(f"Error processing audio file: {e}")

# Flask app setup
app = Flask(__name__)

# Ensure the Doctor directory exists
audio_directory = "Doctor"
if not os.path.exists(audio_directory):
    os.makedirs(audio_directory)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    
    audio_file = request.files['audio']
    audio_path = os.path.join(audio_directory, audio_file.filename)
    audio_file.save(audio_path)
    
    # Convert the file to MP3 if necessary
    mp3_path = audio_path.replace(".m4a", ".mp3").replace(".mp4", ".mp3")
    audio = AudioSegment.from_file(audio_path)
    audio.export(mp3_path, format="mp3")
    if not audio_path.endswith(".mp3"):
        os.remove(audio_path)
    
    # Transcribe the audio
    audio_array = mp3_to_array(mp3_path)
    sample = {
        "raw": audio_array,  # Use "raw" key for the numpy array
        "sampling_rate": 16000  # Include the sampling rate
    }
    try:
        result = pipe(sample)
        transcription_text = result['text']

        # Generate the medical summary from the transcription
        summary_text = summary_generator.get_medical_summary(transcription_text)
        extracted_summary = summary_generator.extract_summary_parts(summary_text)


        print("Transcription:", transcription_text)
        print("Full Summary:", summary_text)
        print("Extracted Summary Parts:", extracted_summary)
        # Return the transcription and summary
        return jsonify({
            "transcription": transcription_text,
            "summary": summary_text,
            "extracted_summary": extracted_summary

        }), 200
    except Exception as e:
        print("Error during transcription:", str(e))
        return jsonify({"error": str(e)}), 500
    
@app.route('/summarize', methods=['POST'])
def generate_summary():
    data = request.json
    transcription = data.get('transcription', '')
    try:
        summary_text = summary_generator.get_medical_summary(transcription)
        extracted_summary = summary_generator.extract_summary_parts(summary_text)
        return jsonify(extracted_summary)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
