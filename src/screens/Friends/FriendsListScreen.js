import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FriendsListScreen() {
  return (
    <View style={styles.container}>
      <Text>Friends List</Text>
      {/* Your FriendsListComponent or list */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
