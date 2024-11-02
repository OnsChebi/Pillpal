import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity ,ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import * as mime from 'react-native-mime-types';



export function VoiceRecord({ navigation }) {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [uri, setUri] = useState('');
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranscribingDone, setIsTranscribingDone] = useState(false);
  const [timer, setTimer] = useState(0); 
  const [intervalId, setIntervalId] = useState(null);
  const [summaryText, setSummary] = useState('');

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
      setIsTranscribingDone(false)
      // Start the timer
      setTimer(0);
      const id = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      setIntervalId(id);

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

    // Clear the timer
    clearInterval(intervalId);
    setTimer(0);

    // Sending the audio file to Flask server
    sendAudioToServer(uri);
  }

  // Function to send audio to Flask server
  const sendAudioToServer = async (uri) => {
    setIsTranscribing(true);
    const fileType = mime.lookup(uri);
    const formData = new FormData();
    formData.append('audio', {
      uri: uri,
      name: `audio.${fileType.split('/')[1] || 'm4a'}`, // Corrected the string template
      type: fileType,
    });

    try {
      const response = await fetch('http://192.168.1.19:5000/transcribe', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const responseData = await response.json();
      if (response.ok) {
        setTranscription(responseData.transcription);
        setSummary(responseData.summary); 
        console.log('Summary:', responseData.summary);
      } else {
        console.error('Error transcribing:', responseData.error);
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
    } finally {
      setIsTranscribing(false);
      setIsTranscribingDone(true);
      fetchSummary();
    }
  };


  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  // Function to format the timer as MM:SS
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View style={styles.roundedRectangle} />
      <Text className="absolute top-10 text-white font-bold text-2xl">
        {recording ? 'Recording...' : 'Start Recording'}
      </Text>
      {isTranscribing ? (
  <View style={{ marginTop:100, alignItems: 'center' }}> 
    <ActivityIndicator size={100} color="#ffffff" /> 
  </View>
) : isTranscribingDone ? (
  <Text className="text-white top-20 font-bold text-2xl">Transcription is ready!</Text>
) : (
  <Text></Text>
)}
      {/* Timer Display */}
      <Text className="absolute top-96 text-black font-bold text-2xl">
        {recording ? formatTimer(timer) : ''}
      </Text>

      <TouchableOpacity
        className={`p-6 rounded-full ${recording ? 'animate-pulse' : ''}`}
        onPress={recording ? stopRecording : startRecording}
        style={styles.recordButton}
      >
        <FontAwesome name={recording ? 'pause' : 'microphone'} size={32} color="white" />
      </TouchableOpacity>


      {/* Button Row for Transcription and Summarization */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Transcription', { transcription })}>
          <Text style={styles.buttonText}>Transcription</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Summarization',{ summary: summaryText })}>
          <Text style={styles.buttonText}>Summarization</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  playbackContainer: {
    marginTop: 20,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#24bc84',
  },
  roundedRectangle: {
    width: '100%',
    height: '50%',
    backgroundColor: '#24bc84',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'absolute',
    top: 0,
  },
  recordButton: {
    marginTop: '80%',
    backgroundColor: '#24bc84',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'space-between',
    width: '100%', 
  },
  button: {
    backgroundColor: '#24bc84',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 10, 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
