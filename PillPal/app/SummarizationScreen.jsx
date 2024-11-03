import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, ScrollView, Alert, TextInput, Modal, TouchableOpacity } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export function Summarization({ route }) {
  const { summaryText } = route.params;
  const [fileName, setFileName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const generatePDF = async () => {
    const html = `
      <html>
        <body>
          <h1>Consultation Summary</h1>
          <pre>${summaryText || "No summaryText available."}</pre>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      const pdfFileName = `${fileName || 'Consultation_Summary'}.pdf`;
      const pdfUri = `${FileSystem.documentDirectory}${pdfFileName}`;

      // Move the PDF file to the chosen name and path
      await FileSystem.moveAsync({
        from: uri,
        to: pdfUri,
      });

      setModalVisible(false);
      Alert.alert('Success', `File saved as ${pdfFileName}`);
      
      // Share the PDF file
      await Sharing.shareAsync(pdfUri);
      
    } catch (error) {
      console.error('Failed to generate or open PDF:', error);
      Alert.alert('Error', 'Failed to generate or open PDF');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Summarization:</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.summaryText}>{summaryText || "No summaryText available."}</Text>
      </ScrollView>
      <TouchableOpacity style={styles.downloadButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.saveButtonText}>Download PDF</Text>
      </TouchableOpacity>
      {/* Modal for file name input */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter PDF Name</Text>
            <TextInput
              style={styles.input}
              placeholder="File name"
              value={fileName}
              onChangeText={setFileName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={generatePDF}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  downloadButton: {
    backgroundColor: '#24bc84', // Green color
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
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
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: 'black',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#24bc84',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ccc',
    alignItems: 'center',
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: 'white',
  },
});
