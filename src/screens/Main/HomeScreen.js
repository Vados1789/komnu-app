import React, { useContext, useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PostsScreen from '../Posts/PostsScreen';
import { AuthContext } from '../../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext); // Access the user data from AuthContext

  // Dynamically set the header title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>
            Kom Nu, <Text style={styles.usernameText}>{user.username}</Text>
          </Text>
        </View>
      ),
    });
  }, [navigation, user.username]);

  return (
    <View style={styles.container}>
      <View style={styles.postsContainer}>
        <PostsScreen />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postsContainer: {
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: '#555',
  },
  usernameText: {
    fontWeight: 'bold',
    color: '#333',
  },
});
