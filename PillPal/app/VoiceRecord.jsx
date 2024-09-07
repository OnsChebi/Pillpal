import { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import * as mime from 'react-native-mime-types';

export default function App() {
  const [recording, setRecording] = useState();
  const [sound, setSound] = useState();
  const [uri, setUri] = useState('');
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [transcription, setTranscription] = useState('');

  // Function to start recording
  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  // Function to stop recording
  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    const uri = recording.getURI();
    setUri(uri);
    console.log('Recording stopped and stored at', uri);

    // Sending the audio file to Flask server
    sendAudioToServer(uri);
  }

  // Function to play recorded audio
  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  // Function to send audio to Flask server
  const sendAudioToServer = async (uri) => {
    const fileType = mime.lookup(uri);
    const formData = new FormData();
    formData.append('audio', {
      uri: uri,
      name: `audio.${fileType.split('/')[1] || 'm4a'}`,
      type: fileType,
    });

    try {
      const response = await fetch('http://192.168.1.8:5000/transcribe', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const responseData = await response.json();
    if (response.ok) {
      setTranscription(responseData.transcription);  // Display transcription
    } else {
      console.error('Error transcribing:', responseData.error);
    }
  } catch (error) {
    console.error('Error uploading audio:', error);
  }
};
  // const fetchTranscription = async () => {
  //   try {
  //     const response = await fetch('http://192.168.1.8:5000/get_transcription');  // Use your Flask server IP and port
  //     const data = await response.json();

  //     if (response.ok) {
  //       setTranscription(data.transcription);
  //     } else {
  //       console.error('Error fetching transcription:', data.error);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching transcription:', error);
  //   }
  // };

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl mb-6">
        {recording ? 'Listening...' : 'Start Recording'}
      </Text>
      <TouchableOpacity
        className={`bg-red-500 p-6 rounded-full ${
          recording ? 'animate-pulse' : ''
        }`}
        onPress={recording ? stopRecording : startRecording}
      >
        <FontAwesome name="microphone" size={32} color="white" />
      </TouchableOpacity>

      {uri ? (
        <View style={styles.playbackContainer}>
          <Button title="Play Sound" onPress={playSound} />
          <Text>Transcription: {transcription}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  playbackContainer: {
    marginTop: 20,
  },
});
