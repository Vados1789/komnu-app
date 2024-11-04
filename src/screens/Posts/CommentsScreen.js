import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig';
import IMAGE_BASE_URL from '../../config/imageConfig'; // Import IMAGE_BASE_URL

export default function CommentsScreen({ route }) {
  const { postId } = route.params;
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null); // State for the post data
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch the post and its comments
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Fetch post
        const postResponse = await axios.get(`${API_BASE_URL}posts/${postId}`);
        setPost(postResponse.data);

        // Fetch comments
        const commentsResponse = await axios.get(`${API_BASE_URL}comments/${postId}`);
        // Sort comments by date, newest first
        setComments(commentsResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error('Error fetching post and comments:', error);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(`${API_BASE_URL}comments`, {
        postId,
        userId: user.userId,
        content: newComment,
      });
      setNewComment('');
      // Refresh comments after adding a new one
      const response = await axios.get(`${API_BASE_URL}comments/${postId}`);
      setComments(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Display post details */}
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

          {/* Input field for new comments */}
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="Add Comment" onPress={handleAddComment} />
        </View>
      )}

      {/* Display comments */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.commentId.toString()}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.username}>{item.username}</Text>
            <Text>{item.content}</Text>
            <Text style={styles.commentDate}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No comments yet.</Text>}
      />
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
  comment: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  username: {
    fontWeight: 'bold',
  },
  commentDate: {
    color: '#888',
    fontSize: 10,
    marginTop: 5,
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
