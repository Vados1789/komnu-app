// GroupContentScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import { AuthContext } from '../../context/AuthContext';
import PostItem from '../../components/Groups/PostItem';
import CreatePostForm from '../../components/Groups/CreatePostForm';

export default function GroupContentScreen({ route }) {
    const { groupId } = route.params;
    const { user } = useContext(AuthContext); // Access the user ID from AuthContext
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchGroupPosts();
    }, [groupId]);

    const fetchGroupPosts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}GroupPosts/${groupId}`);
            setPosts(response.data.reverse()); // Newest post at top
        } catch (error) {
            console.error('Error fetching group posts:', error);
            Alert.alert('Error', 'Could not fetch group posts.');
        }
    };

    const handlePostCreated = async (data) => {
        try {
            await axios.post(`${API_BASE_URL}GroupPosts/add`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchGroupPosts(); // Refresh posts after adding
        } catch (error) {
            console.error('Error adding post:', error);
            Alert.alert('Error', 'Unable to add post.');
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`${API_BASE_URL}GroupPosts/delete/${postId}`);
            setPosts(posts.filter(post => post.id !== postId)); // Remove post locally
        } catch (error) {
            console.error('Error deleting post:', error);
            Alert.alert('Error', 'Unable to delete post.');
        }
    };

    return (
        <View style={styles.container}>
            <CreatePostForm groupId={groupId} userId={user.userId} onPostCreated={handlePostCreated} />
            <FlatList
                data={posts}
                keyExtractor={(item) => (item.id ? item.id.toString() : `fallback-key-${Math.random()}`)}
                ListEmptyComponent={<Text style={styles.emptyText}>No posts in group yet.</Text>}
                renderItem={({ item }) => (
                    <PostItem post={item} onReply={() => Alert.alert('Reply')} onDelete={handleDeletePost} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 20,
    },
});
