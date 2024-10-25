import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig.js';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // Use `login` from AuthContext

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}Login/authenticate`, {
        username,
        password,
      });

      if (response.data.requiresTwoFa) {
        // Navigate to the 2FA verification screen if 2FA is required
        navigation.navigate('TwoFaVerification', { userId: response.data.userId });
      } else {
        // Login without 2FA
        await login(response.data.user);
        navigation.replace('MainTabs');
        Alert.alert('Success', 'Login successful!');
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response && error.response.data) {
        Alert.alert('Login Failed', 'Invalid username or password.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Submit" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.createProfile}>Create Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  createProfile: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
});
