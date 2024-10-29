import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const IMAGE_BASE_URL = 'http://10.71.106.236:5202';
const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/100';

export default function ProfileScreen() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    return <Text>Error loading user data.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile: {user.username}</Text>
      <Image
        source={{
          uri: user.profilePicture ? `${IMAGE_BASE_URL}${user.profilePicture}` : DEFAULT_IMAGE_URL,
        }}
        style={styles.profilePicture}
        resizeMode="cover"
      />
      <Text style={styles.bio}>Bio: {user.bio || 'No bio available'}</Text>
      <Text style={styles.email}>Email: {user.email}</Text>
      <Text style={styles.phone}>Phone: {user.phoneNumber || 'Not provided'}</Text>
      <Text style={styles.dob}>
        Date of Birth: {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
      </Text>
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
