import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';

export default function CreatePostScreen({ navigation }) {
  const [content, setContent] = useState('');
  const [imagePath, setImagePath] = useState(''); // Placeholder for image path

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Post content cannot be empty.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}posts`, {
        userId: 54, // Replace with the actual logged-in user ID
        content,
        imagePath
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
      {/* Implement image upload functionality as needed */}
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
});
