import { Alert } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';

const updateUserProfilePicture = async (userId, newProfilePictureUri) => {
  if (!userId) {
    Alert.alert('Invalid User', 'User ID is required to update the profile picture.');
    return;
  }
  
  if (!newProfilePictureUri) {
    Alert.alert('No picture selected', 'Please select a new profile picture to save.');
    return;
  }

  const formData = new FormData();
  formData.append('profilePicture', {
    uri: newProfilePictureUri,
    name: newProfilePictureUri.split('/').pop(),
    type: 'image/jpeg', // You might want to make this dynamic based on the file type
  });

  try {
    console.log('Sending request to update profile picture...');
    const response = await axios.put(
      `${API_BASE_URL}profile/${userId}/upload-picture`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('Response status:', response.status);

    if (response.status === 200) {
      console.log('Profile picture update response:', response.data);
      return { ...response.data.user, profilePicture: response.data.ProfilePictureUrl };
    } else {
      Alert.alert('Upload Failed', 'There was an error updating your profile picture.');
      return null;
    }
  } catch (error) {
    if (error.response) {
      console.error('Server responded with:', error.response.status);
      Alert.alert('Error', `Server responded with status: ${error.response.status}`);
    } else if (error.request) {
      console.error('No response received:', error.request);
      Alert.alert('Error', 'No response from server. Please try again later.');
    } else {
      console.error('Error:', error.message);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
    return null;
  }
};

export default updateUserProfilePicture;
