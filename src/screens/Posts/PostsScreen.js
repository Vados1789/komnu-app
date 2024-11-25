import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import PostListComponent from '../../components/Posts/PostListComponent';
import { saveToCache, loadFromCache } from '../../cache/cacheManager';
import API_BASE_URL from '../../config/apiConfig';
import usePostSignalR from '../../hooks/usePostSignalR';

const CACHE_KEY = 'posts';

export default function PostsScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchText, setSearchText] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}posts`);
      const data = response.data;
      setPosts(data);
      setFilteredPosts(data); // Initialize filtered posts with all posts
      console.log('Posts:', data);

      // Save fetched posts to cache
      await saveToCache(CACHE_KEY, data);
    } catch (error) {
      console.error('Error fetching posts:', error);

      // Load posts from cache if offline
      const cachedPosts = await loadFromCache(CACHE_KEY);
      if (cachedPosts) {
        console.log('Loaded posts from cache.');
        setPosts(cachedPosts);
        setFilteredPosts(cachedPosts);
      } else {
        Alert.alert('Error', 'Could not load posts and no cached data available.');
      }
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredPosts(posts); // Show all posts if the search bar is empty
    } else {
      const filtered = posts.filter((post) =>
        post.content?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  const handleNewPost = (newPost) => {
    console.log('Received new post via SignalR:', newPost);
    setPosts((prevPosts) => {
      const updatedPosts = [newPost, ...prevPosts];
      saveToCache(CACHE_KEY, updatedPosts); // Update the cache
      return updatedPosts;
    });
    setFilteredPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handlePostDeleted = (postId) => {
    console.log('Post deleted via SignalR:', postId);
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.filter((post) => post.postId !== postId);
      saveToCache(CACHE_KEY, updatedPosts); // Update the cache
      return updatedPosts;
    });
    setFilteredPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
  };

  const handlePostUpdated = (updatedPost) => {
    console.log('Post updated via SignalR:', updatedPost);
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.postId === updatedPost.postId ? { ...post, ...updatedPost } : post
      )
    );
    setFilteredPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.postId === updatedPost.postId ? { ...post, ...updatedPost } : post
      )
    );
  };

  const onDeletePost = (postId) => {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.filter((post) => post.postId !== postId);
      saveToCache(CACHE_KEY, updatedPosts); // Update the cache
      return updatedPosts;
    });
    setFilteredPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
  };

  usePostSignalR(null, handleNewPost, handlePostDeleted, handlePostUpdated);

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.createPostButton}
        onPress={() => navigation.navigate('CreatePostScreen')}
      >
        <Text style={styles.buttonText}>Create Post</Text>
      </Pressable>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search posts by description..."
        value={searchText}
        onChangeText={handleSearch}
      />

      {/* Post List */}
      <PostListComponent posts={filteredPosts} onDeletePost={onDeletePost} onNewPost={handleNewPost} />
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
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
