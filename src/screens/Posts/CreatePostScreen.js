import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import { AuthContext } from '../../context/AuthContext';

export default function CreatePostScreen({ navigation }) {
    const { user } = useContext(AuthContext); // Access the user context
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState(null);

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
    }
  };

  // Function to handle creating a post
  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Post content cannot be empty.');
      return;
    }

    try {
      const data = new FormData();
      data.append('userId', user.userId); // Replace with actual logged-in user ID
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

      await axios.post(`${API_BASE_URL}posts`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Post created successfully!');
      navigation.goBack(); // Navigate back to the posts list after creation
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Could not create post.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Post</Text>
      
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
        multiline
      />

      {/* Image preview and upload button */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      ) : (
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>Select an Image</Text>
        </TouchableOpacity>
      )}

      <Button title="Post" onPress={handleCreatePost} color="blue" />
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
  imagePicker: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#555',
  },
});
