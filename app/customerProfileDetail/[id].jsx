import { View, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { customerProfileStyles } from "../../styles/CustomerProfileStyles";
import CustomerProfileCard from "../../components/CustomerProfile/CustomerProfileCard";

export default function CustomerDetailPage() {
  const { id } = useLocalSearchParams();

  const customerData = {
    id: id,
    username: "johndoe123",
    email: "john.doe@example.com",
    status: 1,
    profileType: 2,
    fullName: "John Doe",
    phoneNumber: "0123456789",
    address: "123 Main Street, City",
    dateOfBirth: "1990-01-01",
    gender: 1,
    membershipPoints: 1500,
    imageUrl: null,
  };

  return (
    <ScrollView style={customerProfileStyles.container}>
      <CustomerProfileCard customer={customerData} />
    </ScrollView>
  );
}
