import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig.js';

export default function MyGroupsComponent({ searchText }) {
    const { user } = useContext(AuthContext);
    const [myGroups, setMyGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);

    useEffect(() => {
        const fetchMyGroups = async () => {
            if (user && user.userId) {
                try {
                    const response = await axios.get(`${API_BASE_URL}GroupMember/my-groups/${user.userId}`);
                    console.log('My groups received:', response.data);
                    // Check if response has $values property and set groups accordingly
                    const groupsData = response.data?.$values || [];
                    setMyGroups(groupsData);
                    setFilteredGroups(groupsData);
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        console.log('No groups found for the user.');
                        setMyGroups([]);
                        setFilteredGroups([]);
                    } else {
                        console.error('Error fetching my groups:', error);
                        Alert.alert('Error', 'Unable to fetch your groups.');
                    }
                }
            }
        };

        fetchMyGroups();
    }, [user]);

    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredGroups(myGroups);
        } else {
            setFilteredGroups(
                myGroups.filter((group) =>
                    group.groupName.toLowerCase().includes(searchText.toLowerCase())
                )
            );
        }
    }, [searchText, myGroups]);

    const handleLeaveGroup = async (groupId) => {
        try {
            await axios.post(`${API_BASE_URL}GroupMember/leave/${user.userId}/${groupId}`);
            const updatedGroups = myGroups.filter((group) => group.groupId !== groupId);
            setMyGroups(updatedGroups);
            setFilteredGroups(updatedGroups);
            Alert.alert('Success', 'You have left the group.');
        } catch (error) {
            console.error('Error leaving group:', error);
            Alert.alert('Error', 'Unable to leave the group.');
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
                        style={styles.leaveButton}
                        onPress={() => handleLeaveGroup(item.groupId)}
                    >
                        <Text style={styles.leaveButtonText}>Leave Group</Text>
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
    leaveButton: {
        backgroundColor: 'red',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    leaveButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
