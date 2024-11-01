import React from 'react';
import { FlatList, Text } from 'react-native';
import PostComponent from './PostComponent';

export default function PostListComponent({ posts }) {
  if (!posts || posts.length === 0) {
    return <Text>No posts available</Text>;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.post_id ? item.post_id.toString() : Math.random().toString()}
      renderItem={({ item }) => <PostComponent post={item} />}
    />
  );
}
