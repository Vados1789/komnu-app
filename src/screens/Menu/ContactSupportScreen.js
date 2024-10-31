import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as MailComposer from 'expo-mail-composer';

export default function ContactSupportScreen() {
  const [emailBody, setEmailBody] = useState('');

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

      MailComposer.composeAsync({
        recipients: ['support@example.com'], // Replace with your support email
        subject: 'Support Request',
        body: emailBody,
      }).then(result => {
        if (result.status === 'sent') {
          Alert.alert('Success', 'Your message has been sent.');
          setEmailBody(''); // Clear the input
        } else {
          Alert.alert('Error', 'Failed to send your message.');
        }
      });
    } catch (error) {
      console.error('Error sending email:', error);
      Alert.alert('Error', 'Unable to send email at this time.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write email to out support team</Text>
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
    textAlignVertical: 'top', // Aligns text at the top
  },
});
