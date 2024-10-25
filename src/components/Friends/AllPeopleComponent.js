import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig.js';

export default function AllPeopleComponent() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const fetchAllPeople = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}Friends/all`);
        setPeople(response.data);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };

    fetchAllPeople();
  }, []);

  return (
    <FlatList
      data={people}
      keyExtractor={(item, index) => item.FriendId ? item.FriendId.toString() : index.toString()}
      renderItem={({ item }) => (
        <View style={styles.person}>
          <Text>{item.Username}</Text>
          <Button title="Add Friend" onPress={() => { /* Add friend logic */ }} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  person: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
