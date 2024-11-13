import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MyGroupsComponent from '../../components/Groups/MyGroupsComponent';
import AllGroupsComponent from '../../components/Groups/AllGroupsComponent';
import { useNavigation } from '@react-navigation/native';

export default function GroupsScreen() {
  const [activeTab, setActiveTab] = useState('MyGroups');
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  // Handle search input change
  const handleSearch = (text) => {
    setSearchText(text);
  };

  // Render the component based on activeTab
  const renderComponent = () => {
    switch (activeTab) {
      case 'MyGroups':
        return <MyGroupsComponent searchText={searchText} />;
      case 'AllGroups':
        return <AllGroupsComponent searchText={searchText} />;
      default:
        return <MyGroupsComponent searchText={searchText} />;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createGroupButton}
        onPress={() => navigation.navigate('CreateGroupScreen')} // Navigate to the CreateGroupScreen
      >
        <Text style={styles.buttonText}>Create a Group</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.searchBar}
        placeholder="Search for groups..."
        value={searchText}
        onChangeText={handleSearch}
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'MyGroups' && styles.activeTab]}
          onPress={() => setActiveTab('MyGroups')}
        >
          <Text style={styles.tabText}>My Groups</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'AllGroups' && styles.activeTab]}
          onPress={() => setActiveTab('AllGroups')}
        >
          <Text style={styles.tabText}>All Groups</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.componentContainer}>{renderComponent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  createGroupButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
