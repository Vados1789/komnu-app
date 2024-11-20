import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ICON_SIZE = 20;
const PRIMARY_COLOR = "#007bff";
const BACKGROUND_COLOR = "#f9f9f9";
const FONT_SIZE_TITLE = 24;
const FONT_SIZE_TEXT = 16;

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
