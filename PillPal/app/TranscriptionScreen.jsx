import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Transcription({ route }) {
  // Get the transcription passed as a parameter
  const { transcription } = route.params;
  console.log(transcription)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transcription</Text>
      <Text style={styles.transcription}>{transcription || "No transcription available."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#24bc84',
  },
  transcription: {
    fontSize: 16,
    lineHeight: 24,
    color: 'black',
  },
});
