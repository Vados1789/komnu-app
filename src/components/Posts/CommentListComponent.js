import React from 'react';
import { FlatList, Text } from 'react-native';
import CommentComponent from './CommentComponent';

export default function CommentListComponent({ comments, onReply }) {
  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.commentId.toString()}
      renderItem={({ item }) => (
        <CommentComponent
          username={item.username}
          content={item.content}
          createdAt={item.createdAt}
          replies={item.replies}
          onReply={(replyContent) => onReply(replyContent, item.commentId)} // Pass the comment ID as parentCommentId
        />
      )}
      ListEmptyComponent={<Text>No comments yet.</Text>}
    />
  );
}
