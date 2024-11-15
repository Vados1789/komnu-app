import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, Image, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import IMAGE_BASE_URL from '../../config/imageConfig';
import { AuthContext } from '../../context/AuthContext';
import GroupCommentComponent from '../../components/Groups/GroupCommentComponent';

export default function GroupCommentsScreen({ route }) {
  const { postId } = route.params;
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    fetchPostWithComments();
  }, [postId]);

  const fetchPostWithComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}GroupPostComments/post/${postId}`);
      setPost(response.data.Post);
      setComments(response.data.Comments);
    } catch (error) {
      console.error(`Error fetching post and comments for post ${postId}:`, error);
      Alert.alert('Error', 'Failed to load post and comments.');
    }
  };

  const handleAddComment = async () => {
    if (!commentContent.trim()) {
      Alert.alert('Error', 'Comment content cannot be empty.');
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}GroupPostComments/add`, {
        postId,
        userId: user.userId,
        content: commentContent,
      });
      setCommentContent('');
      fetchPostWithComments();
    } catch (error) {
      console.error(`Error adding comment for post ${postId}:`, error);
      Alert.alert('Error', 'Failed to add comment.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_BASE_URL}GroupPostComments/delete/${commentId}`);
      fetchPostWithComments();
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
      Alert.alert('Error', 'Failed to delete comment.');
    }
  };

  const renderCommentItem = ({ item }) => (
    <GroupCommentComponent
      comment={item}
      onDelete={handleDeleteComment}
    />
  );

  return (
    <View style={styles.container}>
      {post && (
        <View style={styles.postDetails}>
          <View style={styles.postHeader}>
            {post.User?.ProfilePicture && (
              <Image
                source={{ uri: `${IMAGE_BASE_URL}${post.User.ProfilePicture}` }}
                style={styles.userImage}
              />
            )}
            <Text style={styles.username}>{post.User?.Username || 'Unknown User'}</Text>
          </View>
          <Text style={styles.postContent}>{post.Content}</Text>
          {post.ImagePath && (
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${post.ImagePath}` }}
              style={styles.postImage}
            />
          )}
        </View>
      )}

      <FlatList
        data={comments}
        keyExtractor={(item) => item.CommentId.toString()}
        renderItem={renderCommentItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No comments yet.</Text>}
        contentContainerStyle={styles.commentsList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={commentContent}
          onChangeText={setCommentContent}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  postDetails: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  postHeader: {
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
    fontSize: 16,
  },
  postContent: {
    marginBottom: 10,
    fontSize: 14,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  commentsList: {
    paddingBottom: 60,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
  },
});
