import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component that wraps around the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to login and store user information
  const login = async (userData) => {
    try {
      // Log full user data from server
      console.log("User logging in with data:", userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.log("Error saving user data:", error);
    }
  };

  // Function to logout and clear user information
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.log("Error removing user data:", error);
    }
  };

  // Check if the user is already logged in when the app starts
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
        setIsLoading(false);
      } catch (error) {
        console.log("Error loading user data:", error);
        setIsLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
