import { View, ScrollView, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import ProfileDetailCard from "../../components/ProfileDetail/ProfileDetailCard";
import { fetchAccountById } from "../../services/AccountService";

export default function ProfileDetailPage() {
  const { id } = useLocalSearchParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const profile = await fetchAccountById(id);
      if (profile) {
        setProfileData(profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      {profileData && <ProfileDetailCard
        profileData={profileData}
        onRefreshProfile={loadProfile}
      />}
    </View>
  );
}