import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    username: 'simplifiedTestUser',
    email: 'simplified@example.com',
    profilePicture: 'https://example.com/profile.jpg',
    bio: 'Just a test user',
    dateOfBirth: '1990-01-01' // This can be set to '' if you want to make it optional by default
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    console.log(formData);

    // Basic input validation
    if (!formData.username || !formData.email) {
      Alert.alert('Error', 'Username and Email are required.');
      return;
    }

    try {
      const response = await axios.post(
        'http://10.71.106.234:5202/api/Users', // Ensure the backend URL is correct and accessible
        formData
      );

      console.log(response.data);
      Alert.alert('Success', 'User created successfully!');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        console.log(error.response.data);
        Alert.alert('Error', error.response.data);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={formData.username}
        onChangeText={(value) => handleInputChange('username', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Profile Picture URL"
        value={formData.profilePicture}
        onChangeText={(value) => handleInputChange('profilePicture', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={formData.bio}
        onChangeText={(value) => handleInputChange('bio', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={formData.dateOfBirth}
        onChangeText={(value) => handleInputChange('dateOfBirth', value)}
      />
      <Button title="Create" onPress={handleRegister} />
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
});
