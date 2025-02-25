import { View, Text, Image, Dimensions } from "react-native";
import React from "react";
import { CustomerProfileStyles } from "../../styles/CustomerProfileStyles";

export default function CustomerProfileCard({ customer }) {
  const windowWidth = Dimensions.get("window").width;

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      <View
        style={{
          height: 180,
          backgroundColor: "#1877f2",
          position: "relative",
          marginBottom: 60,
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
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
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
      <View
        style={{
          paddingTop: 10,
          paddingHorizontal: 20,
          backgroundColor: "#fff",
          marginBottom: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 5,
          }}
        >
          {customer.fullName}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#65676B",
            marginBottom: 15,
          }}
        >
          {customer.email}
        </Text>

        <View
          style={{
            backgroundColor: customer.status === 1 ? "#E8F5E9" : "#FFEBEE",
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 20,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              color: customer.status === 1 ? "#2E7D32" : "#C62828",
              fontWeight: "500",
            }}
          >
            {customer.status === 1 ? "● Active" : "● Inactive"}
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            marginBottom: 15,
          }}
        >
          Contact Information
        </Text>

        <View style={{ gap: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ width: 100, color: "#65676B" }}>Phone</Text>
            <Text>{customer.phoneNumber}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ width: 100, color: "#65676B" }}>Address</Text>
            <Text style={{ flex: 1 }}>{customer.address}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ width: 100, color: "#65676B" }}>Gender</Text>
            <Text>{customer.gender === 1 ? "Male" : "Female"}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            marginBottom: 15,
          }}
        >
          Membership
        </Text>

        <View
          style={{
            backgroundColor: "#F0F2F5",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#1877f2",
            }}
          >
            {customer.membershipPoints}
          </Text>
          <Text style={{ color: "#65676B" }}>Points</Text>
        </View>
      </View>
    </View>
  );
}
