import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import ProfilePictureComponent from '../../components/Profile/ProfilePictureComponent';
import ProfileInfoComponent from '../../components/Profile/ProfileInfoComponent';
import { AuthContext } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <ProfilePictureComponent />
      <ProfileInfoComponent localUser={user} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ProfileScreen;
