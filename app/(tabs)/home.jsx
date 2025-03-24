import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../components/Home/Header';
import BlogList from '../../components/Home/Blog';
import { homeStyles } from '../../styles/HomeStyles';

export default function Home() {
  const router = useRouter();

  const renderFeatureSection = () => (
    <View style={homeStyles.featureSection}>
      <Text style={homeStyles.sectionTitle}>Our Services</Text>
      <View style={homeStyles.featureGrid}>
        <TouchableOpacity style={homeStyles.featureCard} onPress={() => router.push('/(tabs)/explore')}>
          <MaterialIcons name="school" size={32} color="#007AFF" />
          <Text style={homeStyles.featureTitle}>Training Courses</Text>
          <Text style={homeStyles.featureDescription}>Professional dog training programs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={homeStyles.featureCard} onPress={() => router.push('/boarding')}>
          <MaterialIcons name="home" size={32} color="#FF9500" />
          <Text style={homeStyles.featureTitle}>Boarding</Text>
          <Text style={homeStyles.featureDescription}>Safe and comfortable stay for your pets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={homeStyles.featureCard} onPress={() => router.push('/dog/my-dog')}>
          <MaterialIcons name="pets" size={32} color="#34C759" />
          <Text style={homeStyles.featureTitle}>Dog Management</Text>
          <Text style={homeStyles.featureDescription}>Register and manage your dogs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={homeStyles.featureCard} onPress={() => router.push('/consultation')}>
          <MaterialIcons name="medical-services" size={32} color="#FF3B30" />
          <Text style={homeStyles.featureTitle}>Consultation</Text>
          <Text style={homeStyles.featureDescription}>Expert advice for your pet's needs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHighlightSection = () => (
    <View style={homeStyles.highlightSection}>
      <Text style={homeStyles.sectionTitle}>Why Choose Us?</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={homeStyles.highlightScroll}>
        <View style={homeStyles.highlightCard}>
          <MaterialIcons name="verified" size={40} color="#007AFF" />
          <Text style={homeStyles.highlightTitle}>Certified Trainers</Text>
          <Text style={homeStyles.highlightDescription}>Expert trainers with years of experience</Text>
        </View>
        <View style={homeStyles.highlightCard}>
          <MaterialIcons name="security" size={40} color="#FF9500" />
          <Text style={homeStyles.highlightTitle}>Safe Environment</Text>
          <Text style={homeStyles.highlightDescription}>Secure and monitored facilities</Text>
        </View>
        <View style={homeStyles.highlightCard}>
          <MaterialIcons name="psychology" size={40} color="#34C759" />
          <Text style={homeStyles.highlightTitle}>Personalized Care</Text>
          <Text style={homeStyles.highlightDescription}>Tailored to your dog's needs</Text>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={homeStyles.container}>
      <Header />
      <BlogList />
      {renderFeatureSection()}
      {renderHighlightSection()}
      <View style={homeStyles.footer}>
        <Text style={homeStyles.footerText}>© 2025 Dog Training Management System</Text>
      </View>
    </ScrollView>
  );
}