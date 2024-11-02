import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export function Summarization({ route }) {
  // Retrieve the summary passed from the previous screen
  const { summary } = route.params;

  // Function to extract summary parts
  const extractSummaryParts = (summary) => {
    return {
      Symptoms: summary.Symptoms || 'Not provided',
      Treatment: summary.Treatment || 'Not provided',
      Diagnostic: summary.Diagnostic || 'Not provided',
      "Illness History": summary["Illness History"] || 'Not provided',
      "Family History": summary["Family History"] || 'Not provided',
      "Social History": summary["Social History"] || 'Not provided',
    };
  };

  // Parse the summary into an object if it's a structured summary
  const summaryParts = extractSummaryParts(summary);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemContent}>{item.content}</Text>
    </View>
  );

  const data = [
    { title: 'Symptoms', content: summaryParts.Symptoms },
    { title: 'Treatment', content: summaryParts.Treatment },
    { title: 'Diagnostic', content: summaryParts.Diagnostic },
    { title: 'Illness History', content: summaryParts['Illness History'] },
    { title: 'Family History', content: summaryParts['Family History'] },
    { title: 'Social History', content: summaryParts['Social History'] },
  ];

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.title}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text style={styles.title}>Medical Consultation Summary</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContent: {
    fontSize: 16,
    marginTop: 5,
  },
});
