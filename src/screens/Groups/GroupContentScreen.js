import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig.js';

export default function GroupContentScreen({ route }) {
    const { groupId } = route.params;
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');

    useEffect(() => {
        const fetchGroupPosts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}GroupPosts/${groupId}`);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching group posts:', error);
            }
        };

        fetchGroupPosts();
    }, [groupId]);

    const handleAddPost = async () => {
        try {
            await axios.post(`${API_BASE_URL}GroupPosts/add`, { groupId, content: newPost });
            Alert.alert('Success', 'Post added successfully.');
            setNewPost('');
            fetchGroupPosts(); // Reload posts after adding
        } catch (error) {
            console.error('Error adding post:', error);
            Alert.alert('Error', 'Unable to add post.');
        }
    };

    const handleReply = (postId) => {
        Alert.alert('Reply', `Reply to post ${postId}`);
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`${API_BASE_URL}GroupPosts/delete/${postId}`);
            setPosts(posts.filter(post => post.id !== postId));
            Alert.alert('Success', 'Post deleted.');
        } catch (error) {
            console.error('Error deleting post:', error);
            Alert.alert('Error', 'Unable to delete post.');
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.postContainer}>
                        <Text style={styles.postContent}>{item.content}</Text>
                        <View style={styles.actionButtons}>
                            <Button title="Reply" onPress={() => handleReply(item.id)} />
                            <Button title="Delete" onPress={() => handleDeletePost(item.id)} />
                        </View>
                    </View>
                )}
            />
            <TextInput
                placeholder="Write a new post..."
                value={newPost}
                onChangeText={setNewPost}
                style={styles.input}
            />
            <Button title="Add Post" onPress={handleAddPost} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    postContainer: {
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    postContent: {
        fontSize: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginVertical: 10,
    },
});
