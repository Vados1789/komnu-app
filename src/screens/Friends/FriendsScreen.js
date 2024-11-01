import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import FriendRequestComponent from '../../components/Friends/FriendRequestComponent';
import FriendsListComponent from '../../components/Friends/FriendsListComponent';
import AllPeopleComponent from '../../components/Friends/AllPeopleComponent';

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState('FriendRequests');
  const [searchText, setSearchText] = useState('');

  // Handle search input change
  const handleSearch = (text) => {
    setSearchText(text);
  };

  // Render the component based on activeTab
  const renderComponent = () => {
    switch (activeTab) {
      case 'FriendRequests':
        return <FriendRequestComponent searchText={searchText} />;
      case 'FriendsList':
        return <FriendsListComponent searchText={searchText} />;
      case 'DiscoverPeople':
        return <AllPeopleComponent searchText={searchText} />;
      default:
        return <FriendRequestComponent searchText={searchText} />;
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for users..."
        value={searchText}
        onChangeText={handleSearch}
      />
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
      <View style={styles.componentContainer}>{renderComponent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#d3d3d3',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  componentContainer: {
    flex: 1,
    marginTop: 10,
  },
});
