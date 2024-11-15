import { Alert } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';

const mimeTypes = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };

const updateUserProfilePicture = async (userId, newProfilePictureUri) => {
  if (!userId || !newProfilePictureUri) {
    Alert.alert('Error', 'User ID and new profile picture URI are required.');
    return null;
  }

  const formData = new FormData();
  formData.append('profilePicture', {
    uri: newProfilePictureUri,
    name: newProfilePictureUri.split('/').pop(),
    type: mimeTypes[newProfilePictureUri.split('.').pop().toLowerCase()] || 'application/octet-stream',
  });

  try {
    const { data, status } = await axios.put(
      `${API_BASE_URL}profile/${userId}/upload-picture`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    if (status === 200 && data) {
      const profilePictureUrl = data.ProfilePictureUrl || data.user?.profilePicture || data.profilePicture;
      if (profilePictureUrl) {
        return { ...data.user, profilePicture: profilePictureUrl };
      } else {
        Alert.alert('Upload Successful', 'Profile picture URL missing. Try reloading.');
      }
    } else {
      Alert.alert('Upload Failed', 'Unexpected response format.');
    }
  } catch (error) {
    const status = error.response?.status;
    const errorMsg = status === 404 ? 'Endpoint not found.' :
                     status === 500 ? 'Server error. Try again later.' :
                     error.request ? 'No response from server. Check connection.' :
                     'An unexpected error occurred.';
    Alert.alert('Error', errorMsg);
  }
  return null;
};

export default updateUserProfilePicture;
