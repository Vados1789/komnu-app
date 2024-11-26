import React, { useContext, useState, useEffect, useLayoutEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import ProfilePictureComponent from '../../components/Profile/ProfilePictureComponent';
import ProfileInfoComponent from '../../components/Profile/ProfileInfoComponent';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [friendCount, setFriendCount] = useState(0);

  // Function to fetch friend count
  const fetchFriendCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}Friends/list/${user.userId}`);
      setFriendCount(response.data.length);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  // Fetch friends when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchFriendCount();
    }, [])
  );

  // Set header options dynamically
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen')}>
          <Icon name="edit" size={24} color="#007bff" style={styles.icon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <ProfilePictureComponent editable={false} />

      {/* Friends Section */}
      <TouchableOpacity
        style={styles.friendsContainer}
        onPress={() => navigation.navigate('FriendListScreen', { userId: user.userId })}
        activeOpacity={0.8}
      >
        <Text style={styles.friendsLabel}>Friends</Text>
        <Text style={styles.friendsCount}>{friendCount}</Text>
      </TouchableOpacity>

      {/* Profile Info */}
      <ProfileInfoComponent localUser={user} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 15,
  },
  loadingText: {
    fontSize: Platform.OS === 'android' ? 18 : 20,
    color: '#777',
    textAlign: 'center',
  },
  friendsContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#e6f0ff',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: width * 0.6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  friendsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0056b3',
    marginBottom: 5,
  },
  friendsCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
  },
});

export default ProfileScreen;
