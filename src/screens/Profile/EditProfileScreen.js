import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../../config/apiConfig';
import IMAGE_BASE_URL from '../../config/imageConfig';
import { AuthContext } from '../../context/AuthContext';

const EditProfileScreen = ({ navigation }) => {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.dateOfBirth ? new Date(user.dateOfBirth) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(
    user?.profilePicture ? `${IMAGE_BASE_URL}${user.profilePicture}` : null
  );
  const [isSaving, setIsSaving] = useState(false);

  // Handle image selection or capture
  const handleProfilePicturePress = () => {
    Alert.alert('Update Profile Picture', 'Choose an option', [
      { text: 'Take Photo', onPress: () => handlePickImage(true) },
      { text: 'Choose from Library', onPress: () => handlePickImage(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handlePickImage = async (useCamera) => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    };

    try {
      let result;
      if (useCamera) {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled) {
        setProfileImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while selecting the image.');
    }
  };

  // Handle date selection
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  // Save profile changes
  const handleSaveChanges = async () => {
    if (!username.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'Username and email cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('userId', user.userId);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('phoneNumber', phoneNumber);
      formData.append('bio', bio);
      formData.append('dateOfBirth', dateOfBirth.toISOString());

      if (profileImageUri) {
        const filename = profileImageUri.split('/').pop();
        const fileType = filename.split('.').pop();
        formData.append('profilePicture', {
          uri: profileImageUri,
          name: filename,
          type: `image/${fileType}`,
        });
      }

      const response = await axios.put(
        `${API_BASE_URL}profile/${user.userId}/update`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.status === 200) {
        const updatedUser = response.data.user;
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        login(updatedUser);
        Alert.alert('Success', 'Profile updated successfully.');
        navigation.navigate('MainTabs', { screen: 'ProfileScreen' }); // Navigate back to ProfileScreen
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An unexpected error occurred while updating your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TouchableOpacity onPress={handleProfilePicturePress} style={styles.imageContainer}>
        <Image
          source={{
            uri: profileImageUri || 'https://via.placeholder.com/100',
          }}
          style={styles.image}
        />
      </TouchableOpacity>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} />
      <TextInput style={styles.input} placeholder="Bio" value={bio} onChangeText={setBio} multiline />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
        <Text style={styles.datePickerText}>{`Birthdate: ${dateOfBirth.toISOString().split('T')[0]}`}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      <Button title={isSaving ? 'Saving...' : 'Save Changes'} onPress={handleSaveChanges} disabled={isSaving} />
    </View>
  );
};

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
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  datePickerText: {
    color: '#555',
  },
});

export default EditProfileScreen;
