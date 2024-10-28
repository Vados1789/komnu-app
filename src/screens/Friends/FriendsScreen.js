import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FriendRequestComponent from '../../components/Friends/FriendRequestComponent';
import FriendsListComponent from '../../components/Friends/FriendsListComponent';
import AllPeopleComponent from '../../components/Friends/AllPeopleComponent';

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState('FriendRequests'); // Manage active tab state

  // Render the component based on activeTab
  const renderComponent = () => {
    switch (activeTab) {
      case 'FriendRequests':
        return <FriendRequestComponent />;
      case 'FriendsList':
        return <FriendsListComponent />;
      case 'DiscoverPeople':
        return <AllPeopleComponent />;
      default:
        return <FriendRequestComponent />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'FriendRequests' && styles.activeTab]}
          onPress={() => setActiveTab('FriendRequests')}
        >
          <Text style={styles.tabText}>Friend Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'FriendsList' && styles.activeTab]}
          onPress={() => setActiveTab('FriendsList')}
        >
          <Text style={styles.tabText}>Friends List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'DiscoverPeople' && styles.activeTab]}
          onPress={() => setActiveTab('DiscoverPeople')}
        >
          <Text style={styles.tabText}>Discover People</Text>
        </TouchableOpacity>
      </View>
      {/* Render selected component */}
      <View style={styles.componentContainer}>{renderComponent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tabContainer: {
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0', // Set background color for better visibility
  },
  activeTab: {
    backgroundColor: '#d3d3d3', // Highlight active tab
  },
  tabText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  componentContainer: {
    flex: 1,
    marginTop: 10,
  },
});
