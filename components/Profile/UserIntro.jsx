import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { fetchCustomerProfile, fetchTrainerProfile } from "../../services/ProfileService";
import { useAuth } from '../../contexts/AuthContext';

export default function UserIntro() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
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

        setUserProfile(profile);
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, [userInfo]);

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
      }}
    >
      <TouchableOpacity
        onPress={() => userProfile &&
          router.push(`/profileDetail/${userInfo.unique_name}`)}
      >
        <Image
          source={
            userProfile?.imageUrl
              ? { uri: userProfile.imageUrl }
              : require("../../assets/images/placeholder.png")
          }
          style={{
            width: 100,
            height: 100,
            borderRadius: 99,
          }}
        />
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 20,
        }}
      >
        {userProfile?.fullName || "Loading..."}
      </Text>

      <Text
        style={{
          fontSize: 16,
        }}
      >
        {userProfile?.email || "Loading..."}
      </Text>
    </View>
  );
}
