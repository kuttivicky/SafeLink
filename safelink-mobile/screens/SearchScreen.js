import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { BACKEND_URL } from '@env';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const searchPatients = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const url = `${BACKEND_URL}/patients?disease=${query}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setPatients(data);
      } else {
        setPatients([]);
        alert(data.message || 'No patients found');
      }
    } catch (error) {
      alert('Error fetching patients');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (patient) => {
    console.log('Patient:', patient);
    try {
      const res = await fetch(`${BACKEND_URL}/patients/consent?email=${patient.userId}`);
      const data = await res.json();

      if (data.success && data.consent === true) {
        setSelectedPatient(patient);
        setModalVisible(true);
      } else {
        Alert.alert('Permission Denied', 'Patient details cannot be shown without consent.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while checking consent.');
    }
  };

  const renderPatient = ({ index, item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Patient {index + 1}</Text>
      <TouchableOpacity
        style={[styles.button, { marginTop: 10, backgroundColor: '#34a853' }]}
        onPress={() => viewDetails(item)}
      >
        <Text style={[styles.buttonText, { fontSize: 16 }]}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search Patients by Disease</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter disease name"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchPatients}
        />
        <TouchableOpacity style={styles.button} onPress={searchPatients}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4e8bed" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderPatient}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      {/* Patient Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Patient Details</Text>
            <Text style={styles.detail}>Name: {selectedPatient?.name}</Text>
            <Text style={styles.detail}>Phone: {selectedPatient?.phone}</Text>
            <Text style={styles.detail}>Email: {selectedPatient?.email}</Text>
            <Text style={styles.detail}>Disease: {selectedPatient?.problem}</Text>
            <Text style={styles.detail}>Location: {selectedPatient?.city}, {selectedPatient?.state}</Text>

            <TouchableOpacity
              style={[styles.button, { marginTop: 20, backgroundColor: '#4e8bed' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f8fe', marginTop: 40 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#222' },
  searchRow: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    borderRadius: 10,
    height: 48,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#4e8bed',
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
  },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#333' },
  detail: { fontSize: 15, color: '#555', marginBottom: 4 },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
});

export default SearchScreen;
