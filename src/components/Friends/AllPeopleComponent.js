import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig.js';
import IMAGE_BASE_URL from '../../config/imageConfig.js';

export default function AllPeopleComponent() {
  const [people, setPeople] = useState([]);

  console.log("image",  `${IMAGE_BASE_URL}/images/n1fdbu4f.myg.jpeg`)

  useEffect(() => {
    const fetchAllPeople = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}Friends/all`);
        console.log("Fetched people:", response.data);
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
      keyExtractor={(item, index) => item.userId ? item.userId.toString() : index.toString()}
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
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => { /* Add friend logic */ }}>
            <Text style={styles.addButtonText}>Add Friend</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
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
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
