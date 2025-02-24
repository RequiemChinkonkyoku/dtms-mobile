import { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Home/Header';
import BlogList from '../../components/Home/Blog';

export default function Home() {
  const router = useRouter();


  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Header />

      <BlogList />

      <View style={{
          height:50
        }}></View>

      {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Test Api Account" onPress={() => router.push('/accounts/account')} />
      </View> */}
    </ScrollView>
  );
}
