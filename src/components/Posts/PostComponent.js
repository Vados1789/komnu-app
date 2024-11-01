import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import IMAGE_BASE_URL from '../../config/imageConfig.js';

export default function PostComponent({ post }) {
    console.log('Post interest:', post);
  return (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        {post.user?.profilePicture ? (
          <Image
            source={{ uri: `${IMAGE_BASE_URL}${post.user.profilePicture}` }}
            style={styles.userImage}
          />
        ) : null}
        <Text style={styles.username}>
          {post.user?.username || 'Unknown User'}
        </Text>
      </View>
      <Text style={styles.content}>
        {post.content || 'No content available'}
      </Text>
      {post.imagePath ? (
        <Image
          source={{ uri: `${IMAGE_BASE_URL}${post.imagePath}` }}
          style={styles.postImage}
        />
      ) : null}
      <Text style={styles.createdAt}>
        {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Unknown Date'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
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
  username: {
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  createdAt: {
    color: '#888',
    fontSize: 12,
  },
});
