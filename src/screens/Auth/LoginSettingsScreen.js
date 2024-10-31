import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig.js';

export default function LoginSettingsScreen({ route, navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTwoFaEnabled, setIsTwoFaEnabled] = useState(false);
  const [twoFaMethod, setTwoFaMethod] = useState('email'); // Default to "email"
  const [availableTwoFaMethods, setAvailableTwoFaMethods] = useState([]);

  useEffect(() => {
    if (route.params && route.params.userId) {
      console.log("Registered User ID:", route.params.userId);
      fetchUserDetails(route.params.userId);
    }
  }, [route.params]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}Users/${userId}`);
      const user = response.data;

      const methods = [];
      if (user.phoneNumber) methods.push({ label: "Phone Number", value: "sms" });
      if (user.email) methods.push({ label: "Email", value: "email" });

      setAvailableTwoFaMethods(methods);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleSaveSettings = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (isTwoFaEnabled && !twoFaMethod) {
      Alert.alert('Error', 'Please select a Two-Factor Authentication method.');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}Logins`,
        {
          userId: route.params.userId,
          password,
          isTwoFaEnabled,
          twoFaMethod
        }
      );

      Alert.alert('Success', 'Login settings saved successfully! Please log in.');
      navigation.navigate('Login'); // Navigate to Login screen instead of MainTabs
    } catch (error) {
      console.error("Error saving login settings:", error);
      if (error.response && error.response.data) {
        console.log("Server error response:", error.response.data);
        Alert.alert('Error', JSON.stringify(error.response.data.errors));
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Login Settings</Text>

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <View style={styles.switchContainer}>
        <Text>Enable Two-Factor Authentication</Text>
        <Switch
          value={isTwoFaEnabled}
          onValueChange={(value) => {
            setIsTwoFaEnabled(value);
            if (value && !twoFaMethod) {
              setTwoFaMethod('email'); // Default to email if 2FA is enabled
            }
          }}
        />
      </View>

      <View style={styles.twoFaContainer}>
        <Text style={styles.label}>Select 2FA Method</Text>
        <Picker
          selectedValue={twoFaMethod}
          style={styles.picker}
          onValueChange={(value) => setTwoFaMethod(value)}
          enabled={isTwoFaEnabled} // Enable or disable the Picker based on the switch
        >
          {availableTwoFaMethods.map((method, index) => (
            <Picker.Item key={index} label={method.label} value={method.value} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Save Settings" onPress={handleSaveSettings} />
      </View>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  twoFaContainer: {
    marginTop: 1, // Add margin to create space above the Picker
    marginBottom: 100, // Increase space below the Picker to separate it from the button
  },
  picker: {
    height: 50,
    marginVertical: 0, // Remove any extra vertical margin
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20, // Ensure button has enough space to be clearly below the Picker
  }
});
