import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DiscoverPeopleScreen() {
  return (
    <View style={styles.container}>
      <Text>Discover People</Text>
      {/* Your AllPeopleComponent or list */}
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
