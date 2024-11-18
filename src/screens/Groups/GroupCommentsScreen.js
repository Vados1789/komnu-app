import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import IMAGE_BASE_URL from '../../config/imageConfig';
import { AuthContext } from '../../context/AuthContext';
import GroupCommentComponent from '../../components/Groups/GroupCommentComponent';

export default function GroupCommentsScreen({ route }) {
  const { postId, post } = route.params; // Post details passed from navigation
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Route params:', route.params); // Verify route parameters
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    console.log(`Fetching comments for postId: ${postId}`); // Log postId
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}GroupComments/${postId}`); // Updated endpoint
      console.log('Comments fetched:', response.data); // Log API response
      setComments(response.data); // Update comments
    } catch (error) {
      console.error('Error fetching comments:', error.response || error.message);
      Alert.alert('Error', 'Unable to fetch comments.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentContent.trim()) {
      Alert.alert('Error', 'Comment content cannot be empty.');
      return;
    }
    console.log('Adding comment:', { postId, userId: user.userId, content: commentContent }); // Log data being sent
    try {
      const response = await axios.post(`${API_BASE_URL}GroupPostComments/add`, {
        postId,
        userId: user.userId,
        content: commentContent,
      });
      console.log('Comment added successfully:', response.data); // Log success response
      setCommentContent('');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error adding comment:', error.response || error.message);
      Alert.alert('Error', 'Could not add comment.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    console.log(`Deleting comment with ID: ${commentId}`); // Log comment ID
    try {
      const response = await axios.delete(`${API_BASE_URL}GroupPostComments/delete/${commentId}`);
      console.log('Comment deleted successfully:', response.data); // Log success response
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error deleting comment:', error.response || error.message);
      Alert.alert('Error', 'Could not delete comment.');
    }
  };

  const renderCommentItem = ({ item }) => (
    <GroupCommentComponent comment={item} onDelete={handleDeleteComment} />
  );

  return (
    <View style={styles.container}>
      {/* Post Details */}
      <View style={styles.postContainer}>
        <Text style={styles.postContent}>{post.content}</Text>
        {post.imagePath && (
          <Image source={{ uri: `${IMAGE_BASE_URL}${post.imagePath}` }} style={styles.postImage} />
        )}
      </View>

      {/* Comments List */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.commentId.toString()}
        renderItem={renderCommentItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No comments yet.</Text>}
        contentContainerStyle={styles.commentsList}
      />

      {/* Add Comment Input */}
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
  postContainer: {
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  postContent: {
    fontSize: 16,
    marginBottom: 10,
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
