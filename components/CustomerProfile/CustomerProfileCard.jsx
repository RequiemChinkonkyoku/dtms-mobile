import { View, Text, Image, Dimensions, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { CustomerProfileStyles } from "../../styles/CustomerProfileStyles";
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

export default function CustomerProfileCard({ customer }) {
  const windowWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'My Profile',
      headerShown: true
    });
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      {/* Cover and Profile Section */}
      <View
        style={{
          height: 180,
          backgroundColor: "#007AFF",
          position: "relative",
          marginBottom: 60,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <View
          style={{
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
          }}
        >
          <Image
            source={
              customer.imageUrl
                ? { uri: customer.imageUrl }
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
          {customer.fullName}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <MaterialCommunityIcons name="email-outline" size={20} color="#666" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 16, color: "#666" }}>{customer.email}</Text>
        </View>

        <View style={{
          backgroundColor: customer.status === 1 ? "#E8F5E9" : "#FFEBEE",
          paddingVertical: 8,
          paddingHorizontal: 15,
          borderRadius: 20,
          marginBottom: 15,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <MaterialCommunityIcons 
            name={customer.status === 1 ? "check-circle-outline" : "close-circle-outline"} 
            size={20} 
            color={customer.status === 1 ? "#2E7D32" : "#C62828"} 
            style={{ marginRight: 5 }}
          />
          <Text style={{
            color: customer.status === 1 ? "#2E7D32" : "#C62828",
            fontWeight: "600",
          }}>
            {customer.status === 1 ? "Active" : "Inactive"}
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
              <Text style={{ fontSize: 16, color: "#1a1a1a" }}>{customer.phoneNumber}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="map-marker-outline" size={24} color="#007AFF" style={{ width: 35 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#666", fontSize: 14 }}>Address</Text>
              <Text style={{ fontSize: 16, color: "#1a1a1a" }}>{customer.address}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="gender-male-female" size={24} color="#007AFF" style={{ width: 35 }} />
            <View>
              <Text style={{ color: "#666", fontSize: 14 }}>Gender</Text>
              <Text style={{ fontSize: 16, color: "#1a1a1a" }}>{customer.gender === 1 ? "Male" : "Female"}</Text>
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
            Membership
          </Text>
        </View>

        <View style={{
          backgroundColor: "#f0f7ff",
          padding: 20,
          borderRadius: 15,
          alignItems: "center",
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 10,
        }}>
          <MaterialCommunityIcons name="star" size={32} color="#007AFF" />
          <Text style={{ fontSize: 32, fontWeight: "bold", color: "#007AFF" }}>
            {customer.membershipPoints}
          </Text>
          <Text style={{ color: "#666", fontSize: 16, fontWeight: "500" }}>Points</Text>
        </View>
      </View>
    </ScrollView>
  );
}