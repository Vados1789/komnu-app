import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig.js';

export default function FriendRequestComponent() {
  const { user } = useContext(AuthContext);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (user && user.userId) {
        try {
          const response = await axios.get(`${API_BASE_URL}Friends/requests/${user.userId}`);
          setFriendRequests(response.data);
        } catch (error) {
          console.error("Error fetching friend requests:", error);
        }
      }
    };

    fetchFriendRequests();
  }, [user]);

  return (
    <FlatList
      data={friendRequests}
      keyExtractor={(item) => item.FriendId.toString()}
      renderItem={({ item }) => (
        <View style={styles.friendRequestItem}>
          <Text>{item.Username || 'No Username Available'}</Text>
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
});
