import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig.js';
import IMAGE_BASE_URL from '../../config/imageConfig.js';

export default function FriendsListComponent() {
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (user && user.userId) {
        try {
          const response = await axios.get(`${API_BASE_URL}Friends/list/${user.userId}`);
          console.log("Friends data received:", response.data);
          setFriends(response.data);
        } catch (error) {
          console.error("Error fetching friends list:", error);
        }
      }
    };

    fetchFriends();
  }, [user]);

  const handleRemoveFriend = async (friendId) => {
    try {
      await axios.post(`${API_BASE_URL}Friends/remove`, {
        friendId
      });
      setFriends(friends.filter(friend => friend.FriendId !== friendId));
      Alert.alert("Success", "Friend removed successfully.");
    } catch (error) {
      console.error("Error removing friend:", error);
      Alert.alert("Error", "Unable to remove friend.");
    }
  };

  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => item.friendId.toString()}
      renderItem={({ item }) => (
        <View style={styles.friendContainer}>
          <Image
            source={{
              uri: item.ProfilePicture
                ? `${IMAGE_BASE_URL}${item.ProfilePicture}`
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
