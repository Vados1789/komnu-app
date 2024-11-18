import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
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
        countryCode: '+45',
        bio: '',
        year: '',
        month: '',
        day: ''
    });

    const [profilePicture, setProfilePicture] = useState(null);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [termsModalVisible, setTermsModalVisible] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const navigation = useNavigation();

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const pickImage = async () => {
        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        };

        Alert.alert(
            "Select Profile Picture",
            "Choose an option",
            [
                {
                    text: "Take Photo", onPress: async () => {
                        const result = await ImagePicker.launchCameraAsync(options);
                        if (!result.canceled) {
                            setProfilePicture(result.assets[0].uri);
                        }
                    }
                },
                {
                    text: "Choose from Library", onPress: async () => {
                        const result = await ImagePicker.launchImageLibraryAsync(options);
                        if (!result.canceled) {
                            setProfilePicture(result.assets[0].uri);
                        }
                    }
                },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    const handleRegister = async () => {
        if (!acceptedTerms) {
            Alert.alert('Error', 'You must accept the terms and conditions to proceed.');
            return;
        }

        if (!formData.username || !formData.email || !formData.year || !formData.month || !formData.day || !formData.phoneNumber) {
            Alert.alert('Error', 'All fields including phone number and date of birth are required.');
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
            const response = await axios.post(`${API_BASE_URL}Users`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            Alert.alert('Success', 'User created successfully!');
            const userId = response.data.userId;
            navigation.navigate('LoginSettings', { userId });

        } catch (error) {
            if (error.response && error.response.data) {
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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Profile</Text>

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
                <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.datePickerButton}>
                    <Text style={styles.datePickerText}>
                        {formData.year && formData.month && formData.day
                            ? `${formData.year}-${formData.month}-${formData.day}`
                            : 'Select Date of Birth'}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setTermsModalVisible(true)}>
                <Text style={styles.termsText}>Read Terms and Conditions</Text>
            </TouchableOpacity>

            <View style={styles.checkboxContainer}>
                <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)}>
                    <Text style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                        {acceptedTerms ? '☑' : '☐'}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>I accept the terms and conditions</Text>
            </View>

            <Button title="Create" onPress={handleRegister} disabled={!acceptedTerms} />

            {/* Terms Modal */}
            <Modal visible={termsModalVisible} animationType="slide" transparent={false}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Terms and Conditions</Text>
                    <ScrollView style={styles.modalContent}>
                        <Text>
                            By accepting, you agree that we will store your personal data, such as your username, email,
                            phone number, and profile information, in our secure database. This information will only be
                            used in compliance with our privacy policy.
                        </Text>
                    </ScrollView>
                    <Button title="Close" onPress={() => setTermsModalVisible(false)} />
                </View>
            </Modal>

            {/* Date Picker Modal */}
            <Modal visible={datePickerVisible} animationType="slide" transparent={true}>
                <View style={styles.datePickerModal}>
                    <Text style={styles.modalTitle}>Select Date of Birth</Text>
                    <View style={styles.dateInputRow}>
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
                    </View>
                    <Button title="Confirm" onPress={() => setDatePickerVisible(false)} />
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flexGrow: 1 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
    profilePicture: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 20 },
    phoneContainer: { flexDirection: 'row', marginBottom: 10 },
    countryCodeInput: { width: 60, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginRight: 5 },
    phoneNumberInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
    datePickerContainer: { marginBottom: 20 },
    datePickerButton: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, alignItems: 'center' },
    datePickerText: { color: '#555' },
    termsText: { textAlign: 'center', color: '#007BFF', marginVertical: 10 },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    checkbox: { fontSize: 20, marginRight: 10 },
    checkboxChecked: { color: '#007BFF' },
    checkboxLabel: { fontSize: 14 },
    modalContainer: { flex: 1, padding: 20, paddingTop: 50 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    modalContent: { flex: 1, marginBottom: 20 },
    datePickerModal: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'white' },
    dateInputRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
    picker: { flex: 1 },
});
