// GroupCommentComponent.js
import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

export default function GroupCommentComponent({ comment, onDelete }) {
  const { user } = useContext(AuthContext);

  const handleDelete = () => {
    Alert.alert('Delete Comment', 'Are you sure you want to delete this comment?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(comment.commentId) },
    ]);
  };

  return (
    <View style={styles.commentContainer}>
      <Text style={styles.username}>{comment.user.username}</Text>
      <Text style={styles.content}>{comment.content}</Text>
      <Text style={styles.createdAt}>{new Date(comment.createdAt).toLocaleString()}</Text>
      {user.userId === comment.userId && (
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
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
  username: {
    fontWeight: 'bold',
  },
  content: {
    marginVertical: 5,
  },
  createdAt: {
    color: '#888',
    fontSize: 12,
  },
  deleteButton: {
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: 'red',
  },
});
