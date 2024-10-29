import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Button, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig.js';
import IMAGE_BASE_URL from '../../config/imageConfig.js';

export default function FriendRequestComponent() {
  const { user } = useContext(AuthContext);
  const [friendRequests, setFriendRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (user && user.userId) {
        try {
          const response = await axios.get(`${API_BASE_URL}Friends/requests/${user.userId}`);
          console.log('Getting friend requests data received:', response.data);
          setFriendRequests(response.data);
          setError(null); // Reset error if fetch is successful
        } catch (error) {
          console.error("Error fetching friend requests:", error);
          setError("An error occurred while fetching friend requests.");
        }
      }
    };

    fetchFriendRequests();
  }, [user]);

  const handleAccept = async (friendId) => {
    try {
      await axios.post(`${API_BASE_URL}Friends/confirm`, friendId);
      setFriendRequests(friendRequests.filter(request => request.friendId !== friendId));
      Alert.alert("Success", "Friend request accepted.");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      Alert.alert("Error", "Unable to accept friend request.");
    }
  };

  const handleReject = async (friendId) => {
    try {
      await axios.post(`${API_BASE_URL}Friends/remove`, friendId);
      setFriendRequests(friendRequests.filter(request => request.friendId !== friendId));
      Alert.alert("Success", "Friend request rejected.");
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      Alert.alert("Error", "Unable to reject friend request.");
    }
  };

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <FlatList
      data={friendRequests}
      keyExtractor={(item, index) => (item.friendId ? item.friendId.toString() : `temp-key-${index}`)}
      ListEmptyComponent={<Text>No friend requests available.</Text>}
      renderItem={({ item }) => (
        <View style={styles.friendRequestItem}>
          <Image
            source={{
              uri: item.profilePicture
                ? `${IMAGE_BASE_URL}${item.profilePicture}`
                : 'https://via.placeholder.com/50',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.usernameText}>{item.username || 'No Username Available'}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Accept" onPress={() => handleAccept(item.friendId)} />
            <Button title="Reject" color="red" onPress={() => handleReject(item.friendId)} />
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  friendRequestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  usernameText: {
    flex: 1, // Occupies remaining space on the left
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10, // Add some space between buttons
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
