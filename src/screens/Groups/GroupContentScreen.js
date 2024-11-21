import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import { AuthContext } from '../../context/AuthContext';
import CreatePostForm from '../../components/Groups/CreatePostForm';
import GroupsPostList from '../../components/Groups/GroupsPostList';

export default function GroupContentScreen({ route, navigation }) {
    const { groupId } = route.params;
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchGroupPosts();
    }, [groupId]);

    const fetchGroupPosts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}GroupPosts/${groupId}`);
            setPosts(response.data.reverse());
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('No posts found for this group.');
                setPosts([]);
            } else {
                console.error('Error fetching group posts:', error);
            }
        }
    };

    const handlePostCreated = async (data) => {
        try {
            await axios.post(`${API_BASE_URL}GroupPosts/add`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchGroupPosts();
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`${API_BASE_URL}GroupPosts/delete/${postId}`);
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <View style={styles.container}>
            <CreatePostForm groupId={groupId} userId={user.userId} onPostCreated={handlePostCreated} />
            <GroupsPostList
                posts={posts}
                onDelete={handleDeletePost}
                navigation={navigation} // Pass navigation here
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
});
