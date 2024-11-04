import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function CommentComponent({ username, content, createdAt, replies, onReply }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReplySubmit = () => {
    onReply(replyContent);
    setReplyContent('');
    setIsReplying(false);
  };

  return (
    <View style={styles.commentContainer}>
      <Text style={styles.username}>{username}</Text>
      <Text>{content}</Text>
      <Text style={styles.commentDate}>{new Date(createdAt).toLocaleString()}</Text>

      <Button title="Reply" onPress={() => setIsReplying(!isReplying)} />
      {isReplying && (
        <View style={styles.replyContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Write a reply..."
            value={replyContent}
            onChangeText={setReplyContent}
          />
          <Button title="Submit Reply" onPress={handleReplySubmit} />
        </View>
      )}

      {replies && replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {replies.map((reply) => (
            <CommentComponent
              key={reply.commentId}
              username={reply.username}
              content={reply.content}
              createdAt={reply.createdAt}
              replies={reply.replies}
              onReply={(replyContent) => onReply(replyContent, reply.commentId)} // Pass ParentCommentId for replies
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
  username: {
    fontWeight: 'bold',
  },
  commentDate: {
    color: '#888',
    fontSize: 10,
    marginTop: 5,
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
  repliesContainer: {
    marginTop: 10,
    marginLeft: 20,
  },
});
