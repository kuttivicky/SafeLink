import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ChecklistContext } from '../context/ChecklistContext';

const MyChecklistScreen = () => {
  const { checklists } = useContext(ChecklistContext);

  return (
    <View style={styles.container}>
      {checklists.length === 0 ? (
        <Text style={styles.text}>No checklists saved yet!</Text>
      ) : (
        <FlatList
          data={checklists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.checklistItem}>
              <Text style={styles.checklistTitle}>Patient Info:</Text>
              <Text>{item.patientInfo}</Text>
              <Text style={styles.checklistTitle}>Checklist:</Text>
              {item.checklist.map((point, index) => (
                <Text key={index}>- {point}</Text>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9fafc' },
  text: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  checklistItem: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  checklistTitle: { fontWeight: 'bold', marginTop: 10 },
});

export default MyChecklistScreen;