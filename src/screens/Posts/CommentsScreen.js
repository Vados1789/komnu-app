import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, FlatList, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig';
import IMAGE_BASE_URL from '../../config/imageConfig';
import CommentComponent from '../../components/Posts/CommentComponent';

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
        parentCommentId,
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
  
      // Fetch updated comments after adding a new one
      const response = await axios.get(`${API_BASE_URL}comments/${postId}`);
      setComments(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_BASE_URL}comments/${commentId}`);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.commentId !== commentId)
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        ListHeaderComponent={
          post && (
            <View style={styles.postContainer}>
              <View style={styles.userInfo}>
                {post.user?.profilePicture ? (
                  <Image
                    source={{ uri: `${IMAGE_BASE_URL}${post.user.profilePicture}` }}
                    style={styles.userImage}
                  />
                ) : (
                  <View style={styles.placeholderImage} />
                )}
                <Text style={styles.postUsername}>{post.user?.username || 'Unknown User'}</Text>
              </View>
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
          )
        }
        data={comments}
        keyExtractor={(item) => item.commentId.toString()}
        renderItem={({ item }) => (
          <CommentComponent
            commentId={item.commentId}
            userId={item.userId}
            username={item.username}
            content={item.content}
            createdAt={item.createdAt}
            replies={item.replies}
            onReply={handleReply}
            onDelete={handleDeleteComment}
            profileImagePath={item.profileImagePath}
          />
        )}
        ListEmptyComponent={<Text>No comments yet.</Text>}
        contentContainerStyle={styles.commentsContainer}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
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
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  postUsername: {
    fontWeight: 'bold',
    fontSize: 16,
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
  commentsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
