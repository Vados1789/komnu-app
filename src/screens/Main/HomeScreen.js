import React, { useContext, useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PostsScreen from '../Posts/PostsScreen';
import { AuthContext } from '../../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext); // Access the user data from AuthContext

  // Dynamically set the header title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.usernameText}>{user.username}</Text>
        </View>
      ),
    });
  }, [navigation, user.username]);

  return (
    <View style={styles.container}>
      <View style={styles.postsContainer}>
        <PostsScreen />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  bio: {
    fontSize: 16,
    color: '#555',
  },
  postsContainer: {
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#555',
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
