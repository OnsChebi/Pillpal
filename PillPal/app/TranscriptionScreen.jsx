import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";

export function TranscriptionScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>
        {/* Placeholder for transcription text */}
        Transcription text goes here.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontSize: 16,
  },
});
