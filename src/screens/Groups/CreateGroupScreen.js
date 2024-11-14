import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import { AuthContext } from '../../context/AuthContext';

export default function CreateGroupScreen({ navigation }) {
  const { user } = useContext(AuthContext); // Get user information from context
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);

  // Function to handle image selection from gallery
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

  // Function to handle taking a photo with the camera
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

    // Function to handle creating a group

    const handleCreateGroup = async () => {
        if (!groupName.trim() || !description.trim()) {
          Alert.alert('Error', 'Group name and description cannot be empty.');
          return;
        }
      
        try {
          const data = new FormData();
          data.append('groupName', groupName);
          data.append('description', description);
          data.append('userId', user.userId); // Add userId
      
          // Append image if it exists
          if (imageUri) {
            const filename = imageUri.split('/').pop();
            const fileType = filename.split('.').pop();
            data.append('image', {
              uri: imageUri,
              name: filename,
              type: `image/${fileType}`,
            });
          }
      
          // Log FormData to check data before sending
          console.log('FormData:', data);
      
          // Make the POST request to the backend
          const response = await axios.post(`${API_BASE_URL}Groups/create`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
      
          Alert.alert('Success', 'Group created successfully!');
          navigation.goBack(); // Navigate back to the groups list after creation
        } catch (error) {
          console.error('Error creating group:', error.response || error);
          Alert.alert('Error', 'Could not create group.');
        }
      };
      
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Group</Text>

      {/* Group Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />

      {/* Group Description Input */}
      <TextInput
        style={styles.input}
        placeholder="Group Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Image Preview */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      ) : (
        <View style={styles.buttonContainer}>
          {/* Button to take a photo */}
          <TouchableOpacity onPress={takePhoto} style={styles.imagePicker}>
            <Text style={styles.imagePickerText}>Take Photo</Text>
          </TouchableOpacity>

          {/* Button to select image from gallery */}
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Text style={styles.imagePickerText}>Select an Image</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Submit button to create group */}
      <Button title="Create Group" onPress={handleCreateGroup} color="blue" />
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imagePicker: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#555',
  },
});
