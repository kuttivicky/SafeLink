import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../AuthContext';
import { BACKEND_URL } from '@env';
import { Switch } from 'react-native';


const ProfileScreen = () => {
  const { user } = useContext(AuthContext); // Assuming `user` is an ID like user._id
  const [userdata, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consent, setConsent] = useState(false);


  useEffect(() => {
    if (user) {
      const url=`${BACKEND_URL}/userinfo/${encodeURIComponent(user)}`;
      console.log("Fetching user data from: ", url); // Debugging line
      fetch(url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("User data fetched: ", data); // Debugging line
          setUserData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setLoading(false);
        });
    }
  }, [user]);

  useEffect(() => {
    if (userdata && userdata.consent !== undefined) {
      setConsent(userdata.consent);
    }
  }, [userdata]);
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4e8bed" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  if (!userdata) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>User not found.</Text>
      </View>
    );
  }

  const toggleConsent = async () => {
    const updatedConsent = !consent;
    setConsent(updatedConsent);
  
    try {
      const url = `${BACKEND_URL}/userinfo/${encodeURIComponent(user)}/consent`;
      console.log("Updating consent at: ", url); // Debugging line
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent: updatedConsent }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update consent');
      }
  
      console.log('Consent updated:', data);
    } catch (error) {
      console.error('Error updating consent:', error);
      alert('Failed to update consent. Try again later.');
      setConsent(!updatedConsent); // Revert on error
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/profile-avatar.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userdata.name}</Text>
      </View>

      <View style={styles.card}>
        <InfoRow icon="phone" label="Phone" value={userdata.phone} />
        <InfoRow icon="email" label="Email" value={userdata.email} />
        <View style={styles.row}>
          <Icon name="shield-check" size={24} color="#4e8bed" style={styles.icon} />
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={styles.label}>Consent to Share Contact</Text>
              <Text style={styles.value}>{consent ? 'Enabled' : 'Disabled'}</Text>
            </View>
            <Switch
              value={consent}
              onValueChange={toggleConsent}
              thumbColor={consent ? '#4e8bed' : '#ccc'}
              trackColor={{ false: '#ddd', true: '#cce0ff' }}
            />
          </View>
        </View>
        {/* <InfoRow icon="map-marker" label="City" value={userdata.city} />
        <InfoRow icon="map" label="State" value={userdata.state} />
        <InfoRow icon="medical-bag" label="Health Issue" value={userdata.problem} /> */}
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.row}>
    <Icon name={icon} size={24} color="#4e8bed" style={styles.icon} />
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f8fe',
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
    marginTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f8fe',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#4e8bed',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default ProfileScreen;
