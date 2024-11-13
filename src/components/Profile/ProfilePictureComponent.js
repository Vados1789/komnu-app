import React, { useContext } from 'react';
import { Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../context/AuthContext';
import IMAGE_BASE_URL from '../../config/imageConfig';
import updateUserProfilePicture from './UpdateUserProfilePicture';

const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/100';

const ProfilePictureComponent = () => {
  const { user, login } = useContext(AuthContext);

  const handleImagePick = () => {
    Alert.alert(
      "Update Profile Picture",
      "Choose an option",
      [
        { text: "Take Photo", onPress: () => pickImage('camera') },
        { text: "Choose from Library", onPress: () => pickImage('library') },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const pickImage = async (source) => {
    try {
      let result;
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        const updatedUser = await updateUserProfilePicture(user.userId, imageUri);
        if (updatedUser) {
          await login(updatedUser); // Update user data in AuthContext
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Could not update profile picture. Please try again.");
    }
  };

  const profilePictureUrl = user?.profilePicture
    ? `${IMAGE_BASE_URL}${user.profilePicture}`
    : DEFAULT_IMAGE_URL;

  return (
    <TouchableOpacity onPress={handleImagePick}>
      <Image source={{ uri: profilePictureUrl }} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: { width: 100, height: 100, borderRadius: 50 },
});

export default ProfilePictureComponent;
