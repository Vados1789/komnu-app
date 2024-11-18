import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig.js';
import IMAGE_BASE_URL from '../../config/imageConfig.js';

export default function AllGroupsComponent({ searchText }) {
  const { user } = useContext(AuthContext); // AuthContext to get userId
  const [allGroups, setAllGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);

  const defaultImageUri = 'https://example.com/default-image.png'; // Replace with your actual default image URL

  // Fetch all groups on mount
  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}Groups`);
        const groups = response.data.$values || response.data; // Handle multiple formats from backend
        setAllGroups(groups);
        setFilteredGroups(groups); // Initialize filtered groups
      } catch (error) {
        console.error('Error fetching all groups:', error);
        Alert.alert('Error', 'Unable to fetch groups.');
      }
    };

    fetchAllGroups();
  }, []);

  // Filter groups by search text
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredGroups(allGroups);
    } else {
      setFilteredGroups(
        allGroups.filter((group) =>
          group.groupName.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, allGroups]);

  // Join a group
  const handleJoinGroup = async (groupId) => {
    console.log('Attempting to join group:', groupId);
    console.log('Trying to join with user:', user.userId);
    try {
      const response = await axios.post(
        `${API_BASE_URL}Groups/join/${groupId}`,
        user.userId, // Pass the userId directly as the body
        { headers: { 'Content-Type': 'application/json' } }
      );
      Alert.alert('Success', response.data || 'You have joined the group.');
  
      // Update group status immediately
      setAllGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.groupId === groupId
            ? { ...group, members: [...group.members, { userId: user.userId }] }
            : group
        )
      );
    } catch (error) {
      console.error('Error joining group:', error);
      const errorMessage =
        typeof error.response?.data === 'string'
          ? error.response?.data
          : 'Unable to join the group.';
      Alert.alert('Error', errorMessage);
    }
  };

  // Leave a group
  const handleLeaveGroup = async (groupId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}Groups/leave/${groupId}`,
        { userId: user.userId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      Alert.alert('Success', response.data || 'You have left the group.');

      // Update group status immediately
      setAllGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.groupId === groupId
            ? { ...group, members: group.members.filter((m) => m.userId !== user.userId) }
            : group
        )
      );
    } catch (error) {
      console.error('Error leaving group:', error);
      const errorMessage =
        typeof error.response?.data === 'string'
          ? error.response?.data
          : 'Unable to leave the group.';
      Alert.alert('Error', errorMessage);
    }
  };

  // Check if the current user is a member of the group
  const isUserMember = (group) => {
    return group.members.some((member) => member.userId === user.userId);
  };

  return (
    <FlatList
      data={filteredGroups}
      keyExtractor={(item) => item.groupId.toString()}
      ListEmptyComponent={<Text>No groups available.</Text>}
      renderItem={({ item }) => (
        <View style={styles.groupContainer}>
          <Image
            source={{
              uri: item.imageUrl ? `${IMAGE_BASE_URL}${item.imageUrl}` : defaultImageUri,
            }}
            style={styles.groupImage}
            onError={() => (item.imageUrl = defaultImageUri)}
          />
          <Text style={styles.groupName}>{item.groupName}</Text>
          {isUserMember(item) ? (
            <TouchableOpacity
              style={[styles.joinButton, styles.leaveButton]}
              onPress={() => handleLeaveGroup(item.groupId)}
            >
              <Text style={styles.leaveButtonText}>Leave Group</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => handleJoinGroup(item.groupId)}
            >
              <Text style={styles.joinButtonText}>Join Group</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  groupName: {
    fontSize: 18,
    flex: 1,
  },
  joinButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  leaveButton: {
    backgroundColor: '#ff4d4d', // Red color for Leave Group button
  },
  leaveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
