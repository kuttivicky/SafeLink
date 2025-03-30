import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { BACKEND_URL } from '@env';
import { AuthContext } from '../AuthContext';


const AuthScreen = ({ onLogin }) => {
  const { user, setUser } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true); // toggle between login and sign up
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');


  const handleAuth = async () => {// Debugging line
    if (
      !email ||
      !password ||
      (!isLogin && !phone) ||
      (!isLogin && (!confirmPassword || !name))
    ) {
      return Alert.alert('Missing fields', 'Please fill in all fields.');
    }
  
    if (!isLogin && password !== confirmPassword) {
      return Alert.alert('Password mismatch', 'Passwords do not match.');
    }
  
    const url = isLogin
      ? `${BACKEND_URL}/login`
      : `${BACKEND_URL}/register`;
  
    const payload = isLogin
      ? { email, password, phone }
      : { name, email, password, phone };
  
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
  
      if (isLogin) {
        onLogin(); // Redirect to main
        setUser(email);
      } else {
        Alert.alert('Registered!', 'Account created. Please log in.');
        setIsLogin(true);
        setUser(email);
        setName('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>


      {!isLogin && (
        <>
          <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        </>

      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      )}

      <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
        <Text style={styles.authText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.toggleText}>
          {isLogin
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Log In'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f3f8fe' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  authButton: {
    backgroundColor: '#4e8bed',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  authText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  toggleText: { textAlign: 'center', color: '#4e8bed', fontSize: 14 },
});

export default AuthScreen;
