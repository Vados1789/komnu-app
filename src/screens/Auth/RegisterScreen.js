import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from '../../config/apiConfig.js';

export default function RegisterScreen() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        countryCode: '+45', // Default to Denmark
        bio: '',
        year: '', 
        month: '', 
        day: ''
    });

    const [profilePicture, setProfilePicture] = useState(null);
    const navigation = useNavigation();

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Make the selected image square
            quality: 1,
        });

        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
        }
    };

    const handleRegister = async () => {
        console.log("Data being sent to server:", formData);

        if (!formData.username || !formData.email || !formData.year || !formData.month || !formData.day) {
            Alert.alert('Error', 'Username, Email, and Date of Birth are required.');
            return;
        }

        const dateOfBirth = `${formData.year}-${formData.month}-${formData.day}`;

        const data = new FormData();
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("phoneNumber", `${formData.countryCode}${formData.phoneNumber}`);
        data.append("bio", formData.bio);
        data.append("dateOfBirth", dateOfBirth);

        if (profilePicture) {
            const filename = profilePicture.split('/').pop();
            const fileType = filename.split('.').pop();
            data.append("profilePicture", {
                uri: profilePicture,
                name: filename,
                type: `image/${fileType}`,
            });
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}Users`,
                data,
                {
                    headers: { 
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log("Server response:", response.data);
            Alert.alert('Success', 'User created successfully!');
            
            // Navigate to LoginSettingsScreen and pass the user_id
            const userId = response.data.userId;
            navigation.navigate('LoginSettings', { userId });

        } catch (error) {
            console.error("Error during registration:", error);
            if (error.response && error.response.data) {
                console.log("Server error response:", error.response.data);
                Alert.alert('Error', JSON.stringify(error.response.data.errors));
            } else {
                Alert.alert('Error', 'An unexpected error occurred.');
            }
        }
    };

    const generateDays = () => Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const generateMonths = () => Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Profile</Text>
        
            {/* Profile Picture */}
            <TouchableOpacity onPress={pickImage}>
                <Image
                    source={profilePicture ? { uri: profilePicture } : require('../../../assets/images/add-image-photo-icon.png')}
                    style={styles.profilePicture}
                />
                <Text style={styles.pickerLabel}>Tap to select a profile picture</Text>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                autoCapitalize="none"
            />
            <View style={styles.phoneContainer}>
                <TextInput
                    style={styles.countryCodeInput}
                    value={formData.countryCode}
                    editable={false}
                />
                <TextInput
                    style={styles.phoneNumberInput}
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChangeText={(value) => handleInputChange('phoneNumber', value)}
                    keyboardType="phone-pad"
                />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Bio"
                value={formData.bio}
                onChangeText={(value) => handleInputChange('bio', value)}
            />

            <View style={styles.datePickerContainer}>
                <Text style={styles.label}>Date of Birth</Text>
                <View style={styles.dateInputRow}>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={formData.year}
                            style={styles.picker}
                            onValueChange={(value) => handleInputChange('year', value)}
                        >
                        <Picker.Item label="Year" value="" />
                            {generateYears().map((year) => (
                                <Picker.Item key={year} label={year} value={year} />
                            ))}
                        </Picker>
                        <Text style={styles.pickerLabel}>Year</Text>
                    </View>

                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={formData.month}
                            style={styles.picker}
                            onValueChange={(value) => handleInputChange('month', value)}
                        >
                        <Picker.Item label="Month" value="" />
                            {generateMonths().map((month) => (
                                <Picker.Item key={month} label={month} value={month} />
                            ))}
                        </Picker>
                        <Text style={styles.pickerLabel}>Month</Text>
                    </View>

                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={formData.day}
                            style={styles.picker}
                            onValueChange={(value) => handleInputChange('day', value)}
                        >
                            <Picker.Item label="Day" value="" />
                                {generateDays().map((day) => (
                                    <Picker.Item key={day} label={day} value={day} />
                                ))}
                        </Picker>
                        <Text style={styles.pickerLabel}>Day</Text>
                    </View>
                </View>
            </View>

            <Button title="Create" onPress={handleRegister} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    countryCodeInput: {
        width: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    phoneNumberInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    datePickerContainer: {
        marginBottom: 20,
    },
    dateInputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pickerWrapper: {
        alignItems: 'center',
        width: '30%',
    },
    picker: {
        width: '100%',
    },
    pickerLabel: {
        marginTop: 5,
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
