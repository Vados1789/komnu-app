import { Alert } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';

const getMimeType = (uri) => {
  const extension = uri.split('.').pop().toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
};

const updateUserProfilePicture = async (userId, newProfilePictureUri) => {
  if (!userId) {
    Alert.alert('Invalid User', 'User ID is required to update the profile picture.');
    return null;
  }
  
  if (!newProfilePictureUri) {
    Alert.alert('No Picture Selected', 'Please select a new profile picture to save.');
    return null;
  }

  const formData = new FormData();
  formData.append('profilePicture', {
    uri: newProfilePictureUri,
    name: newProfilePictureUri.split('/').pop(),
    type: getMimeType(newProfilePictureUri),
  });

  try {
    const response = await axios.put(
      `${API_BASE_URL}profile/${userId}/upload-picture`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status === 200 && response.data) {
      const profilePictureUrl = response.data.ProfilePictureUrl || response.data.user?.profilePicture || response.data.profilePicture;
      if (profilePictureUrl) {
        return {
          ...response.data.user,
          profilePicture: profilePictureUrl,
        };
      } else {
        Alert.alert('Upload Successful', 'But profile picture URL is missing. Try reloading.');
        return null;
      }
    } else {
      Alert.alert('Upload Failed', 'Unexpected response status or data format.');
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
    Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    return null;
  }
};

export default updateUserProfilePicture;
