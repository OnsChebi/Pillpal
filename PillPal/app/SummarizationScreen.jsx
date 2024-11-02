import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export function Summarization({ route }) {
  const { summaryText } = route.params;
  console.log(summaryText);

  // Split the summaryText into sections based on your specified format
  const sections = summaryText.split('\n\n').map(section => {
    const [title, ...content] = section.split('\n');
    return {
      title: title.replace(':', ''), // Clean up title by removing colon
      content: content.join('\n'), // Join the rest of the content back together
    };
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {sections.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}:</Text>
            <Text style={styles.sectionContent}>{section.content || "No content available."}</Text>

          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff', // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#24bc84', // Main title color
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  sectionContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff', // Background for each section
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // Elevation for Android
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#24bd85', // Section title color
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555', // Content text color
    marginTop: 5,
  },
});
