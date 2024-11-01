import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FullScreenImageScreen({ route }) {
  const { imageUri } = route.params;
  const navigation = useNavigation();

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.fullScreenImage} />
      ) : (
        <Text style={{ color: '#fff', fontSize: 18 }}>Image not available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 5,
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
