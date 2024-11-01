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
  const [imageUri, setImageUri] = useState(post.imagePath ? `${IMAGE_BASE_URL}${post.imagePath}` : null); // Use IMAGE_BASE_URL here
  const [hasNewImage, setHasNewImage] = useState(false);

  // Function to handle image selection
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

      // Include the new image if selected
      if (hasNewImage && imageUri) {
        const filename = imageUri.split('/').pop();
        const fileType = filename.split('.').pop();
        data.append('image', {
          uri: imageUri,
          name: filename,
          type: `image/${fileType}`,
        });
      }

      await axios.put(`${API_BASE_URL}posts/${post.postId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Post updated successfully!');
      navigation.goBack();
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

      <TouchableOpacity onPress={pickImage} style={styles.chooseImageButton}>
        <Text style={styles.chooseImageButtonText}>
          {hasNewImage ? 'Choose Another Photo' : 'Select a Photo'}
        </Text>
      </TouchableOpacity>

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
  chooseImageButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  chooseImageButtonText: {
    color: '#555',
  },
});
