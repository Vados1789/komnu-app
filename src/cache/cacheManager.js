import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'posts';

export const saveToCache = async (key, data) => {
    try {
        const jsonData = JSON.stringify(data);
        await AsyncStorage.setItem(key, jsonData);
    } catch (error) {
        console.error('Error saving to cache:', error);
    }
};

export const loadFromCache = async (key) => {
    try {
        const jsonData = await AsyncStorage.getItem(key);
        return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
        console.error('Error loading from cache:', error);
        return null;
    }
};

export const clearCache = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
};
