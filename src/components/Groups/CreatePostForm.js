// CreatePostForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CreatePostForm({ groupId, userId, onPostCreated }) {
    const [content, setContent] = useState('');
    const [imageUri, setImageUri] = useState(null);

    const handleAddPost = async () => {
        if (!content.trim()) {
            Alert.alert('Error', 'Post content cannot be empty.');
            return;
        }
        
        const data = new FormData();
        data.append('groupId', groupId);
        data.append('userId', userId);
        data.append('content', content);

        if (imageUri) {
            const filename = imageUri.split('/').pop();
            const fileType = filename.split('.').pop();
            data.append('image', {
                uri: imageUri,
                name: filename,
                type: `image/${fileType}`,
            });
        }

        try {
            await onPostCreated(data);
            setContent('');
            setImageUri(null);
        } catch (error) {
            console.error('Error adding post:', error);
            Alert.alert('Error', 'Unable to add post.');
        }
    };

    const handleImageSelection = async (fromCamera) => {
        const result = fromCamera
            ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 })
            : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });

        if (!result.canceled) setImageUri(result.uri);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Write a new post..."
                value={content}
                onChangeText={setContent}
                style={styles.input}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleImageSelection(true)} style={styles.imagePicker}>
                    <Text style={styles.imagePickerText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleImageSelection(false)} style={styles.imagePicker}>
                    <Text style={styles.imagePickerText}>Select an Image</Text>
                </TouchableOpacity>
            </View>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
            <Button title="Add Post" onPress={handleAddPost} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 20 },
    input: { borderColor: '#ccc', borderWidth: 1, padding: 10, marginBottom: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    imagePicker: { flex: 1, backgroundColor: '#e0e0e0', padding: 10, alignItems: 'center', borderRadius: 5 },
    imagePickerText: { color: '#666', fontWeight: '500' },
    imagePreview: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
});
