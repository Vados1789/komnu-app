import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProfilePictureComponent from '../../components/Profile/ProfilePictureComponent';
import { AuthContext } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <ProfilePictureComponent />
      <Text style={styles.username}>{user?.username || "Username"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 20,
    marginTop: 10,
  },
});

export default ProfileScreen;
