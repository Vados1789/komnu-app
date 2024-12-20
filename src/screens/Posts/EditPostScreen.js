import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import IMAGE_BASE_URL from '../../config/imageConfig'; // Import IMAGE_BASE_URL
import { AuthContext } from '../../context/AuthContext';

export default function EditPostScreen({ route, navigation }) {
    const { user } = useContext(AuthContext);
    const { post } = route.params;
    const [content, setContent] = useState(post.content);
    const [imageUri, setImageUri] = useState(post.imagePath ? `${IMAGE_BASE_URL}${post.imagePath}` : null);
    const [hasNewImage, setHasNewImage] = useState(false);

    // Function to handle image selection from the library
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setHasNewImage(true);
        }
    };

    // Function to handle taking a photo using the camera
    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setHasNewImage(true);
        }
    };

    // Function to handle updating a post
    const handleUpdatePost = async () => {
        if (!content.trim()) {
            Alert.alert('Error', 'Post content cannot be empty.');
            return;
        }

        try {
            const data = new FormData();
            data.append('userId', user.userId);
            data.append('content', content);

            // Always include the current image, even if it's not updated
            if (imageUri) {
                const filename = imageUri.split('/').pop();
                const fileType = filename.split('.').pop();
                data.append('image', {
                    uri: imageUri,
                    name: filename,
                    type: `image/${fileType}`,
                });
            }

            const response = await axios.put(`${API_BASE_URL}posts/${post.postId}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 204) {
                Alert.alert('Success', 'Post updated successfully!');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Could not update post.');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            Alert.alert('Error', 'Could not update post.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Post</Text>

            <TextInput
                style={styles.input}
                placeholder="Edit your content"
                value={content}
                onChangeText={setContent}
                multiline
            />

            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : null}

            <View style={styles.imageButtonContainer}>
                {/* Take Photo Button on the Left */}
                <TouchableOpacity onPress={takePhoto} style={styles.takePhotoButton}>
                    <Text style={styles.takePhotoButtonText}>Take a Photo</Text>
                </TouchableOpacity>

                {/* Select Photo Button on the Right */}
                <TouchableOpacity onPress={pickImage} style={styles.chooseImageButton}>
                    <Text style={styles.chooseImageButtonText}>
                        {hasNewImage ? 'Choose Another Photo' : 'Select a Photo'}
                    </Text>
                </TouchableOpacity>
            </View>

            <Button title="Update Post" onPress={handleUpdatePost} color="blue" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    imageButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    takePhotoButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        flex: 1,
        marginRight: 10, // Spacing between the buttons
    },
    takePhotoButtonText: {
        color: '#555',
    },
    chooseImageButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        flex: 1,
    },
    chooseImageButtonText: {
        color: '#555',
    },
});
