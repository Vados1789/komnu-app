import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PostsScreen from '../Posts/PostsScreen';

export default function HomeScreen() {
  // const handleCreatePost = () => {
  //   // Future functionality for creating a post
  //   console.log("Create Post button pressed!");
  // };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.createPostButton} onPress={handleCreatePost}>
        <Text style={styles.buttonText}>Create Post</Text>
      </TouchableOpacity> */}
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
