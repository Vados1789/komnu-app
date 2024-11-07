import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import IMAGE_BASE_URL from '../../config/imageConfig.js';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons'; // Using FontAwesome for icons

export default function PostComponent({ post, onDelete }) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [dislikeCount, setDislikeCount] = useState(post.dislikeCount || 0);
  const [userReaction, setUserReaction] = useState(null); // 'like', 'dislike', or null

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

    const fetchReactionData = async () => {
      try {
        const countsResponse = await axios.get(`${API_BASE_URL}post-reactions/${post.postId}`);
        setLikeCount(countsResponse.data.likeCount);
        setDislikeCount(countsResponse.data.dislikeCount);

        const userReactionResponse = await axios.get(`${API_BASE_URL}post-reactions/${post.postId}/user/${user.userId}`);
        setUserReaction(userReactionResponse.data.reactionType);
      } catch (error) {
        console.error('Error fetching reactions:', error);
      }
    };
    fetchReactionData();
  }, [post.postId, user.userId]);

  const handleLikePress = async () => {
    try {
      const newReaction = userReaction === 'like' ? null : 'like'; // Toggle like
      const response = await axios.post(`${API_BASE_URL}post-reactions`, {
        postId: post.postId,
        userId: user.userId,
        reactionType: newReaction,
      });
      setUserReaction(newReaction);
      setLikeCount(response.data.likeCount);
      setDislikeCount(response.data.dislikeCount);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislikePress = async () => {
    try {
      const newReaction = userReaction === 'dislike' ? null : 'dislike'; // Toggle dislike
      const response = await axios.post(`${API_BASE_URL}post-reactions`, {
        postId: post.postId,
        userId: user.userId,
        reactionType: newReaction,
      });
      setUserReaction(newReaction);
      setLikeCount(response.data.likeCount);
      setDislikeCount(response.data.dislikeCount);
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

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
            if (response.status === 204) {
              Alert.alert('Post deleted successfully');
              onDelete(post.postId);
            }
          } catch (error) {
            console.error('Error deleting post:', error);
            Alert.alert('Error', 'Failed to delete the post.');
          }
        },
      },
    ]);
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
        <TouchableOpacity onPress={() => navigation.navigate('FullScreenImageScreen', { imageUri: `${IMAGE_BASE_URL}${post.imagePath}` })}>
          <Image source={{ uri: `${IMAGE_BASE_URL}${post.imagePath}` }} style={styles.postImage} />
        </TouchableOpacity>
      ) : null}
      <Text style={styles.createdAt}>{new Date(post.createdAt).toLocaleString()}</Text>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {/* Reactions on the left */}
        <View style={styles.leftButtons}>
          <TouchableOpacity onPress={handleLikePress} style={styles.reactionButton}>
            <FontAwesome name={userReaction === 'like' ? 'thumbs-up' : 'thumbs-o-up'} size={20} color="blue" />
            <Text style={styles.reactionCount}>{likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDislikePress} style={styles.reactionButton}>
            <FontAwesome name={userReaction === 'dislike' ? 'thumbs-down' : 'thumbs-o-down'} size={20} color="red" />
            <Text style={styles.reactionCount}>{dislikeCount}</Text>
          </TouchableOpacity>
        </View>

        {/* Edit and Delete on the right */}
        {user?.userId === post.userId && (
          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Comments Button */}
      <TouchableOpacity style={styles.commentButton} onPress={() => navigation.navigate('CommentsScreen', { postId: post.postId })}>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  leftButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  reactionCount: {
    marginLeft: 5,
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
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
