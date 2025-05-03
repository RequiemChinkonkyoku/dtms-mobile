import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ProfileDetailCard from "../../components/ProfileDetail/ProfileDetailCard";
import { fetchAccountById } from "../../services/AccountService";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfileDetailPage() {
  const { id } = useLocalSearchParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userInfo } = useAuth();

  const loadProfile = async () => {
    try {
      const profile = await fetchAccountById(id);
      if (profile) {
        setProfileData(profile);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const handleNavigateToLegalDocuments = () => {
    router.push({
      pathname: "/legalDocuments/my-legal-documents",
      params: { id: id, refresh: true },
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      {profileData && (
        <ProfileDetailCard
          profileData={profileData}
          onRefreshProfile={loadProfile}
        />
      )}

      {userInfo?.unique_name === id && (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            padding: 15,
            marginHorizontal: 15,
            marginTop: 15,
            borderRadius: 10,
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
          onPress={handleNavigateToLegalDocuments}
        >
          <MaterialIcons name="description" size={24} color="#007AFF" />
          <Text
            style={{
              marginLeft: 10,
              fontSize: 16,
              color: "#333",
              fontWeight: "500",
            }}
          >
            My Legal Documents
          </Text>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color="#666"
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
