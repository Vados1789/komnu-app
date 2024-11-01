import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import IMAGE_BASE_URL from '../../config/imageConfig.js';

export default function PostComponent({ post }) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleEditPress = () => {
    navigation.navigate('EditPostScreen', { post });
  };

  const handleImagePress = () => {
    navigation.navigate('FullScreenImageScreen', { imageUri: `${IMAGE_BASE_URL}${post.imagePath}` });
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        {post.user?.profilePicture ? (
          <Image
            source={{ uri: `${IMAGE_BASE_URL}${post.user.profilePicture}` }}
            style={styles.userImage}
          />
        ) : null}
        <Text style={styles.username}>{post.user?.username || 'Unknown User'}</Text>
      </View>
      <Text style={styles.content}>{post.content || 'No content available'}</Text>
      {post.imagePath ? (
        <TouchableOpacity onPress={handleImagePress}>
          <Image source={{ uri: `${IMAGE_BASE_URL}${post.imagePath}` }} style={styles.postImage} />
        </TouchableOpacity>
      ) : null}
      <Text style={styles.createdAt}>{new Date(post.createdAt).toLocaleString()}</Text>

      {user?.userId === post.userId && (
        <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  createdAt: {
    color: '#888',
    fontSize: 12,
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
