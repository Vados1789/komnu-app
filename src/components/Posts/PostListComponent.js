import React from 'react';
import { FlatList, Text, View } from 'react-native';
import PostComponent from './PostComponent';

export default function PostListComponent({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <View>
        <Text>No posts available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.post_id.toString()}
      renderItem={({ item }) => <PostComponent post={item} />}
    />
  );
}
