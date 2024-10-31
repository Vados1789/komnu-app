import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig.js';
import IMAGE_BASE_URL from '../../config/imageConfig.js';
import { AuthContext } from '../../context/AuthContext';

export default function AllPeopleComponent() {
  const { user } = useContext(AuthContext);
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set());
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchAllPeopleWithStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}Friends/all-with-status/${user.userId}`);
        setPeople(response.data);
        setFilteredPeople(response.data); // Initialize filtered people
      } catch (error) {
        console.error("Error fetching people with status:", error);
      }
    };

    if (user) {
      fetchAllPeopleWithStatus();
    }
  }, [user]);

  const handleSendRequest = async (receiverId) => {
    try {
      await axios.post(`${API_BASE_URL}Friends/send`, {
        UserId1: user.userId,
        UserId2: receiverId,
      });
      setSentRequests((prev) => new Set(prev).add(receiverId));
      Alert.alert("Success", "Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      Alert.alert("Error", "Failed to send friend request.");
    }
  };

  const handleRemoveFriend = async (friendId) => {
    console.log("Removing friend with FriendId:", friendId);
    try {
      await axios.post(`${API_BASE_URL}Friends/remove`, {
        FriendId: friendId
      });
      setPeople((prevPeople) => prevPeople.map((person) =>
        person.friendId === friendId ? { ...person, friendStatus: "None", friendId: null } : person
      ));
      setFilteredPeople((prevPeople) => prevPeople.map((person) =>
        person.friendId === friendId ? { ...person, friendStatus: "None", friendId: null } : person
      ));
      Alert.alert("Success", "Friend removed successfully.");
    } catch (error) {
      console.error("Error removing friend:", error.response?.data || error.message);
      Alert.alert("Error", "Unable to remove friend.");
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredPeople(people); // Reset to original list if search is cleared
    } else {
      const filteredData = people.filter((person) =>
        person.username.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPeople(filteredData);
    }
  };

  return (
    <View style={styles.container}>
      {/* Static Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for users..."
        value={searchText}
        onChangeText={handleSearch}
      />
      {/* User List */}
      <FlatList
        data={filteredPeople}
        keyExtractor={(item) => item.userId.toString()}
        renderItem={({ item }) => (
          <View style={styles.personContainer}>
            <Image
              source={{
                uri: item.profilePicture
                  ? `${IMAGE_BASE_URL}${item.profilePicture}`
                  : 'https://via.placeholder.com/50',
              }}
              style={styles.profileImage}
            />
            <View style={styles.textContainer}>
              <Text style={styles.usernameText}>{item.username || 'Unknown User'}</Text>
              <Text style={styles.statusText}>
                {item.friendStatus === "Pending" ? "Request Sent" : item.friendStatus === "Accepted" ? "Friend" : ""}
              </Text>
            </View>
            {item.friendStatus === "None" ? (
              <TouchableOpacity
                style={[styles.addButton, sentRequests.has(item.userId) && styles.requestSentButton]}
                onPress={() => handleSendRequest(item.userId)}
                disabled={sentRequests.has(item.userId)}
              >
                <Text style={styles.addButtonText}>
                  {sentRequests.has(item.userId) ? "Request Sent" : "Add Friend"}
                </Text>
              </TouchableOpacity>
            ) : item.friendStatus === "Pending" ? (
              <View style={styles.pendingLabel}>
                <Text style={styles.pendingText}>Pending</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFriend(item.friendId)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  personContainer: {
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
  statusText: {
    fontSize: 14,
    color: '#888',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  requestSentButton: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  pendingLabel: {
    backgroundColor: '#ffdd57',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  pendingText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
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
