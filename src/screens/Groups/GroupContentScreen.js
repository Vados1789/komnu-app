import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, Alert, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig.js';

export default function GroupContentScreen({ route }) {
    const { groupId } = route.params;
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        fetchGroupPosts();
    }, [groupId]);

    const fetchGroupPosts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}GroupPosts/${groupId}`);
            setPosts(response.data.reverse()); // Newest post at top
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("No posts found for this group.");
                setPosts([]); // Set posts to an empty array
            } else {
                console.error('Error fetching group posts:', error);
            }
        }
    };

    const handleAddPost = async () => {
        try {
            const data = new FormData();
            data.append('groupId', groupId);
            data.append('content', newPost);

            if (imageUri) {
                const filename = imageUri.split('/').pop();
                const fileType = filename.split('.').pop();
                data.append('image', {
                    uri: imageUri,
                    name: filename,
                    type: `image/${fileType}`,
                });
            }

            await axios.post(`${API_BASE_URL}GroupPosts/add`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            Alert.alert('Success', 'Post added successfully.');
            setNewPost('');
            setImageUri(null);
            fetchGroupPosts();
        } catch (error) {
            console.error('Error adding post:', error);
            Alert.alert('Error', 'Unable to add post.');
        }
    };

    const handleTakePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) setImageUri(result.assets[0].uri);
    };

    const handleSelectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) setImageUri(result.assets[0].uri);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Write a new post..."
                value={newPost}
                onChangeText={setNewPost}
                style={styles.input}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleTakePhoto} style={styles.imagePicker}>
                    <Text style={styles.imagePickerText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSelectImage} style={styles.imagePicker}>
                    <Text style={styles.imagePickerText}>Select an Image</Text>
                </TouchableOpacity>
            </View>
            {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            )}
            <Button title="Add Post" onPress={handleAddPost} />
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>No posts in group yet.</Text>}
                renderItem={({ item }) => (
                    <View style={styles.postContainer}>
                        <Text style={styles.postContent}>{item.content}</Text>
                        <View style={styles.actionButtons}>
                            <Button title="Reply" onPress={() => Alert.alert('Reply', `Reply to post ${item.id}`)} />
                            <Button title="Delete" onPress={() => handleDeletePost(item.id)} />
                        </View>
                    </View>
                )}
                style={styles.postList}
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
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    imagePicker: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginHorizontal: 5,
        marginBottom: 10,
    },
    imagePickerText: {
        color: '#666', // Darker gray for text
        fontWeight: '500',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    postList: {
        flex: 1,
    },
    postContainer: {
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    postContent: {
        fontSize: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 20,
    },
});
