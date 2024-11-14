// EditProfileScreen.js
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfilePictureComponent from '../../components/Profile/ProfilePictureComponent';
import { AuthContext } from '../../context/AuthContext';

const EditProfileScreen = ({ navigation }) => {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');

  const handleSaveChanges = async () => {
    const updatedUser = { ...user, username, email, phoneNumber, bio, dateOfBirth };

    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      login(updatedUser); // Update context
      Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
      navigation.goBack();
    } catch (error) {
      console.log("Error saving updated user data:", error);
      Alert.alert("Error", "Could not save changes.");
    }
  };

  return (
    <View style={styles.container}>
      <ProfilePictureComponent editable={true} />

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Birthdate (YYYY-MM-DD)"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />

      <Button title="Save Changes" onPress={handleSaveChanges} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default EditProfileScreen;
