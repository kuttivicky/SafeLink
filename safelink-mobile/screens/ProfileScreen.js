import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = () => {
  const user = {
    name: 'Santhosh Ekambaram',
    phone: '+91 98765 43210',
    email: 'santhosh@example.com',
    state: 'Tamil Nadu',
    city: 'Chennai',
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/profile-avatar.png')} // You can use a placeholder image or a remote URI
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        {/* <Text style={styles.problem}>{user.problem}</Text> */}
      </View>

      <View style={styles.card}>
        <InfoRow icon="phone" label="Phone" value={user.phone} />
        <InfoRow icon="email" label="Email" value={user.email} />
        <InfoRow icon="map-marker" label="City" value={user.city} />
        <InfoRow icon="map" label="State" value={user.state} />
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.row}>
    <Icon name={icon} size={24} color="#4e8bed" style={styles.icon} />
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f8fe',
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
    marginTop: 20,
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
  problem: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
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
