import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    profilePicture: '', // Add this to prevent errors
    year: '', 
    month: '', 
    day: ''
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    console.log("Data being sent to server:", formData);

    if (!formData.username || !formData.email || !formData.year || !formData.month || !formData.day) {
      Alert.alert('Error', 'Username, Email, and Date of Birth are required.');
      return;
    }

    // Format dateOfBirth
    const dateOfBirth = `${formData.year}-${formData.month}-${formData.day}`;

    // If profilePicture is not provided, use a default image URL
    const profilePicture = formData.profilePicture || "https://example.com/default-profile.jpg";

    try {
      const response = await axios.post(
        'http://10.71.106.234:5202/api/Users',
        {
          ...formData,
          profilePicture, // Ensure a valid profile picture is sent
          dateOfBirth
        }
      );

      console.log("Server response:", response.data);
      Alert.alert('Success', 'User created successfully!');
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response && error.response.data) {
        console.log("Server error response:", error.response.data);
        Alert.alert('Error', error.response.data);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  const generateDays = () => Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const generateMonths = () => Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());
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
        placeholder="Bio"
        value={formData.bio}
        onChangeText={(value) => handleInputChange('bio', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Profile Picture URL"
        value={formData.profilePicture}
        onChangeText={(value) => handleInputChange('profilePicture', value)}
      />

      <View style={styles.datePickerContainer}>
        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.dateInputRow}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.year}
              style={styles.picker}
              onValueChange={(value) => handleInputChange('year', value)}
            >
              <Picker.Item label="Year" value="" />
              {generateYears().map((year) => (
                <Picker.Item key={year} label={year} value={year} />
              ))}
            </Picker>
            <Text style={styles.pickerLabel}>Year</Text>
          </View>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.month}
              style={styles.picker}
              onValueChange={(value) => handleInputChange('month', value)}
            >
              <Picker.Item label="Month" value="" />
              {generateMonths().map((month) => (
                <Picker.Item key={month} label={month} value={month} />
              ))}
            </Picker>
            <Text style={styles.pickerLabel}>Month</Text>
          </View>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.day}
              style={styles.picker}
              onValueChange={(value) => handleInputChange('day', value)}
            >
              <Picker.Item label="Day" value="" />
              {generateDays().map((day) => (
                <Picker.Item key={day} label={day} value={day} />
              ))}
            </Picker>
            <Text style={styles.pickerLabel}>Day</Text>
          </View>
        </View>
      </View>

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
  datePickerContainer: {
    marginBottom: 20,
  },
  dateInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerWrapper: {
    alignItems: 'center',
    width: '30%',
  },
  picker: {
    width: '100%',
  },
  pickerLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#555',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
