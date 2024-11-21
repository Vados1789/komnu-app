import React from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import PostItem from './PostItem';

export default function GroupsPostList({ posts, onDelete, navigation }) {
    // Reverse the posts array to display the newest posts at the top
    const sortedPosts = [...posts].reverse();

    return (
        <FlatList
            data={sortedPosts}
            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())} // Use index as a fallback
            renderItem={({ item }) => (
                <PostItem
                    post={item}
                    navigation={navigation} // Pass navigation prop here
                    onDelete={onDelete}
                />
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No posts in group yet.</Text>}
            contentContainerStyle={styles.listContainer}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        paddingBottom: 10,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 20,
    },
});
