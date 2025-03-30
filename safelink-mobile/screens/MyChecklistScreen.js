import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { AuthContext } from '../AuthContext'; // Import AuthContext
import { BACKEND_URL } from '@env';

const MyChecklistScreen = () => {
  const { user } = useContext(AuthContext); // Access the logged-in user's email
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChecklists = async () => {
    if (!user) return;

    setLoading(true); // Show loading indicator while fetching data

    try {
      const response = await fetch(`${BACKEND_URL}/get-checklists/${encodeURIComponent(user)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch checklists');
      }

      const data = await response.json();
      setChecklists(data.checklists || []);
    } catch (error) {
      console.error('Error fetching checklists:', error);
      Alert.alert('Error', 'Failed to fetch checklists');
    } finally {
      setLoading(false); // Hide loading indicator after fetching data
    }
  };

  // Use useFocusEffect to fetch data whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchChecklists();
    }, [user])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4e8bed" />
        <Text style={styles.loadingText}>Loading Checklists...</Text>
      </View>
    );
  }

  if (checklists.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No checklists saved yet!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={checklists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.checklistItem}>
            <Text style={styles.checklistTitle}>Patient Info:</Text>
            <Text style={styles.checklistText}>{item.patientInfo}</Text>
            <Text style={styles.checklistTitle}>Checklist:</Text>
            {item.checklist.map((point, index) => (
              <Text key={index} style={styles.checklistPoint}>
                - {point}
              </Text>
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  checklistItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 5,
  },
  checklistText: {
    fontSize: 14,
    color: '#2d3436',
    marginBottom: 10,
  },
  checklistPoint: {
    fontSize: 14,
    color: '#2d3436',
    marginLeft: 10,
  },
});

export default MyChecklistScreen;