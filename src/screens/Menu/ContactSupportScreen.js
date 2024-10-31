import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import { AuthContext } from '../../context/AuthContext';

export default function ContactSupportScreen() {
  const [emailBody, setEmailBody] = useState('');
  const { user } = useContext(AuthContext); // Access user details

  const handleSendEmail = async () => {
    if (emailBody.trim() === '') {
      Alert.alert('Error', 'Please enter a message.');
      return;
    }

    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Mail service is not available.');
        return;
      }

      const emailContent = `
      Support request from:
      Username: ${user?.username || 'N/A'}
      Email: ${user?.email || 'N/A'}
      Message:
      ${emailBody}
      `;

      await MailComposer.composeAsync({
        recipients: ['h5komnu@gmail.com'], // Support email
        subject: 'Support Request',
        body: emailContent,
      });

      Alert.alert('Success', 'Your message has been prepared in your email app.');
      setEmailBody(''); // Clear the input
    } catch (error) {
      console.error('Error preparing email:', error);
      Alert.alert('Error', 'Unable to prepare email at this time.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write an email to our support team</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Write your message here..."
        value={emailBody}
        onChangeText={setEmailBody}
        multiline
      />
      <Button title="Send" onPress={handleSendEmail} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textInput: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
});
