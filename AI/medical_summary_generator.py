from huggingface_hub import InferenceClient # type: ignore

class MedicalSummaryGenerator:
    def __init__(self, token):
        # Initialize the Hugging Face client for the Mistral model
        self.client = InferenceClient("mistralai/Mistral-7B-Instruct-v0.3", token=token)
        self.system_prompt = """You are a medical assistant. Your role is to generate a summary for the consultation. The summary should consist of the following parts:

1. Symptoms: List the symptoms that the patient has reported.
2. Treatment: List the drugs prescribed by the doctor or any other recommended activities such as taking rest.
3. Diagnostic: Provide the diagnosis given by the doctor.
4. Illness History: List any diseases that the patient has already had. If there is no history of previous illness, return "No history of previous illness."
5. Family History: Indicate if a member of the patient's family has a history of any disease. If there is no family history, return "No family history."
6. Social History: Note any activities or environmental factors that may be causing the patient to feel sick, such as a hard work environment or stress. If there is no social history, return "No social history."""

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
