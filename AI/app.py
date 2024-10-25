from flask import Flask, request, jsonify
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
from pydub import AudioSegment
import numpy as np
import os
import torch
import requests

# Configure device
device = "cpu"
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
    chunk_length_s=30,
    batch_size=16,
    return_timestamps=True,
    torch_dtype=torch_dtype,
    device=device,
)

# Medical Summary Generator Class
class MedicalSummaryGenerator:
    def __init__(self, token):
        self.token = token
        self.headers = {
            "Authorization": f"Bearer {self.token}"
        }

    def get_medical_summary(self, transcription):
        # API request body
        payload = {
            "inputs": transcription,
            "parameters": {"max_new_tokens": 300},
        }
        
        response = requests.post(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
            headers=self.headers,
            json=payload
        )

        if response.status_code == 200:
            return response.json().get('generated_text', 'No summary generated')
        else:
            return f"Error: {response.text}"

# Function to convert audio and transcribe it
def mp3_to_array(mp3_path):
    audio = AudioSegment.from_mp3(mp3_path)
    audio = audio.set_channels(1).set_frame_rate(16000)  # Mono and 16kHz
    audio_np = np.array(audio.get_array_of_samples())
    return audio_np.astype(np.float32) / 32768.0  # Normalize

# Flask app setup
app = Flask(__name__)

# Ensure the Doctor directory exists
audio_directory = "Doctor"
if not os.path.exists(audio_directory):
    os.makedirs(audio_directory)

# Initialize the MedicalSummaryGenerator with your API token
summary_generator = MedicalSummaryGenerator(token=os.getenv("HUGGING_FACE_API_TOKEN"))
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
    sample = {"array": audio_array, "sampling_rate": 16000}
    
    try:
        result = pipe(sample)
        transcription_text = result.get("text", "")

        # Generate the medical summary from the transcription
        summary_text = summary_generator.get_medical_summary(transcription_text)

        # Return the transcription and summary
        return jsonify({
            "transcription": transcription_text,
            "summary": summary_text
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
