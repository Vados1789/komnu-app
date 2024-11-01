import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostListComponent from '../../components/Posts/PostListComponent';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';

export default function PostsScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]); // Add useState to manage posts data

  // Fetch posts from the API
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}posts`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Call fetchPosts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createPostButton}
        onPress={() => navigation.navigate('CreatePostScreen')}
      >
        <Text style={styles.buttonText}>Create Post</Text>
      </TouchableOpacity>
      <PostListComponent posts={posts} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  createPostButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
