import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../components/Home/Header';
import BlogList from '../../components/Home/Blog';
import { homeStyles } from '../../styles/HomeStyles';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Minimum refresh time
        } finally {
            setRefreshing(false);
        }
    };

  const renderFeatureSection = () => (
    <View
      style={homeStyles.featureSection}
    >
      <Text style={homeStyles.sectionTitle}>Our Services</Text>
      <View style={homeStyles.featureGrid}>
        <TouchableOpacity
          style={[homeStyles.featureCard, { backgroundColor: '#e6f3ff' }]}
          onPress={() => router.push('/(tabs)/explore')}
        >
          <MaterialIcons name="school" size={32} color="#007AFF" />
          <Text style={[homeStyles.featureTitle, { color: '#007AFF' }]}>Training Courses</Text>
          <Text style={homeStyles.featureDescription}>Professional dog training programs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[homeStyles.featureCard, { backgroundColor: '#fff5e6' }]}
          onPress={() => router.push('/boarding')}
        >
          <MaterialIcons name="home" size={32} color="#FF9500" />
          <Text style={[homeStyles.featureTitle, { color: '#FF9500' }]}>Boarding</Text>
          <Text style={homeStyles.featureDescription}>Safe and comfortable stay for your pets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[homeStyles.featureCard, { backgroundColor: '#e6fff2' }]}
          onPress={() => router.push('/dog/my-dog')}
        >
          <MaterialIcons name="pets" size={32} color="#34C759" />
          <Text style={[homeStyles.featureTitle, { color: '#34C759' }]}>Dog Management</Text>
          <Text style={homeStyles.featureDescription}>Register and manage your dogs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[homeStyles.featureCard, { backgroundColor: '#ffe6e6' }]}
          onPress={() => router.push('/consultation')}
        >
          <MaterialIcons name="medical-services" size={32} color="#FF3B30" />
          <Text style={[homeStyles.featureTitle, { color: '#FF3B30' }]}>Consultation</Text>
          <Text style={homeStyles.featureDescription}>Expert advice for your pet's needs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHighlightSection = () => (
    <View
      style={homeStyles.highlightSection}
    >
      <Text style={homeStyles.sectionTitle}>Why Choose Us?</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={homeStyles.highlightScroll}>
        <LinearGradient
          colors={['#e6f3ff', '#ffffff']}
          style={homeStyles.highlightCard}
        >
          <MaterialIcons name="verified" size={40} color="#007AFF" />
          <Text style={[homeStyles.highlightTitle, { color: '#007AFF' }]}>Certified Trainers</Text>
          <Text style={homeStyles.highlightDescription}>Expert trainers with years of experience</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#fff5e6', '#ffffff']}
          style={homeStyles.highlightCard}
        >
          <MaterialIcons name="security" size={40} color="#FF9500" />
          <Text style={[homeStyles.highlightTitle, { color: '#FF9500' }]}>Safe Environment</Text>
          <Text style={homeStyles.highlightDescription}>Secure and monitored facilities</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#e6fff2', '#ffffff']}
          style={homeStyles.highlightCard}
        >
          <MaterialIcons name="psychology" size={40} color="#34C759" />
          <Text style={[homeStyles.highlightTitle, { color: '#34C759' }]}>Personalized Care</Text>
          <Text style={homeStyles.highlightDescription}>Tailored to your dog's needs</Text>
        </LinearGradient>
      </ScrollView>
    </View>
  );

  return (
    <ScrollView 
            showsVerticalScrollIndicator={false} 
            style={homeStyles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#007AFF']}
                    tintColor="#007AFF"
                />
            }
        >
      <Header onRefresh={onRefresh} />
      <BlogList />
      {renderFeatureSection()}
      {renderHighlightSection()}
      <View style={homeStyles.footer}>
        <Text style={homeStyles.footerText}>© 2025 Dog Training Management System</Text>
      </View>
    </ScrollView>
  );
}