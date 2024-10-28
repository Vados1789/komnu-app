import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FriendRequestsScreen() {
  return (
    <View style={styles.container}>
      <Text>Friend Requests</Text>
      {/* Your FriendRequestComponent or list */}
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
