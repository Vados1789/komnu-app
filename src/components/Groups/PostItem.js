import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import IMAGE_BASE_URL from '../../config/imageConfig.js';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import usePostSignalR from '../../hooks/usePostSignalR';

export default function PostItem({ post, onDelete, onNewPost, navigation }) {
  const { user } = useContext(AuthContext);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [dislikeCount, setDislikeCount] = useState(post.dislikeCount || 0);
  const [userReaction, setUserReaction] = useState(null);

  // Real-time reaction updates
  const handleReactionUpdate = (update) => {
    if (update.postId === post.postId) {
      console.log('Real-time reaction update received:', update);
      setLikeCount(update.likeCount);
      setDislikeCount(update.dislikeCount);
    }
  };

  const handleNewPost = (newPost) => {
    onNewPost(newPost);
  };

  // Using SignalR for real-time updates
  usePostSignalR(handleReactionUpdate, handleNewPost);

  useEffect(() => {
    const fetchReactionData = async () => {
      try {
        const reactionsResponse = await axios.get(`${API_BASE_URL}GroupPostReactions/post/${post.postId}`);
        console.log(`Fetched reactions data for post ${post.postId}:`, reactionsResponse.data);
        setLikeCount(reactionsResponse.data.likeCount || 0);
        setDislikeCount(reactionsResponse.data.dislikeCount || 0);

        const userReactionResponse = await axios.get(`${API_BASE_URL}GroupPostReactions/post/${post.postId}/user/${user.userId}`);
        console.log(`Fetched user reaction data for post ${post.postId} and user ${user.userId}:`, userReactionResponse.data);
        setUserReaction(userReactionResponse.data.reactionType || null);
      } catch (error) {
        console.error(`Error fetching reactions for post ${post.postId}:`, error);
      }
    };

    console.log(`Fetching initial reaction data for post: ${post.postId}`);
    fetchReactionData();
  }, [post.postId, user.userId]);

  const handleReaction = async (reactionType) => {
    const newReaction = userReaction === reactionType ? null : reactionType;
    console.log(`Sending reaction: ${newReaction} for post: ${post.postId}`);
    try {
      const response = await axios.post(`${API_BASE_URL}GroupPostReactions`, {
        postId: post.postId,
        userId: user.userId,
        reactionType: newReaction,
      });
      console.log(`Reaction update response for post ${post.postId}:`, response.data);
      setUserReaction(newReaction);
      setLikeCount(response.data.likeCount || 0);
      setDislikeCount(response.data.dislikeCount || 0);
    } catch (error) {
      console.error(`Error updating reaction for post ${post.postId}:`, error);
    }
  };

  const handleDeletePress = () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await axios.delete(`${API_BASE_URL}GroupPosts/delete/${post.postId}`);
            if (response.status === 200) {
              Alert.alert('Post deleted successfully');
              onDelete(post.postId);
            }
          } catch (error) {
            console.error(`Error deleting post ${post.postId}:`, error);
            Alert.alert('Error', 'Failed to delete the post.');
          }
        },
      },
    ]);
  };

  console.log(`Rendering PostItem for post ${post.postId}`);
  console.log(`Like Count: ${likeCount}, Dislike Count: ${dislikeCount}, User Reaction: ${userReaction}`);

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
        <TouchableOpacity
          onPress={() => navigation.navigate('FullPictureScreen', { imageUrl: `${IMAGE_BASE_URL}${post.imagePath}` })}
        >
          <Image source={{ uri: `${IMAGE_BASE_URL}${post.imagePath}` }} style={styles.postImage} />
        </TouchableOpacity>
      ) : null}
      <Text style={styles.createdAt}>{new Date(post.createdAt).toLocaleString()}</Text>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <View style={styles.leftButtons}>
          <TouchableOpacity onPress={() => handleReaction('like')} style={styles.reactionButton}>
            <FontAwesome name={userReaction === 'like' ? 'thumbs-up' : 'thumbs-o-up'} size={20} color="blue" />
            <Text style={styles.reactionCount}>{likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleReaction('dislike')} style={styles.reactionButton}>
            <FontAwesome name={userReaction === 'dislike' ? 'thumbs-down' : 'thumbs-o-down'} size={20} color="red" />
            <Text style={styles.reactionCount}>{dislikeCount}</Text>
          </TouchableOpacity>
        </View>

        {user?.userId === post.userId && (
          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
});
