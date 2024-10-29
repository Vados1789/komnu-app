import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const IMAGE_BASE_URL = 'http://10.71.106.236:5202';
const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/100';

export default function ProfileScreen() {
  const { user, isLoading } = useContext(AuthContext);

  // State for bio background color
  const [bioBackgroundColor, setBioBackgroundColor] = useState('#f0f8ff');
  // State for profile header background color
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState('#f5f5f5');

  // Toggle bio background color
  const handleBioPress = () => {
    setBioBackgroundColor(prevColor => (prevColor === '#f0f8ff' ? '#e6ffe6' : '#f0f8ff'));
  };

  // Toggle profile header background color
  const handleHeaderPress = () => {
    setHeaderBackgroundColor(prevColor => (prevColor === '#f5f5f5' ? '#ffe6e6' : '#f5f5f5'));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return <Text>Error loading user data.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Header with TouchableOpacity for background color toggle */}
      <TouchableOpacity onPress={handleHeaderPress}>
        <View style={[styles.headerContainer, { backgroundColor: headerBackgroundColor }]}>
          <Image
            source={{
              uri: user.profilePicture ? `${IMAGE_BASE_URL}${user.profilePicture}` : DEFAULT_IMAGE_URL,
            }}
            style={styles.profilePicture}
          />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.friendCount}>{user.friendsCount || 0} venner</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Tilføj i story</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Rediger profil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Bio section with TouchableOpacity */}
      <TouchableOpacity onPress={handleBioPress}>
        <View style={[styles.bioContainer, { backgroundColor: bioBackgroundColor }]}>
          <Text style={styles.bio}>{user.bio || 'No bio available'}</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Detaljer</Text>
        <View style={styles.infoTextContainer}>
          <Icon name="email" size={20} color="#007bff" />
          <Text style={styles.infoText}> {user.email}</Text>
        </View>
        <View style={styles.infoTextContainer}>
          <Icon name="phone" size={20} color="#007bff" />
          <Text style={styles.infoText}> {user.phoneNumber || 'Ikke angivet'}</Text>
        </View>
        <View style={styles.infoTextContainer}>
          <Icon name="event" size={20} color="#007bff" />
          <Text style={styles.infoText}>
            Fødselsdato: {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Ikke angivet'}
          </Text>
        </View>
      </View>
      
      <View style={styles.friendsContainer}>
        <Text style={styles.friendsTitle}>Venner</Text>
        <View style={styles.friendsList}>
          {[...Array(6)].map((_, index) => (
            <Image
              key={index}
              source={{ uri: DEFAULT_IMAGE_URL }} // Replace with actual friend's profile picture URLs
              style={styles.friendImage}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#007bff',
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  friendCount: {
    fontSize: 16,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bioContainer: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  bio: {
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  infoContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
  },
  friendsContainer: {
    marginTop: 20,
  },
  friendsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  friendsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,
  },
});
