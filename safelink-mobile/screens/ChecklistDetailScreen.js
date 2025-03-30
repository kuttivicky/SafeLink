import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ChecklistDetailScreen = ({ route }) => {
  const { patientInfo, checklist } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Info</Text>
      <Text style={styles.text}>{patientInfo}</Text>

      <Text style={styles.title}>Checklist</Text>
      <ScrollView style={styles.scrollContainer}>
        {checklist.map((point, index) => (
          <Text key={index} style={styles.checklistText}>
            {point.replace(/\*\*(.*?)\*\*/g, '$1')}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  text: {
    fontSize: 16,
    color: '#2d3436',
    marginBottom: 20,
  },
  scrollContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  checklistText: {
    fontSize: 16,
    color: '#2d3436',
    marginVertical: 4,
  },
});

export default ChecklistDetailScreen;