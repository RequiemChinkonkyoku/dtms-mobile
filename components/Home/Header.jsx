import { View, Text, Image, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../../contexts/AuthContext';
import { fetchCustomerProfile, fetchTrainerProfile } from "../../services/ProfileService";

export default function Header() {

    const [userName, setUserName] = useState('');
    const { userInfo } = useAuth();

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                if (!userInfo) return;

                const userId = userInfo.unique_name;
                const userRole = parseInt(userInfo.role);
                
                const profile = userRole === 1
                    ? await fetchCustomerProfile(userId)
                    : await fetchTrainerProfile(userId);
                
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
            borderBottomLeftRadius:20,
            borderBottomRightRadius:20
        }}>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{
                        color: "black",
                        fontSize: 19,
                    }}>Welcome, </Text>
                    <Text style={{
                        fontSize: 19,
                        fontWeight: 'bold',
                        color: '#333'
                    }}>{userName || 'User'}</Text>
                </View>
            </View>

            {/*Search bar*/}
            <View style={{
                display:'flex',
                flexDirection:'row',
                gap:10,
                alignItems:'center',
                backgroundColor:'#fff',
                padding:10,
                marginVertical:10,
                marginTop:15,
                borderRadius:8
            }}>
                <Feather name="search" size={24} />
                <TextInput placeholder='Search...'
                    style={{
                        fontSize:17
                    }}
                />
            </View>
        </View>
    )
}