import { View, Text, Image, Dimensions, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { CustomerProfileStyles } from "../../styles/CustomerProfileStyles";
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { fetchAllMemberships } from '../../services/MembershipService';

export default function ProfileDetailCard({ profileData }) {
  const windowWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'My Profile',
      headerShown: true
    });
    loadMemberships();
  }, []);

  const loadMemberships = async () => {
    const data = await fetchAllMemberships();
    setMemberships(data.sort((a, b) => a.requiredPoints - b.requiredPoints));
  };

  // Get tier-specific colors
  const getTierColor = (tierName) => {
    switch (tierName.toLowerCase()) {
      case 'basic': return '#8E8E93';
      case 'gold': return '#CFB53B';
      case 'platinum': return '#4682B4';
      default: return '#666';
    }
  };

  // Get tier-specific background colors
  const getTierBackgroundColor = (tierName, isCurrentTier) => {
    if (!isCurrentTier) return '#f5f5f5';
    switch (tierName.toLowerCase()) {
      case 'basic': return '#F5F5F5';
      case 'gold': return '#FFF8E7';
      case 'platinum': return '#F0F8FF';
      default: return '#f5f5f5';
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      {/* Cover and Profile Section */}
      <View style={{
        height: 180,
        backgroundColor: "#007AFF",
        position: "relative",
        marginBottom: 60,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}>
        <View style={{
          position: "absolute",
          bottom: -50,
          left: windowWidth / 2 - 60,
          borderWidth: 4,
          borderColor: "#fff",
          borderRadius: 100,
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 8,
        }}>
          <Image
            source={
              profileData.imageUrl
                ? { uri: profileData.imageUrl }
                : require("../../assets/images/placeholder.png")
            }
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
            }}
          />
        </View>
      </View>

      {/* Basic Info Section */}
      <View style={{
        paddingTop: 10,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        marginBottom: 10,
        alignItems: "center",
        borderRadius: 15,
        margin: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 5 }}>
          {profileData.fullName}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <MaterialCommunityIcons name="email-outline" size={20} color="#666" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 16, color: "#666" }}>{profileData.email}</Text>
        </View>

        <View style={{
          backgroundColor: profileData.status === 1 ? "#E8F5E9" : "#FFEBEE",
          paddingVertical: 8,
          paddingHorizontal: 15,
          borderRadius: 20,
          marginBottom: 15,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <MaterialCommunityIcons
            name={profileData.status === 1 ? "check-circle-outline" : "close-circle-outline"}
            size={20}
            color={profileData.status === 1 ? "#2E7D32" : "#C62828"}
            style={{ marginRight: 5 }}
          />
          <Text style={{
            color: profileData.status === 1 ? "#2E7D32" : "#C62828",
            fontWeight: "600",
          }}>
            {profileData.status === 1 ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* Contact Information Section */}
      <View style={{
        backgroundColor: "#fff",
        padding: 20,
        margin: 15,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <MaterialCommunityIcons name="card-account-details-outline" size={24} color="#007AFF" />
          <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 10 }}>
            Contact Information
          </Text>
        </View>

        <View style={{ gap: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="phone-outline" size={24} color="#007AFF" style={{ width: 35 }} />
            <View>
              <Text style={{ color: "#666", fontSize: 14 }}>Phone</Text>
              <Text style={{ fontSize: 16, color: "#1a1a1a" }}>{profileData.phoneNumber}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="map-marker-outline" size={24} color="#007AFF" style={{ width: 35 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#666", fontSize: 14 }}>Address</Text>
              <Text style={{ fontSize: 16, color: "#1a1a1a" }}>{profileData.address}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="calendar" size={24} color="#007AFF" style={{ width: 35 }} />
            <View>
              <Text style={{ color: "#666", fontSize: 14 }}>Date of Birth</Text>
              <Text style={{ fontSize: 16, color: "#1a1a1a" }}>
                {new Date(profileData.dateOfBirth).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="gender-male-female" size={24} color="#007AFF" style={{ width: 35 }} />
            <View>
              <Text style={{ color: "#666", fontSize: 14 }}>Gender</Text>
              <Text style={{ fontSize: 16, color: "#1a1a1a" }}>{profileData.gender === 1 ? "Male" : "Female"}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Membership Section */}
      <View style={{
        backgroundColor: "#fff",
        padding: 20,
        margin: 15,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <MaterialCommunityIcons name="star-circle-outline" size={24} color="#007AFF" />
          <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 10 }}>
            Membership Status
          </Text>
        </View>

        {/* Current Points */}
        <View style={{
          backgroundColor: "#f0f7ff",
          padding: 20,
          borderRadius: 15,
          alignItems: "center",
          marginBottom: 20,
        }}>
          <Text style={{ fontSize: 16, color: "#666", marginBottom: 10 }}>Your Current Points</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <MaterialCommunityIcons name="star" size={32} color="#007AFF" />
            <Text style={{ fontSize: 32, fontWeight: "bold", color: "#007AFF" }}>
              {profileData.membershipPoints}
            </Text>
          </View>
        </View>

        {/* Membership Tiers */}
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 15, color: "#333" }}>
            Membership Tiers
          </Text>
          {memberships.map((tier, index) => {
            const isCurrentTier = profileData.membershipPoints >= tier.requiredPoints &&
              (index === memberships.length - 1 || profileData.membershipPoints < memberships[index + 1].requiredPoints);

            let progress = 0;
            if (index < memberships.length - 1) {
              if (profileData.membershipPoints > tier.requiredPoints) {
                const pointsInCurrentTier = profileData.membershipPoints - tier.requiredPoints;
                const pointsNeededForNextTier = memberships[index + 1].requiredPoints - tier.requiredPoints;
                progress = Math.min(100, (pointsInCurrentTier / pointsNeededForNextTier) * 100);
              }
            } else if (profileData.membershipPoints >= tier.requiredPoints) {
              progress = 100;
            }

            const tierColor = getTierColor(tier.name);
            const backgroundColor = getTierBackgroundColor(tier.name, isCurrentTier);

            return (
              <View key={tier.id} style={{
                backgroundColor: backgroundColor,
                padding: 15,
                borderRadius: 12,
                marginBottom: 10,
                borderWidth: isCurrentTier ? 1 : 0,
                borderColor: tierColor,
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons
                      name={isCurrentTier ? "crown" : "crown-outline"}
                      size={24}
                      color={tierColor}
                    />
                    <View>
                      <Text style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginLeft: 8,
                        color: tierColor
                      }}>
                        {tier.name}
                      </Text>
                      {isCurrentTier && (
                        <Text style={{
                          fontSize: 12,
                          color: tierColor,
                          marginLeft: 8,
                        }}>
                          Current Tier
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text style={{ 
                    color: tierColor,
                    fontWeight: 'bold'
                  }}>{tier.discountAmount}% OFF</Text>
                </View>

                <Text style={{ color: "#666", marginBottom: 8 }}>{tier.description}</Text>

                {/* Progress Bar */}
                <View style={{ height: 4, backgroundColor: "#E0E0E0", borderRadius: 2 }}>
                  <View style={{
                    height: '100%',
                    width: `${progress}%`,
                    backgroundColor: tierColor,
                    borderRadius: 2,
                  }} />
                </View>

                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  marginTop: 8 
                }}>
                  <Text style={{ color: "#666", fontSize: 12 }}>
                    {tier.requiredPoints} points required
                  </Text>
                  {index < memberships.length - 1 && (
                    <Text style={{ color: "#666", fontSize: 12 }}>
                      Next: {memberships[index + 1].requiredPoints} points
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Benefits Info */}
        <View style={{ marginTop: 20, padding: 15, backgroundColor: "#FFF9C4", borderRadius: 12 }}>
          <Text style={{ fontSize: 14, color: "#666", textAlign: 'center' }}>
            Earn points with every purchase and unlock exclusive benefits!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}