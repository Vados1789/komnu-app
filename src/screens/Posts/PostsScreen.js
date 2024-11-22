import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PostListComponent from '../../components/Posts/PostListComponent';
import { saveToCache, loadFromCache } from '../../cache/cacheManager';
import API_BASE_URL from '../../config/apiConfig';
import usePostSignalR from '../../hooks/usePostSignalR';

const CACHE_KEY = 'posts';

export default function PostsScreen() {
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}posts`);
            setPosts(response.data);

            // Save fetched posts to cache
            await saveToCache(CACHE_KEY, response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);

            // Load posts from cache if offline
            const cachedPosts = await loadFromCache(CACHE_KEY);
            if (cachedPosts) {
                console.log("Loaded posts from cache.");
                setPosts(cachedPosts);
            } else {
                Alert.alert('Error', 'Could not load posts and no cached data available.');
            }
        }
    };

    const handleNewPost = (newPost) => {
        console.log("Received new post via SignalR:", newPost);
        setPosts((prevPosts) => {
            const updatedPosts = [newPost, ...prevPosts];
            saveToCache(CACHE_KEY, updatedPosts); // Update the cache
            return updatedPosts;
        });
    };

    const handlePostDeleted = (postId) => {
        console.log("Post deleted via SignalR:", postId);
        setPosts((prevPosts) => {
            const updatedPosts = prevPosts.filter((post) => post.postId !== postId);
            saveToCache(CACHE_KEY, updatedPosts); // Update the cache
            return updatedPosts;
        });
    };

    const handlePostUpdated = (updatedPost) => {
        console.log("Post updated via SignalR:", updatedPost);
        setPosts((prevPosts) =>
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
    };

    usePostSignalR(null, handleNewPost, handlePostDeleted, handlePostUpdated);

    useFocusEffect(
        React.useCallback(() => {
            fetchPosts();
        }, [])
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.createPostButton}
                onPress={() => navigation.navigate('CreatePostScreen')}
            >
                <Text style={styles.buttonText}>Create Post</Text>
            </TouchableOpacity>
            <PostListComponent posts={posts} onDeletePost={onDeletePost} onNewPost={handleNewPost}  />
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
