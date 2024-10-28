import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

const IMAGE_BASE_URL = 'http://10.71.106.236:5202'; // Base URL for your images
const USER_ID = 45; // ID for the user "Tj"

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${IMAGE_BASE_URL}/api/users/${USER_ID}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Function to fetch the image separately if needed
  const fetchImage = async (imagePath) => {
    try {
      const response = await axios.get(`${IMAGE_BASE_URL}${imagePath}`);
      return response.data; // or response.data if it's the image blob
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Show loading indicator while fetching
  }

  if (!userData) {
    return <Text>Error loading user data.</Text>; // Handle case where no user data is fetched
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile: {userData.username}</Text>
      {userData.profilePicture ? (
        <Image
          source={{ uri: `${IMAGE_BASE_URL}${userData.profilePicture}` }} // Constructing the full URL for the profile picture
          style={styles.profilePicture}
          resizeMode="cover"
        />
      ) : (
        <Text>No profile picture available</Text> // Fallback if no picture
      )}
      <Text style={styles.bio}>Bio: {userData.bio}</Text>
      <Text style={styles.email}>Email: {userData.email}</Text>
      <Text style={styles.phone}>Phone: {userData.phoneNumber}</Text>
      <Text style={styles.dob}>Date of Birth: {new Date(userData.dateOfBirth).toLocaleDateString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  bio: {
    fontSize: 16,
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    marginBottom: 10,
  },
  phone: {
    fontSize: 16,
    marginBottom: 10,
  },
  dob: {
    fontSize: 16,
    marginBottom: 10,
  },
});
