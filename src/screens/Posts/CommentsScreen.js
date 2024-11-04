import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig';
import IMAGE_BASE_URL from '../../config/imageConfig';
import CommentListComponent from '../../components/Posts/CommentListComponent';

export default function CommentsScreen({ route }) {
  const { postId } = route.params;
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postResponse = await axios.get(`${API_BASE_URL}posts/${postId}`);
        setPost(postResponse.data);

        const commentsResponse = await axios.get(`${API_BASE_URL}comments/${postId}`);
        setComments(commentsResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error('Error fetching post and comments:', error);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  const handleReply = async (replyContent, parentCommentId) => {
    if (!replyContent.trim()) return;
  
    try {
      await axios.post(`${API_BASE_URL}comments`, {
        postId,
        userId: user.userId,
        content: replyContent,
        parentCommentId // Pass the parent comment ID for replies
      });
      const response = await axios.get(`${API_BASE_URL}comments/${postId}`);
      setComments(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(`${API_BASE_URL}comments`, {
        postId,
        userId: user.userId,
        content: newComment,
      });
      setNewComment('');
      const response = await axios.get(`${API_BASE_URL}comments/${postId}`);
      setComments(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <View style={styles.container}>
      {post && (
        <View style={styles.postContainer}>
          <Text style={styles.postUsername}>{post.user?.username || 'Unknown User'}</Text>
          <Text style={styles.postContent}>{post.content}</Text>
          {post.imagePath && (
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${post.imagePath}` }}
              style={styles.postImage}
            />
          )}
          <Text style={styles.postDate}>{new Date(post.createdAt).toLocaleString()}</Text>

          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="Add Comment" onPress={handleAddComment} />
        </View>
      )}

      {/* Render CommentListComponent */}
      <CommentListComponent comments={comments} onReply={handleReply} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  postContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  postUsername: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  postContent: {
    fontSize: 14,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postDate: {
    color: '#888',
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
