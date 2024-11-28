import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import LoginSettingsScreen from '../screens/Auth/LoginSettingsScreen';
import TwoFaVerificationScreen from '../screens/Auth/TwoFaVerificationScreen';
import MainTabNavigator from '../screens/Main/MainTabNavigator';
import ContactSupportScreen from '../screens/Menu/ContactSupportScreen';
import CreatePostScreen from '../screens/Posts/CreatePostScreen';
import EditPostScreen from '../screens/Posts/EditPostScreen';
import FullScreenImageScreen from '../screens/Posts/FullScreenImageScreen';
import CommentsScreen from '../screens/Posts/CommentsScreen';
import CreateGroupScreen from '../screens/Groups/CreateGroupScreen';
import GroupContentScreen from '../screens/Groups/GroupContentScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import FriendListScreen from '../screens/Profile/FriendListScreen';
import GroupCommentsScreen from '../screens/Groups/GroupCommentsScreen';
import FullPictureScreen from '../screens/Groups/FullPictureScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();

export default function MainNavigator() {
  const { user } = useContext(AuthContext); // Determine initial route dynamically

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'MainTabs' : 'Login'}>
        {/* Authentication Screens */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
        <Stack.Screen
          name="LoginSettings"
          component={LoginSettingsScreen}
          options={{ title: 'Login Settings' }}
        />
        <Stack.Screen
          name="TwoFaVerification"
          component={TwoFaVerificationScreen}
          options={{ title: '2FA Verification' }}
        />

        {/* Main Tab Navigator */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />

        {/* Profile Screens */}
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{ title: 'Edit Profile' }}
        />
        <Stack.Screen
          name="FriendListScreen"
          component={FriendListScreen}
          options={{ title: 'Friends' }}
        />

        {/* Additional Screens */}
        <Stack.Screen
          name="ContactSupport"
          component={ContactSupportScreen}
          options={{ title: 'Contact Support' }}
        />
        <Stack.Screen
          name="CreatePostScreen"
          component={CreatePostScreen}
          options={{ title: 'Create Post' }}
        />
        <Stack.Screen
          name="EditPostScreen"
          component={EditPostScreen}
          options={{ title: 'Edit Post' }}
        />
        <Stack.Screen
          name="FullScreenImageScreen"
          component={FullScreenImageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CommentsScreen"
          component={CommentsScreen}
          options={{ title: 'Comments' }}
        />
        <Stack.Screen
          name="CreateGroupScreen"
          component={CreateGroupScreen}
          options={{ title: 'Create Group' }}
        />
        <Stack.Screen
          name="GroupContentScreen"
          component={GroupContentScreen}
          options={{ title: 'Group Content' }}
        />
        <Stack.Screen
          name="GroupCommentsScreen"
          component={GroupCommentsScreen}
          options={{ title: 'Group Comments' }}
        />
        <Stack.Screen name="FullPictureScreen" component={FullPictureScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
