import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ChecklistContext } from '../context/ChecklistContext';

const MyChecklistScreen = ({ navigation }) => {
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
            <TouchableOpacity
              style={styles.checklistItem}
              onPress={() =>
                navigation.navigate('ChecklistDetailScreen', {
                  patientInfo: item.patientInfo,
                  checklist: item.checklist,
                })
              }
            >
              <Text style={styles.checklistTitle}>Patient Info:</Text>
              <Text style={styles.checklistText} numberOfLines={2}>
                {item.patientInfo}
              </Text>
              <Text style={styles.checklistTitle}>Checklist:</Text>
              <Text style={styles.checklistText} numberOfLines={2}>
                {item.checklist.map((point) => point.replace(/\*\*(.*?)\*\*/g, '$1')).join(', ')}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafc',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  checklistItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  checklistTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  checklistText: {
    fontSize: 14,
    color: '#2d3436',
    marginVertical: 4,
  },
});

export default MyChecklistScreen;