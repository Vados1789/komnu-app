import React from 'react';
import { FlatList, Text, View } from 'react-native';
import CommentComponent from './CommentComponent';

export default function CommentListComponent({ comments, onReply, onDelete }) {
  return (
    <View>
      {comments && comments.length > 0 ? (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.commentId.toString()}
          renderItem={({ item }) => (
            <CommentComponent
              commentId={item.commentId}
              userId={item.userId} // Pass the user ID to check if the delete option should be available
              username={item.username}
              content={item.content}
              createdAt={item.createdAt}
              replies={item.replies} // Pass nested replies
              onReply={onReply}
              onDelete={onDelete} // Pass delete handler
            />
          )}
          ListEmptyComponent={<Text>No comments yet.</Text>}
        />
      ) : (
        <Text>No comments available.</Text>
      )}
    </View>
  );
}
