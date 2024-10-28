import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FriendRequestComponent from '../../components/Friends/FriendRequestComponent'
import FriendsListComponent from '../../components/Friends/FriendsListComponent';
import AllPeopleComponent from '../../components/Friends/AllPeopleComponent';

export default function FriendsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friend Requests</Text>
      <FriendRequestComponent />
      <Text style={styles.title}>Friends List</Text>
      <FriendsListComponent />
      <Text style={styles.title}>Discover People</Text>
      <AllPeopleComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});
