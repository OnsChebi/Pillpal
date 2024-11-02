import React from 'react';
import { View, Text, StyleSheet ,ScrollView} from 'react-native';

export function Summarization({ route }) {
  // Get the transcription passed as a parameter
  const { transcription } = route.params;
  console.log(transcription)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Summarization</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.transcription}>{transcription || "No Summarization available."}</Text>
      </ScrollView>
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
    color: '#24bc84',
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  transcription: {
    fontSize: 16,
    lineHeight: 24,
    color: 'black',
  },
});
