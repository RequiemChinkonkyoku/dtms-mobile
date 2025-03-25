import { View, Text, Image, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../../contexts/AuthContext';
import { fetchAccountById } from "../../services/AccountService";

export default function Header() {

    const [userName, setUserName] = useState('');
    const { userInfo } = useAuth();

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
            shadowOffset: {
                width: 0,
                height: 2,
            },
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
                    <Text style={{
                        color: "#666",
                        fontSize: 19,
                        fontWeight: '500',
                    }}>Welcome, </Text>
                    <Text style={{
                        fontSize: 19,
                        fontWeight: 'bold',
                        color: '#007AFF',
                    }}>{userName || 'User'}</Text>
                </View>
                <Feather name="bell" size={24} color="#007AFF" />
            </View>

            {/*Search bar*/}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                padding: 12,
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
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
            <View style={{ height: 10}}>

            </View>
        </View>
    )
}