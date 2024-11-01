import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig.js';
import IMAGE_BASE_URL from '../../config/imageConfig.js';

export default function FriendRequestComponent({ searchText }) {
  const { user } = useContext(AuthContext);
  const [friendRequests, setFriendRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (user && user.userId) {
        try {
          const response = await axios.get(`${API_BASE_URL}Friends/requests/${user.userId}`);
          setFriendRequests(response.data);
          setFilteredRequests(response.data);
        } catch (error) {
          console.error("Error fetching friend requests:", error);
        }
      }
    };

    fetchFriendRequests();
  }, [user]);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredRequests(friendRequests);
    } else {
      const lowercasedSearchText = searchText.toLowerCase();
      setFilteredRequests(
        friendRequests.filter(request =>
          request.username.toLowerCase().includes(lowercasedSearchText)
        )
      );
    }
  }, [searchText, friendRequests]);

  const handleAccept = async (friendId) => {
    try {
      await axios.post(
        `${API_BASE_URL}Friends/confirm`,
        { friendId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      Alert.alert("Success", "Friend request accepted.");
      setFriendRequests(friendRequests.filter(request => request.friendId !== friendId));
    } catch (error) {
      console.error("Error accepting friend request:", error);
      Alert.alert("Error", "Unable to accept friend request.");
    }
  };

  const handleReject = async (friendId) => {
    try {
      await axios.post(
        `${API_BASE_URL}Friends/remove`,
        { friendId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      Alert.alert("Success", "Friend request rejected.");
      setFriendRequests(friendRequests.filter(request => request.friendId !== friendId));
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      Alert.alert("Error", "Unable to reject friend request.");
    }
  };

  return (
    <FlatList
      data={filteredRequests}
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
            <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item.friendId)}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.friendId)}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
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
    flex: 1,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  acceptButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
