import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function MenuScreen() {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            logout(); // Call logout function from AuthContext
            navigation.navigate('Login'); // Redirect to Login screen
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.menuText}>Settings</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="gray" style={styles.arrow} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ContactSupport')}
        >
          <Ionicons name="chatbox-ellipses-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.menuText}>Contact Support</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="gray" style={styles.arrow} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="bug-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.menuText}>Report a Bug</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="gray" style={styles.arrow} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="language-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.menuText}>Change Language</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="gray" style={styles.arrow} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.menuText}>Logout</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="gray" style={styles.arrow} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 18,
    flex: 1,
  },
  arrow: {
    marginLeft: 'auto',
  },
});
