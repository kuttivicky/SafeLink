import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert, View } from 'react-native';
import { BACKEND_URL } from '@env';
import { AuthContext } from '../AuthContext'; // Import AuthContext

const AIScreen = () => {
  const { user } = useContext(AuthContext); // Access the logged-in user's email
  const [input, setInput] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to generate a checklist
  const handleGenerateChecklist = async () => {
    if (!input.trim()) {
      Alert.alert('Error', 'Please describe the patient condition.');
      return;
    }

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
      setChecklist(data.checklist); // Assuming the backend returns a `checklist` array
    } catch (err) {
      console.error('Error generating checklist:', err);
      Alert.alert('Error', 'Failed to generate checklist');
    } finally {
      setLoading(false);
    }
  };

  // Function to save the checklist
  const handleSaveChecklist = async () => {
    if (checklist.length === 0) {
      Alert.alert('Error', 'No checklist to save');
      return;
    }
  
    try {
      console.log('Saving checklist:', {
        userId: user,
        patientInfo: input,
        checklist,
      });
  
      const response = await fetch(`${BACKEND_URL}/save-checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user, // Use the logged-in user's email
          patientInfo: input,
          checklist,
        }),
      });
  
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from backend:', errorData);
        throw new Error(errorData.message || 'Failed to save checklist');
      }
  
      const data = await response.json();
      Alert.alert('Success', data.message);
  
      // Clear input and checklist after saving
      setInput('');
      setChecklist([]);
    } catch (err) {
      console.error('Error saving checklist:', err);
      Alert.alert('Error', err.message || 'Failed to save checklist');
    }
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
          <View key={index} style={styles.checklistItem}>
            <Text style={styles.checklistText}>
              <Text style={styles.checklistNumber}>{index + 1}. </Text>
              {item}
            </Text>
          </View>
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  textInput: {
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: 'white',
    height: 100,
  },
  generateButton: {
    backgroundColor: 'white',
    borderColor: '#2980b9',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2980b9',
  },
  scrollContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    maxHeight: 500,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f8ff',
    borderColor: '#dcdcdc',
    borderWidth: 1,
  },
  checklistNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2980b9',
    marginRight: 8,
  },
  checklistText: {
    fontSize: 16,
    color: '#2d3436',
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#2980b9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default AIScreen;