import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { fetchAccountById } from "../../services/AccountService";
import { useAuth } from '../../contexts/AuthContext';

export default function UserIntro() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const { userInfo } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      loadUserProfile();
    }, [userInfo])
  );

  useEffect(() => {
    loadUserProfile();
  }, [userInfo]);

  const loadUserProfile = async () => {
    try {
      if (!userInfo) return;

      const userId = userInfo.unique_name;
      const userRoleId = userInfo.role;
      console.log('User role id:', userRoleId);
      console.log('Loading profile for user id:', userId);

      const profile = await fetchAccountById(userId);
      if (profile) {
        setUserProfile(profile);
        console.log('User Profile loaded:', profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

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
