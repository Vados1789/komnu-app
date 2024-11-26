import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window'); // Get screen width

const ICON_SIZE = width * 0.05; // 5% of screen width
const PRIMARY_COLOR = "#007bff";
const BACKGROUND_COLOR = "#f9f9f9";
const FONT_SIZE_TITLE = width * 0.06; // 6% of screen width
const FONT_SIZE_TEXT = width * 0.04; // 4% of screen width

const ProfileInfoComponent = ({ localUser }) => (
  <View style={styles.container}>
    <Text style={styles.username}>{localUser.username || "Username"}</Text>

    <View style={styles.infoItem}>
      <Icon name="email" size={ICON_SIZE} color={PRIMARY_COLOR} />
      <Text style={styles.infoText}>{localUser.email || "Email not provided"}</Text>
    </View>

    <View style={styles.infoItem}>
      <Icon name="phone" size={ICON_SIZE} color={PRIMARY_COLOR} />
      <Text style={styles.infoText}>{localUser.phoneNumber || "Phone not provided"}</Text>
    </View>

    <View style={styles.infoItem}>
      <Icon name="event" size={ICON_SIZE} color={PRIMARY_COLOR} />
      <Text style={styles.infoText}>
        {localUser.dateOfBirth ? `Birthdate: ${new Date(localUser.dateOfBirth).toLocaleDateString()}` : "Birthdate not provided"}
      </Text>
    </View>

    <View style={styles.infoItem}>
      <Icon name="info" size={ICON_SIZE} color={PRIMARY_COLOR} />
      <Text style={styles.infoText}>{localUser.bio || "Bio not provided"}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 10,
    marginTop: 15,
  },
  username: {
    fontSize: FONT_SIZE_TITLE,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: FONT_SIZE_TEXT,
    marginLeft: 10,
  },
});

export default ProfileInfoComponent;
