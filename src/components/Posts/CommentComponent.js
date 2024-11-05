import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import IMAGE_BASE_URL from '../../config/imageConfig';

export default function CommentComponent({ username, content, createdAt, replies, onReply, onDelete, commentId, userId, profileImagePath }) {
  const { user } = useContext(AuthContext);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReplySubmit = () => {
    onReply(replyContent, commentId);
    setReplyContent('');
    setIsReplying(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete(commentId) }
      ]
    );
  };

  // Construct the full image URL
  const completeProfileImagePath = profileImagePath ? `${IMAGE_BASE_URL}${profileImagePath}` : null;

  return (
    <View style={styles.commentContainer}>
      <View style={styles.profileContainer}>
        {completeProfileImagePath ? (
          <Image source={{ uri: completeProfileImagePath }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <View>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.commentDate}>{new Date(createdAt).toLocaleString()}</Text>
        </View>
      </View>

      <Text>{content}</Text>

      <View style={styles.actionsContainer}>
        {user.userId === userId && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setIsReplying(!isReplying)} style={styles.replyButton}>
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>
      </View>

      {isReplying && (
        <View style={styles.replyContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Write a reply..."
            value={replyContent}
            onChangeText={setReplyContent}
          />
          <TouchableOpacity onPress={handleReplySubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit Reply</Text>
          </TouchableOpacity>
        </View>
      )}

      {replies && replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {replies.map((reply) => (
            <CommentComponent
              key={reply.commentId}
              commentId={reply.commentId}
              userId={reply.userId}
              username={reply.username}
              content={reply.content}
              createdAt={reply.createdAt}
              replies={reply.replies}
              onReply={onReply}
              onDelete={onDelete}
              profileImagePath={reply.profileImagePath} // Pass profile image path for each reply
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  placeholderImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  commentDate: {
    color: '#888',
    fontSize: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  deleteButton: {
    marginRight: 15,
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 12,
  },
  replyButton: {
    paddingHorizontal: 5,
  },
  replyButtonText: {
    color: '#0066cc',
    fontSize: 12,
  },
  replyContainer: {
    marginTop: 10,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginBottom: 5,
    borderRadius: 5,
  },
  submitButton: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#0066cc',
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  repliesContainer: {
    marginTop: 10,
    marginLeft: 20,
  },
});
