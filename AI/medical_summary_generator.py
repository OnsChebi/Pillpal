from transformers import pipeline
import re

class MedicalSummaryGenerator:
    def __init__(self, token):
        # Initialize the summarizer pipeline
        self.summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
        self.system_prompt = """You are a medical assistant. Your role is to generate a summary for the consultation..."""

    def get_medical_summary(self, transcription):
        if not transcription or len(transcription.split()) < 10:  # Check if the transcription is too short
            return "Transcription is too short to summarize."
        try:
            # Use generate_kwargs to remove the max_new_tokens warning
            summary = self.summarizer(transcription, max_length=150, min_length=40, do_sample=False)
            return summary[0]['summary_text']
        except Exception as e:
            print(f"Error during summarization: {str(e)}")
            return "Error generating summary."

    @staticmethod
    def extract_summary_parts(summary):
        patterns = {
            "Symptoms": r"(?i)(symptoms|concerns|issues|complaints):?\s*(.*?)(?=\n|$)",
            "Treatment": r"(?i)(treatment|medications|therapy|prescription):?\s*(.*?)(?=\n|$)",
            "Diagnostic": r"(?i)(diagnosis|diagnostic|findings|test results):?\s*(.*?)(?=\n|$)",
            "Illness History": r"(?i)(history|past illnesses|illness history):?\s*(.*?)(?=\n|$)",
            "Family History": r"(?i)(family history):?\s*(.*?)(?=\n|$)",
            "Social History": r"(?i)(social history|lifestyle|habits):?\s*(.*?)(?=\n|$)"
        }

        extracted_parts = {}
        for key, pattern in patterns.items():
            match = re.search(pattern, summary, re.DOTALL)
            if match:
                extracted_parts[key] = match.group(2).strip()
            else:
                extracted_parts[key] = "Not provided"
                
        return extracted_parts
