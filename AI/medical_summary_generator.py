# medical_summary_generator.py

from transformers import pipeline
import re

class MedicalSummaryGenerator:
    def __init__(self, token):
        self.summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
        self.system_prompt = """You are a medical assistant. Your role is to generate a summary for the consultation..."""

    def get_medical_summary(self, transcription):
        if not transcription or len(transcription.split()) < 10:  # Check if the transcription is too short
            return "Transcription is too short to summarize."
        try:
            summary = self.summarizer(transcription, max_length=150, min_length=40, do_sample=False)
            return summary[0]['summary_text']
        except Exception as e:
            print(f"Error during summarization: {str(e)}")
            return "Error generating summary."

    @staticmethod
    def extract_summary_parts(summary):
        patterns = {
            "Symptoms": r"Symptoms:\s*(.*?)\s*(?=\n\n|\Z)",
            "Treatment": r"Treatment:\s*(.*?)\s*(?=\n\n|\Z)",
            "Diagnostic": r"Diagnostic:\s*(.*?)\s*(?=\n\n|\Z)",
            "Illness History": r"Illness History:\s*(.*?)\s*(?=\n\n|\Z)",
            "Family History": r"Family History:\s*(.*?)\s*(?=\n\n|\Z)",
            "Social History": r"Social History:\s*(.*?)$"
        }
        extracted_parts = {
            key: re.search(pattern, summary, re.DOTALL).group(1).strip() if re.search(pattern, summary, re.DOTALL) else "Not provided"
            for key, pattern in patterns.items()
        }
        return extracted_parts

