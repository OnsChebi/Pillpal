from huggingface_hub import InferenceClient # type: ignore

class MedicalSummaryGenerator:
    def __init__(self, token):
        # Initialize the Hugging Face client for the Mistral model
        self.client = InferenceClient("mistralai/Mistral-7B-Instruct-v0.3", token=token)
        self.system_prompt = """You are a medical assistant. Your role is to generate a detailed summary for the consultation. The summary should include:

1. **Symptoms:** Clearly list all symptoms reported by the patient. 
2. **Treatment:** Specify any drugs prescribed or other recommended activities.
3. **Diagnostic:** State the diagnosis given by the doctor. If pending, mention that the diagnosis is awaited.
4. **Illness History:** Summarize any past illnesses or state "No history of previous illness" if applicable.
5. **Family History:** Include any relevant family medical history or state "No family history" if applicable.
6. **Social History:** Describe any lifestyle factors or environmental influences affecting the patient. If none, state "No social history." 

Be concise, clear, and ensure that all points are addressed in the summary. Include specific details from the patient's transcription. Use bullet points for better readability."""

    def get_medical_summary(self, transcription):
        # Create the user message with the transcription
        user_message = {"role": "user", "content": transcription}

        # Make the request to the Mistral model
        message = self.client.chat_completion(
            messages=[{"role": "system", "content": self.system_prompt}, user_message],
            max_tokens=1024,
            stream=False,
        )
        summary = message.choices[0].message.content
        return summary

    @staticmethod
    def extract_summary_parts(summary):
        import re
        # Define regex patterns for each part
        patterns = {
            "Symptoms": r"Symptoms:\s*(.*?)\n\n",
            "Treatment": r"Treatment:\s*(.*?)\n\n",
            "Diagnostic": r"Diagnostic:\s*(.*?)\n\n",
            "Illness History": r"Illness History:\s*(.*?)\n\n",
            "Family History": r"Family History:\s*(.*?)\n\n",
            "Social History": r"Social History:\s*(.*?)$"
        }

        # Extract each part using regex
        extracted_parts = {}
        for key, pattern in patterns.items():
            match = re.search(pattern, summary, re.DOTALL)
            if match:
                extracted_parts[key] = match.group(1).strip()
            else:
                extracted_parts[key] = "Not provided"

        return extracted_parts
