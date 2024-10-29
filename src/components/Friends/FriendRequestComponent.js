import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig.js';

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
          <Text>{item.username || 'No Username Available'}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  friendRequestItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
