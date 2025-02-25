import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function UserIntro() {
  const router = useRouter();

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
      }}
    >
      <TouchableOpacity onPress={() => router.push("/customerProfileDetail/1")}>
        <Image
          source={{
            uri: "https://res.cloudinary.com/djy6ydaxz/image/upload/v1739695785/wxsydxyqpedbnbelinhe.jpg",
          }}
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
        UserName
      </Text>

      <Text
        style={{
          fontSize: 16,
        }}
      >
        Email Address
      </Text>
    </View>
  );
}
