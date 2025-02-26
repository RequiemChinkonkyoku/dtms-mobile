import { View, ScrollView, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { customerProfileStyles } from "../../styles/CustomerProfileStyles";
import ProfileDetailCard from "../../components/ProfileDetail/ProfileDetailCard";
import { fetchCustomerProfile, fetchTrainerProfile } from "../../services/ProfileService";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfileDetailPage() {
  const { id } = useLocalSearchParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!userInfo) return;
        const userRole = parseInt(userInfo.role);
        const profile = userRole === 1 
          ? await fetchCustomerProfile(id)
          : await fetchTrainerProfile(id);

        if (profile) {
          setProfileData(profile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, userInfo]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={customerProfileStyles.container}>
      {profileData && <ProfileDetailCard profileData={profileData} />}
    </ScrollView>
  );
}