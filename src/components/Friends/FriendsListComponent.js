import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig.js';

export default function FriendsListComponent() {
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (user && user.userId) {
        try {
          const response = await axios.get(`${API_BASE_URL}Friends/list/${user.userId}`);
          console.log("Friends data received:", response.data); // Add logging here
          setFriends(response.data);
        } catch (error) {
          console.error("Error fetching friends list:", error);
        }
      }
    };
  
    fetchFriends();
  }, [user]);

  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => (item.FriendId ? item.FriendId.toString() : Math.random().toString())}

      renderItem={({ item }) => (
        <Text>{item.Username || 'No Username Available'}</Text>
      )}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
});
