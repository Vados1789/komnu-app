import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { saveToCache, loadFromCache } from '../../cache/cacheManager';
import API_BASE_URL from '../../config/apiConfig.js';
import IMAGE_BASE_URL from '../../config/imageConfig.js';

export default function FriendsListComponent({ searchText }) {
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);

  const CACHE_KEY = `friends_${user?.userId}_list`;

  // Load cached data when the component mounts
  useEffect(() => {
    const loadCachedData = async () => {
      const cachedData = await loadFromCache(CACHE_KEY);
      if (cachedData) {
        console.log("Loaded friends from cache:", cachedData);
        setFriends(cachedData);
        setFilteredFriends(cachedData);
      }
    };

    loadCachedData();
  }, [CACHE_KEY]);

  // Fetch friends from the server
  useEffect(() => {
    const fetchFriends = async () => {
      if (user && user.userId) {
        try {
          const response = await axios.get(`${API_BASE_URL}Friends/list/${user.userId}`);
          console.log("Friends data received:", response.data);
          setFriends(response.data);
          setFilteredFriends(response.data);

          // Save the fetched data to cache
          await saveToCache(CACHE_KEY, response.data);
        } catch (error) {
          console.error("Error fetching friends list:", error);

          // If fetching fails, load from cache
          const cachedData = await loadFromCache(CACHE_KEY);
          if (cachedData) {
            console.log("Loaded friends from cache due to network error.");
            setFriends(cachedData);
            setFilteredFriends(cachedData);
          } else {
            Alert.alert("Error", "Unable to load friends. Please check your internet connection.");
          }
        }
      }
    };

    fetchFriends();
  }, [user, CACHE_KEY]);

  // Update filtered friends whenever searchText changes
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredFriends(friends);
    } else {
      setFilteredFriends(
        friends.filter(friend =>
          friend.username.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, friends]);

  const handleRemoveFriend = async (friendId) => {
    try {
      await axios.post(`${API_BASE_URL}Friends/remove`, { friendId });
      
      // Update friends and filteredFriends after successful removal
      const updatedFriends = friends.filter(friend => friend.friendId !== friendId);
      setFriends(updatedFriends);
      setFilteredFriends(updatedFriends);

      // Update the cache after removal
      await saveToCache(CACHE_KEY, updatedFriends);

      Alert.alert("Success", "Friend removed successfully.");
    } catch (error) {
      console.error("Error removing friend:", error);
      Alert.alert("Error", "Unable to remove friend.");
    }
  };

  return (
    <FlatList
      data={filteredFriends}
      keyExtractor={(item) => item.friendId.toString()}
      renderItem={({ item }) => (
        <View style={styles.friendContainer}>
          <Image
            source={{
              uri: item.profilePicture
                ? `${IMAGE_BASE_URL}${item.profilePicture}`
                : 'https://via.placeholder.com/50',
            }}
            style={styles.profileImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.usernameText}>{item.username || 'No Username Available'}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFriend(item.friendId)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
