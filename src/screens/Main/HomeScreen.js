import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PostsScreen from '../Posts/PostsScreen';

export default function HomeScreen() {

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
  },
  createPostButton: {
    backgroundColor: 'blue',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postsContainer: {
    flex: 1, // Allow the posts to take up remaining space
  },
});
