import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, Picker, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function LoginSettingsScreen({ route, navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTwoFaEnabled, setIsTwoFaEnabled] = useState(false);
  const [twoFaMethod, setTwoFaMethod] = useState('');

  useEffect(() => {
    if (route.params && route.params.userId) {
      console.log("Registered User ID:", route.params.userId);
    }
  }, [route.params]);

  const handleSaveSettings = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    // Encrypt the password before sending it (consider using a library like bcryptjs)
    try {
      const response = await axios.post(
        'http://10.71.106.236:5202/api/Logins', // Updated IP address
        {
          userId: route.params.userId, // Pass the userId from the previous screen
          password,
          isTwoFaEnabled,
          twoFaMethod
        }
      );

      Alert.alert('Success', 'Login settings saved successfully!');
      // Navigate to the login screen or home screen after configuration
      navigation.navigate('Home');
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
          onValueChange={setIsTwoFaEnabled}
        />
      </View>

      {isTwoFaEnabled && (
        <Picker
          selectedValue={twoFaMethod}
          style={styles.picker}
          onValueChange={(value) => setTwoFaMethod(value)}
        >
          <Picker.Item label="Select 2FA Method" value="" />
          <Picker.Item label="SMS" value="sms" />
          <Picker.Item label="Email" value="email" />
          <Picker.Item label="Authenticator App" value="authenticator" />
        </Picker>
      )}

      <Button title="Save Settings" onPress={handleSaveSettings} />
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
    marginVertical: 15,
  },
  picker: {
    height: 50,
    marginVertical: 10,
  },
});
