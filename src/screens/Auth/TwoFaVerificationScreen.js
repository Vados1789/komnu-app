import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig.js';
import { AuthContext } from '../../context/AuthContext';

export default function TwoFaVerificationScreen({ route, navigation }) {
  const [code, setCode] = useState('');
  const { userId } = route.params; // Receive userId from the previous screen
  const { login } = useContext(AuthContext); // Access the login function from AuthContext

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}Login/verify-2fa`, {
        userId,
        token: code,
      });

      if (response.data.message === "2FA Verification successful") {
        // Log the user data in the context after successful verification
        await login(response.data.user);

        Alert.alert('Success', 'Verification successful!');
        navigation.replace('MainTabs'); // Navigate to the main screen
      }
    } catch (error) {
      console.error("Error during 2FA verification:", error);
      Alert.alert('Verification Failed', 'Invalid or expired verification code.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />
      <Button title="Verify Code" onPress={handleVerifyCode} />
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
  }
});
