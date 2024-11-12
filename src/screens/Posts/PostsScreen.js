import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PostListComponent from '../../components/Posts/PostListComponent';
import API_BASE_URL from '../../config/apiConfig';
import usePostSignalR from '../../hooks/usePostSignalR';

export default function PostsScreen() {
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}posts`);
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
            Alert.alert('Error', 'Could not load posts.');
        }
    };

    const handleNewPost = (newPost) => {
        console.log("Received new post via SignalR:", newPost);
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    const handlePostDeleted = (postId) => {
        console.log("Post deleted via SignalR:", postId);
        // Filter out the deleted post and force re-render by creating a new array
        setPosts((prevPosts) => {
            const updatedPosts = prevPosts.filter((post) => post.postId !== postId);
            console.log("Updated posts after deletion:", updatedPosts);
            return updatedPosts;  // Make sure to return the updated array
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
        setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
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
            <PostListComponent posts={posts} onDeletePost={onDeletePost} />
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
