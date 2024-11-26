import React, { useContext, useLayoutEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProfilePictureComponent from '../../components/Profile/ProfilePictureComponent';
import ProfileInfoComponent from '../../components/Profile/ProfileInfoComponent';
import { AuthContext } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen')}>
          <Icon name="edit" size={24} color="#007bff" style={styles.icon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfilePictureComponent editable={false} />
      <ProfileInfoComponent localUser={user} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05, // 5% of the screen width
    paddingVertical: height * 0.05, // 5% of the screen height
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 15,
  },
  loadingText: {
    fontSize: Platform.OS === 'android' ? 18 : 20, // Adjust font size based on platform
    color: '#777',
    textAlign: 'center',
  },
});

export default ProfileScreen;
