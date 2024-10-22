import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePicture: '',
    bio: '',
    dateOfBirth: '',
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    console.log(formData);
    try {
        const response = await axios.post('https://localhost:44373/api/Users', formData);
        console.log(response.data);
        // Handle successful registration (e.g., navigate to login)
      } catch (error) {
        console.error(error);
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
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
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
