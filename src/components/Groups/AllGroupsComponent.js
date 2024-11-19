import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import { saveToCache, loadFromCache } from '../../cache/cacheManager.js';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig.js';
import IMAGE_BASE_URL from '../../config/imageConfig.js';

export default function AllGroupsComponent({ searchText }) {
  const { user } = useContext(AuthContext); // AuthContext to get userId
  const [allGroups, setAllGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);

  const CACHE_KEY = `all_groups_${user?.userId}`; // Cache key for storing group data
  const defaultImageUri = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

  useEffect(() => {
    const loadCachedGroups = async () => {
      const cachedData = await loadFromCache(CACHE_KEY);
      if (cachedData) {
        setAllGroups(cachedData);
        setFilteredGroups(cachedData);
      }
    };

    const fetchAllGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}Groups`);
        const groups = response.data.$values || response.data; // Handle multiple formats from backend
        setAllGroups(groups);
        setFilteredGroups(groups);
        await saveToCache(CACHE_KEY, groups); // Save groups to cache
      } catch (error) {
        console.error('Error fetching all groups:', error);
        // Load cached data if fetch fails
        await loadCachedGroups();
      }
    };

    if (user) {
      fetchAllGroups();
    }
  }, [user, CACHE_KEY]);

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

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}Groups/join/${groupId}`,
        user.userId,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setAllGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.groupId === groupId
            ? { ...group, members: [...group.members, { userId: user.userId }] }
            : group
        )
      );

      // Update cache
      const updatedGroups = allGroups.map((group) =>
        group.groupId === groupId
          ? { ...group, members: [...group.members, { userId: user.userId }] }
          : group
      );
      await saveToCache(CACHE_KEY, updatedGroups);
    } catch (error) {
      console.error('Error joining group:', error);
      Alert.alert('Error', 'Unable to join the group.');
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}Groups/leave/${groupId}`,
        user.userId,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setAllGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.groupId === groupId
            ? { ...group, members: group.members.filter((m) => m.userId !== user.userId) }
            : group
        )
      );

      // Update cache
      const updatedGroups = allGroups.map((group) =>
        group.groupId === groupId
          ? { ...group, members: group.members.filter((m) => m.userId !== user.userId) }
          : group
      );
      await saveToCache(CACHE_KEY, updatedGroups);
    } catch (error) {
      console.error('Error leaving group:', error);
      Alert.alert('Error', 'Unable to leave the group.');
    }
  };

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
    backgroundColor: '#ff4d4d',
  },
  leaveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
