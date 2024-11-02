// Importing necessary dependencies
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext'; // Importing AuthContext to access user data
import updateUserProfilePicture from '../../components/Profile/UpdateUserProfilePicture'; // Profile picture update function
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing updated user data
import Icon from 'react-native-vector-icons/MaterialIcons';
import IMAGE_BASE_URL from '../../config/imageConfig';

const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/100'; // Default profile picture URL

export default function ProfileScreen({ navigation }) {
  // Accessing user and loading state from AuthContext
  const { user, isLoading } = useContext(AuthContext);

  // State variables
  const [newProfilePicture, setNewProfilePicture] = useState(null); // Holds selected profile picture URI
  const [uploading, setUploading] = useState(false); // Controls loading state during picture upload
  const [imageKey, setImageKey] = useState(0); // Used to force image re-render after updates
  const [localUser, setLocalUser] = useState(user); // Local state for user data
  const [bioBackgroundColor, setBioBackgroundColor] = useState('#f0f8ff'); // Background color for bio section
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState('#f5f5f5'); // Background color for header

  // Requesting camera permissions on component mount
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'You need to grant permission to access the camera.');
      }
    };
    requestPermission();
  }, []);

  // Function to pick an image from the camera or library
  const pickImage = async (source) => {
    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    }

    if (!result.canceled) {
      setNewProfilePicture(result.assets[0].uri);
    }
  };

  // Function to handle saving the selected profile picture
  const handleSaveProfilePicture = async () => {
    if (!newProfilePicture) {
      Alert.alert('No Picture Selected', 'Please select a new profile picture.');
      return;
    }

    setUploading(true); // Set loading state

    try {
      // Updating profile picture via backend function
      const updatedUserData = await updateUserProfilePicture(user.userId, newProfilePicture);

      if (updatedUserData) {
        await AsyncStorage.setItem('user', JSON.stringify(updatedUserData)); // Store updated user data locally

        setLocalUser(updatedUserData); // Update local user state
        setImageKey(prevKey => prevKey + 1); // Force image re-render
        setNewProfilePicture(null); // Reset new profile picture

        Alert.alert('Profile Updated', 'Your profile picture has been updated.');
      } else {
        Alert.alert('Error', 'Failed to update profile picture.');
      }
    } catch (error) {
      console.error('Error occurred while saving profile picture:', error);
      Alert.alert('Error', 'An error occurred while updating your profile picture.');
    } finally {
      setUploading(false); // Reset loading state
    }
  };

  // Toggle background color for bio section
  const toggleBioBackground = () => {
    setBioBackgroundColor(prevColor => (prevColor === '#f0f8ff' ? '#e6ffe6' : '#f0f8ff'));
  };

  // Toggle background color for header section
  const toggleHeaderBackground = () => {
    setHeaderBackgroundColor(prevColor => (prevColor === '#f5f5f5' ? '#ffe6e6' : '#f5f5f5'));
  };

  // Show loading indicator if data is still loading
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Main render of profile screen
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header section with profile picture and edit options */}
      <TouchableOpacity onPress={toggleHeaderBackground}>
        <View style={[styles.headerContainer, { backgroundColor: headerBackgroundColor }]}>
          <Image
            key={imageKey} // Rerenders when image key changes
            source={{
              uri: newProfilePicture || `${IMAGE_BASE_URL}${localUser.profilePicture}?${new Date().getTime()}` || DEFAULT_IMAGE_URL,
            }}
            style={styles.profilePicture}
          />
          
          <TouchableOpacity style={styles.changePictureButton} onPress={() => pickImage('library')}>
            <Text style={styles.changePictureButtonText}>Choose from Library</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.changePictureButton} onPress={() => pickImage('camera')}>
            <Text style={styles.changePictureButtonText}>Take a Photo</Text>
          </TouchableOpacity>

          {uploading ? (
            <ActivityIndicator size="small" color="#0000ff" /> // Show loading during upload
          ) : (
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfilePicture}>
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
          )}

          {/* Display user information */}
          <Text style={styles.username}>{localUser.username}</Text>
          <Text style={styles.friendCount}>{localUser.friendsCount || 0} friends</Text>
        </View>
      </TouchableOpacity>

      {/* Bio section with toggleable background */}
      <TouchableOpacity onPress={toggleBioBackground}>
        <View style={[styles.bioContainer, { backgroundColor: bioBackgroundColor }]}>
          <Text style={styles.bio}>{localUser.bio || 'No bio available'}</Text>
        </View>
      </TouchableOpacity>

      {/* Additional user information section */}
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

// Styles for ProfileScreen components
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
    borderColor: '#007bff', 
    marginBottom: 10 
  },
  changePictureButton: { 
    backgroundColor: '#007bff', 
    paddingVertical: 6, 
    paddingHorizontal: 15, 
    borderRadius: 5, 
    marginVertical: 10 
  },
  changePictureButtonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  saveButton: { 
    backgroundColor: '#28a745', 
    borderRadius: 5, 
    padding: 10, 
    alignItems: 'center', 
    marginTop: 10 
  },
  saveButtonText: { 
    color: '#fff', 
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
    backgroundColor: '#f9f9f9' 
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
