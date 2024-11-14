import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig.js';

export default function AllGroupsComponent({ searchText }) {
  const { user } = useContext(AuthContext);
  const [allGroups, setAllGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);

  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}Groups`);
        setAllGroups(response.data);
        setFilteredGroups(response.data);
      } catch (error) {
        console.error('Error fetching all groups:', error);
      }
    };

    fetchAllGroups();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
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
      await axios.post(`${API_BASE_URL}Groups/join/${user.userId}/${groupId}`);
      Alert.alert('Success', 'You have joined the group.');
      // Optionally, refresh My Groups or show some confirmation
    } catch (error) {
      console.error('Error joining group:', error);
      Alert.alert('Error', 'Unable to join the group.');
    }
  };

  return (
    <FlatList
      data={filteredGroups}
      keyExtractor={(item) => item.groupId.toString()}
      ListEmptyComponent={<Text>No groups available.</Text>}
      renderItem={({ item }) => (
        <View style={styles.groupContainer}>
          <Text style={styles.groupName}>{item.groupName}</Text>
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => handleJoinGroup(item.groupId)}
          >
            <Text style={styles.joinButtonText}>Join Group</Text>
          </TouchableOpacity>
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
});
