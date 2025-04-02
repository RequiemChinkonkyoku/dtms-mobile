import { View, Text, Image, TextInput, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../../contexts/AuthContext';
import { fetchAccountById } from "../../services/AccountService";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Header({ onRefresh }) {

    const [userName, setUserName] = useState('');
    const { userInfo } = useAuth();

    const handleRefresh = async () => {
        if (onRefresh) {
            onRefresh();
        }
        await loadUserProfile();
    };

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                if (!userInfo) return;

                const userId = userInfo.unique_name;
                
                const profile = await fetchAccountById(userId);
                
                if (profile) {
                    setUserName(profile.fullName);
                }
            } catch (error) {
                console.error('Error loading user profile:', error);
            }
        };

        loadUserProfile();
    }, [userInfo]);

    return (
        <View style={{
            padding: 20,
            paddingTop: 20,
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
            backgroundColor: '#f0f8ff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            marginBottom: 20,
        }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 15,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={handleRefresh}
                        style={{
                            backgroundColor: '#007AFF',
                            padding: 8,
                            borderRadius: 12,
                            marginRight: 10,
                        }}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="dog" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: 19,
                        fontWeight: 'bold',
                        color: '#007AFF',
                    }}>{userName || 'User'}</Text>
                </View>
                <View style={{
                    backgroundColor: '#E8F1FF',
                    padding: 8,
                    borderRadius: 12,
                }}>
                    <Feather name="bell" size={24} color="#007AFF" />
                </View>
            </View>

            {/*Search bar*/}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                padding: 12,
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
            }}>
                <Feather name="search" size={24} color="#007AFF" />
                <TextInput 
                    placeholder='Search for courses, trainers...'
                    placeholderTextColor="#999"
                    style={{
                        flex: 1,
                        fontSize: 16,
                        marginLeft: 10,
                        color: '#333',
                    }}
                />
            </View>
            <View style={{ height: 10 }} />
        </View>
    )
}