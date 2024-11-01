import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import updateUserProfilePicture from '../../components/Profile/UpdateUserProfilePicture';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IMAGE_BASE_URL from '../../config/imageConfig';

const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/100';

export default function ProfileScreen({ navigation }) {
  const { user, isLoading } = useContext(AuthContext);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageKey, setImageKey] = useState(0); // Key to force image re-render
  const [localUser, setLocalUser] = useState(user); // Local user state to reload updated data
  const [bioBackgroundColor, setBioBackgroundColor] = useState('#f0f8ff');
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState('#f5f5f5');

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'You need to grant permission to access the image library.');
      }
    };

    requestPermission();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewProfilePicture(result.assets[0].uri);
    }
  };

  const handleSaveProfilePicture = async () => {
    if (!newProfilePicture) {
      Alert.alert('No Picture Selected', 'Please select a new profile picture.');
      return;
    }

    setUploading(true);

    try {
      const updatedUserData = await updateUserProfilePicture(user.userId, newProfilePicture);

      if (updatedUserData) {
        // Save updated user data in AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));

        // Update local user state and force image re-render
        setLocalUser(updatedUserData);
        setImageKey(prevKey => prevKey + 1); // Force re-render of the Image component
        setNewProfilePicture(null); // Clear selected picture URI

        Alert.alert('Profile Updated', 'Your profile picture has been updated.');
      } else {
        Alert.alert('Error', 'Failed to update profile picture.');
      }
    } catch (error) {
      console.error('Error occurred while saving profile picture:', error);
      Alert.alert('Error', 'An error occurred while updating your profile picture.');
    } finally {
      setUploading(false);
    }
  };

  const toggleBioBackground = () => {
    setBioBackgroundColor(prevColor => (prevColor === '#f0f8ff' ? '#e6ffe6' : '#f0f8ff'));
  };

  const toggleHeaderBackground = () => {
    setHeaderBackgroundColor(prevColor => (prevColor === '#f5f5f5' ? '#ffe6e6' : '#f5f5f5'));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Toggleable Background */}
      <TouchableOpacity onPress={toggleHeaderBackground}>
        <View style={[styles.headerContainer, { backgroundColor: headerBackgroundColor }]}>
          <Image
            key={imageKey} // Force re-render when key changes
            source={{
              uri: newProfilePicture || `${IMAGE_BASE_URL}${localUser.profilePicture}?${new Date().getTime()}` || DEFAULT_IMAGE_URL,
            }}
            style={styles.profilePicture}
          />
          <TouchableOpacity style={styles.changePictureButton} onPress={pickImage}>
            <Text style={styles.changePictureButtonText}>Change Picture</Text>
          </TouchableOpacity>

          {uploading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfilePicture}>
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.username}>{localUser.username}</Text>
          <Text style={styles.friendCount}>{localUser.friendsCount || 0} friends</Text>
        </View>
      </TouchableOpacity>

      {/* Bio Section with Toggleable Background */}
      <TouchableOpacity onPress={toggleBioBackground}>
        <View style={[styles.bioContainer, { backgroundColor: bioBackgroundColor }]}>
          <Text style={styles.bio}>{localUser.bio || 'No bio available'}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Details</Text>
        <View style={styles.infoTextContainer}>
          <Icon name="email" size={20} color="#007bff" />
          <Text style={styles.infoText}> {localUser.email}</Text>
        </View>
        <View style={styles.infoTextContainer}>
          <Icon name="phone" size={20} color="#007bff" />
          <Text style={styles.infoText}> {localUser.phoneNumber || 'Not provided'}</Text>
        </View>
        <View style={styles.infoTextContainer}>
          <Icon name="event" size={20} color="#007bff" />
          <Text style={styles.infoText}>
            Birthdate: {localUser.dateOfBirth ? new Date(localUser.dateOfBirth).toLocaleDateString() : 'Not provided'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  container: { 
    flexGrow: 1, 
    padding: 20, 
    backgroundColor: '#ffffff' 
  },
  headerContainer: { 
    alignItems: 'center', 
    marginBottom: 20, 
    borderRadius: 10, 
    padding: 20, 
    elevation: 3 
  },
  profilePicture: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    borderWidth: 2, 
    borderColor: '#007bff', // Blue border for profile picture
    marginBottom: 10 
  },
  changePictureButton: { 
    backgroundColor: '#007bff', // Blue background for change picture button
    paddingVertical: 6, 
    paddingHorizontal: 15, 
    borderRadius: 5, 
    marginVertical: 10 
  },
  changePictureButtonText: { 
    color: '#fff', // White text color for button
    fontWeight: 'bold' 
  },
  saveButton: { 
    backgroundColor: '#28a745', // Green background for save button
    borderRadius: 5, 
    padding: 10, 
    alignItems: 'center', 
    marginTop: 10 
  },
  saveButtonText: { 
    color: '#fff', // White text color for save button
    fontWeight: 'bold' 
  },
  username: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  friendCount: { 
    fontSize: 16, 
    marginBottom: 15 
  },
  bioContainer: { 
    padding: 15, 
    borderRadius: 10, 
    marginVertical: 15, 
    alignItems: 'center' 
  },
  bio: { 
    fontSize: 16, 
    fontStyle: 'italic', 
    color: '#333' 
  },
  infoContainer: { 
    padding: 15, 
    borderRadius: 10, 
    backgroundColor: '#f9f9f9' // Light gray background for info container
  },
  infoTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  infoTextContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 5 
  },
  infoText: { 
    fontSize: 16, 
    marginLeft: 10 
  },
});
