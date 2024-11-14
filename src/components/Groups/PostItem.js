// PostItem.js
import React from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import IMAGE_BASE_URL from '../../config/imageConfig.js';

export default function PostItem({ post, onReply, onDelete }) {
    return (
        <View style={styles.postContainer}>
            <View style={styles.userInfo}>
                {post.user?.profilePicture && (
                    <Image
                        source={{ uri: `${IMAGE_BASE_URL}${post.user.profilePicture}` }}
                        style={styles.userImage}
                    />
                )}
                <Text style={styles.username}>{post.user?.username || 'Unknown User'}</Text>
            </View>
            <Text style={styles.content}>{post.content}</Text>
            {post.imagePath && (
                <Image source={{ uri: `${IMAGE_BASE_URL}${post.imagePath}` }} style={styles.postImage} />
            )}
            <Text style={styles.createdAt}>{new Date(post.createdAt).toLocaleString()}</Text>
            <View style={styles.actionButtons}>
                <Button title="Reply" onPress={() => onReply(post.id)} />
                <Button title="Delete" onPress={() => onDelete(post.id)} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
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
        fontSize: 16,
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
        marginBottom: 10,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});
