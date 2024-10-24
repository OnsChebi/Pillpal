import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";

export function SummarizationScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>
        Summarization .
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
