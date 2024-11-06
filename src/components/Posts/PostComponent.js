import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import IMAGE_BASE_URL from '../../config/imageConfig.js';
import { AuthContext } from '../../context/AuthContext';

export default function PostComponent({ post, onDelete }) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}comments/${post.postId}/count`);
        setCommentCount(response.data);
      } catch (error) {
        console.error('Error fetching comment count:', error);
      }
    };
    fetchCommentCount();
  }, [post.postId]);

  const handleEditPress = () => {
    navigation.navigate('EditPostScreen', { post });
  };

  const handleDeletePress = () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await axios.delete(`${API_BASE_URL}posts/${post.postId}`);
            if (response.status === 204) { // Ensure successful deletion with 204 status
              Alert.alert('Post deleted successfully');
              onDelete(post.postId); // Notify parent to remove post from list
            }
          } catch (error) {
            console.error('Error deleting post:', error);
            Alert.alert('Error', 'Failed to delete the post.');
          }
        },
      },
    ]);
  };


  const handleImagePress = () => {
    navigation.navigate('FullScreenImageScreen', { imageUri: `${IMAGE_BASE_URL}${post.imagePath}` });
  };

  const handleCommentsPress = () => {
    navigation.navigate('CommentsScreen', { postId: post.postId });
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
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Comments Button */}
      <TouchableOpacity style={styles.commentButton} onPress={handleCommentsPress}>
        <Text style={styles.commentButtonText}>Comments ({commentCount})</Text>
      </TouchableOpacity>
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  commentButtonText: {
    color: '#007BFF',
  },
});
