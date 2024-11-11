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

    // Fetch posts initially
    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}posts`);
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
            Alert.alert('Error', 'Could not load posts.');
        }
    };

    // Handle receiving a new post from SignalR
    const handleNewPost = (newPost) => {
        console.log("Received new post via SignalR:", newPost);
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    const onDeletePost = (postId) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
    };

    // Use SignalR hook to listen for new posts
    usePostSignalR(null, handleNewPost);

    // Fetch posts when screen is focused
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
