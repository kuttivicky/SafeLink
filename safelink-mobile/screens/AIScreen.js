import React, { useState, useContext } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { BACKEND_URL } from '@env';
import { ChecklistContext } from '../context/ChecklistContext';

const AIScreen = () => {
  const [input, setInput] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addChecklist } = useContext(ChecklistContext);

  const handleGenerateChecklist = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/generate-checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientInfo: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate checklist');
      }

      const data = await response.json();
      setChecklist(data.checklist);
    } catch (err) {
      console.error('Error generating checklist:', err);
      Alert.alert('Error', 'Failed to generate checklist');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChecklist = () => {
    if (checklist.length === 0) {
      Alert.alert('Error', 'No checklist to save');
      return;
    }

    addChecklist(input, checklist);
    Alert.alert('Success', 'Checklist saved successfully!');
    setInput('');
    setChecklist([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🩺 SafeLink - AI Safety Checklist</Text>

      <TextInput
        style={styles.textInput}
        placeholder="Describe patient condition..."
        value={input}
        onChangeText={setInput}
        multiline
      />

      <TouchableOpacity style={styles.generateButton} onPress={handleGenerateChecklist} disabled={loading}>
        {loading ? <ActivityIndicator color="#2980b9" /> : <Text style={styles.generateButtonText}>✨ Generate Checklist</Text>}
      </TouchableOpacity>

      <ScrollView style={styles.scrollContainer}>
        {checklist.map((item, index) => (
          <Text key={index} style={styles.checkItem}>{item}</Text>
        ))}
      </ScrollView>

      {checklist.length > 0 && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChecklist}>
          <Text style={styles.saveButtonText}>💾 Save Checklist</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9fafc' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50' },
  textInput: { borderColor: '#dcdcdc', borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 10, backgroundColor: 'white', height: 100 },
  generateButton: { backgroundColor: 'white', borderColor: '#2980b9', borderWidth: 2, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginBottom: 20 },
  generateButtonText: { fontSize: 16, fontWeight: '600', color: '#2980b9' },
  scrollContainer: { marginTop: 20, backgroundColor: '#fff', borderRadius: 10, padding: 10, maxHeight: 500 },
  checkItem: { fontSize: 16, fontWeight: '600', marginVertical: 4, color: '#2d3436' },
  saveButton: { backgroundColor: '#2980b9', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 20 },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: 'white' },
});

export default AIScreen;