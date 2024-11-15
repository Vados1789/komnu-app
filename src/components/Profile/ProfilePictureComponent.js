import React, { useContext } from 'react';
import { Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../context/AuthContext';
import IMAGE_BASE_URL from '../../config/imageConfig';
import updateUserProfilePicture from './UpdateUserProfilePicture';

const ProfilePictureComponent = ({ editable }) => {
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
    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 1 });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 1 });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      const updatedUser = await updateUserProfilePicture(user.userId, imageUri);
      
      if (updatedUser) {
        try {
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser)); // Save updated data to AsyncStorage
        } catch (error) {
          console.log("Error saving updated user data to AsyncStorage:", error);
        }
        await login(updatedUser); // Update context
      }
    }
  };

  const profilePictureUrl = user?.profilePicture ? `${IMAGE_BASE_URL}${user.profilePicture}` : 'https://via.placeholder.com/100';

  return (
    <TouchableOpacity onPress={editable ? handleImagePick : null} activeOpacity={editable ? 0.7 : 1}>
      <Image source={{ uri: profilePictureUrl }} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: { width: 100, height: 100, borderRadius: 50 },
});

export default ProfilePictureComponent;
