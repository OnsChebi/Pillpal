# Voice Recording and Transcription Application

This application ids dedicated for doctors allows them to record the consultation, transcribe it into text, and generate a summary of the transcribed content. 
It is built using React Native and integrates with a Flask server for audio processing and transcription.

## Features

- **Audio Recording:** Users can record their voice and save the audio file.
- **Transcription:** The recorded audio is sent to a Flask server for transcription using machine learning models.
- **Summary Generation:** After transcription, the application can generate a summary of the transcribed text.
- **User-Friendly Interface:** Clean and intuitive design for easy navigation and usage.

## Technologies Used

- **Frontend:** React Native, Expo
- **Backend:** Flask
- **Audio Processing:** Expo Audio API, `react-native-mime-types`
- **Styling:** Tailwind CSS 
- **State Management:** React Hooks

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js
- Expo CLI
- Python 3.x
- Flask

## Frontend Setup:
- cd pillpal
- npm install
- npx expo start

## Backend Setup:
- cd AI
- create .env File add HUGGING_FACE_API_TOKEN=YOUR_TOKEN
- pip install flask transformers pydub torch numpy huggingface_hub python-dotenv
- python app.py






