import AsyncStorage from '@react-native-async-storage/async-storage';
import updateUserProfilePicture from './UpdateUserProfilePicture';
import API_BASE_URL from '../../config/apiConfig';
import axios from 'axios';

/**
 * Updates the user profile information, including profile picture and friend count.
 * 
 * @param {string} userId - The ID of the user whose profile is being updated.
 * @param {Object} updatedInfo - An object containing the updated profile information.
 * @returns {Object|null} The updated user information, or null if an error occurred.
 */
async function updateUserProfileInfo(userId, updatedInfo) {
  try {
    // Update the user's profile picture or other info as per updatedInfo
    const updatedUser = await updateUserProfilePicture(userId, updatedInfo.profilePicture);

    if (!updatedUser) {
      throw new Error("Failed to update profile picture");
    }

    // Fetch the updated friend count
    const response = await axios.get(`${API_BASE_URL}Friends/list/${userId}`);
    updatedUser.friendsCount = response.data.length; // Set friend count based on friends array length

    // Store the updated user information locally in AsyncStorage
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

    // Return the updated user data
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile info:", error);
    return null;
  }
}

export default updateUserProfileInfo;
