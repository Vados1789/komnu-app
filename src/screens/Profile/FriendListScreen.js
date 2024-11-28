import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import IMAGE_BASE_URL from '../../config/imageConfig';

export default function FriendListScreen({ route }) {
  const { userId } = route.params; // User ID passed from ProfileScreen
  const [friends, setFriends] = useState([]);
  const [searchText, setSearchText] = useState('');

  // Fetch friends when the component mounts
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}Friends/list/${userId}`);
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [userId]);

  // Filter friends based on search text
  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderFriend = ({ item }) => (
    <View style={styles.friendContainer}>
      <Image
        source={{
          uri: item.profilePicture
            ? `${IMAGE_BASE_URL}${item.profilePicture}`
            : 'https://via.placeholder.com/50',
        }}
        style={styles.profileImage}
      />
      <View style={styles.friendDetails}>
        <Text style={styles.friendName}>{item.username}</Text>
        <Text style={styles.mutualFriends}>{item.mutualFriends || 0} mutual friends</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for friends..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Friends List */}
      {filteredFriends.length > 0 ? (
        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item.friendId.toString()}
          renderItem={renderFriend}
          style={styles.friendList}
        />
      ) : (
        <Text style={styles.noResultsText}>No friends found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  friendList: {
    flex: 1,
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mutualFriends: {
    fontSize: 14,
    color: '#666',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});
