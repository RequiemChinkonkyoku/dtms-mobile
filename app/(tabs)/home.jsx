import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../components/Home/Header';
import BlogList from '../../components/Home/Blog';
import { homeStyles } from '../../styles/HomeStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { userInfo } = useAuth();
  const isTrainer = userInfo?.role?.includes('Trainer');

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setRefreshing(false);
    }
  };

  const renderTrainerFeatureSection = () => (
    <View style={homeStyles.featureSection}>
      <Text style={homeStyles.sectionTitle}>Management Center</Text>
      <View style={homeStyles.featureGrid}>
        <View
          style={[homeStyles.featureCard, { backgroundColor: '#e6f3ff' }]}
        >
          <MaterialIcons name="calendar-today" size={32} color="#007AFF" />
          <Text style={[homeStyles.featureTitle, { color: '#007AFF' }]}>My Schedule</Text>
          <Text style={homeStyles.featureDescription}>View and manage your training sessions</Text>
        </View>

        <View
          style={[homeStyles.featureCard, { backgroundColor: '#fff5e6' }]}
        >
          <MaterialIcons name="class" size={32} color="#FF9500" />
          <Text style={[homeStyles.featureTitle, { color: '#FF9500' }]}>My Classes</Text>
          <Text style={homeStyles.featureDescription}>Manage your training classes</Text>
        </View>

        <View
          style={[homeStyles.featureCard, { backgroundColor: '#e8eaff' }]}
        >
          <MaterialIcons name="trending-up" size={32} color="#6366f1" />
          <Text style={[homeStyles.featureTitle, { color: '#6366f1' }]}>Class Progress</Text>
          <Text style={homeStyles.featureDescription}>Track students' training progress</Text>
        </View>

        <View
          style={[homeStyles.featureCard, { backgroundColor: '#ffe6e6' }]}
        >
          <MaterialIcons name="assessment" size={32} color="#FF3B30" />
          <Text style={[homeStyles.featureTitle, { color: '#FF3B30' }]}>Reports</Text>
          <Text style={homeStyles.featureDescription}>View training reports and analytics</Text>
        </View>
      </View>
    </View>
  );

  const renderTrainerHighlightSection = () => (
    <View style={homeStyles.highlightSection}>
      <Text style={homeStyles.sectionTitle}>Training Resources</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={homeStyles.highlightScroll}>
        <LinearGradient
          colors={['#e6f3ff', '#ffffff']}
          style={homeStyles.highlightCard}
        >
          <MaterialIcons name="menu-book" size={40} color="#007AFF" />
          <Text style={[homeStyles.highlightTitle, { color: '#007AFF' }]}>Training Materials</Text>
          <Text style={homeStyles.highlightDescription}>Access lesson plans and guides</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#fff5e6', '#ffffff']}
          style={homeStyles.highlightCard}
        >
          <MaterialIcons name="people" size={40} color="#FF9500" />
          <Text style={[homeStyles.highlightTitle, { color: '#FF9500' }]}>Student Management</Text>
          <Text style={homeStyles.highlightDescription}>Manage your training groups</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#e6fff2', '#ffffff']}
          style={homeStyles.highlightCard}
        >
          <MaterialIcons name="insights" size={40} color="#34C759" />
          <Text style={[homeStyles.highlightTitle, { color: '#34C759' }]}>Performance Metrics</Text>
          <Text style={homeStyles.highlightDescription}>Track your teaching impact</Text>
        </LinearGradient>
      </ScrollView>
    </View>
  );

  const renderFeatureSection = () => (
    <View
      style={homeStyles.featureSection}
    >
      <Text style={homeStyles.sectionTitle}>Our Services</Text>
      <View style={homeStyles.featureGrid}>
        <View
          style={[homeStyles.featureCard, { backgroundColor: '#e6f3ff' }]}
        >
          <MaterialIcons name="school" size={32} color="#007AFF" />
          <Text style={[homeStyles.featureTitle, { color: '#007AFF' }]}>Training Courses</Text>
          <Text style={homeStyles.featureDescription}>Professional dog training programs</Text>
        </View>

        <View
          style={[homeStyles.featureCard, { backgroundColor: '#fff5e6' }]}
        >
          <MaterialIcons name="home" size={32} color="#FF9500" />
          <Text style={[homeStyles.featureTitle, { color: '#FF9500' }]}>Boarding</Text>
          <Text style={homeStyles.featureDescription}>Safe and comfortable stay for your pets</Text>
        </View>

        <View
          style={[homeStyles.featureCard, { backgroundColor: '#e8eaff' }]}
        >
          <MaterialIcons name="trending-up" size={32} color="#6366f1" />
          <Text style={[homeStyles.featureTitle, { color: '#6366f1' }]}>Progress Tracking</Text>
          <Text style={homeStyles.featureDescription}>Monitor your dog's training progress</Text>
        </View>

        <View
          style={[homeStyles.featureCard, { backgroundColor: '#ffe6e6' }]}
        >
          <MaterialIcons name="medical-services" size={32} color="#FF3B30" />
          <Text style={[homeStyles.featureTitle, { color: '#FF3B30' }]}>Consultation</Text>
          <Text style={homeStyles.featureDescription}>Expert advice for your pet's needs</Text>
        </View>
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
      {isTrainer ? renderTrainerFeatureSection() : renderFeatureSection()}
      {isTrainer ? renderTrainerHighlightSection() : renderHighlightSection()}
      <View style={homeStyles.footer}>
        <Text style={homeStyles.footerText}>© 2025 Dog Training Management System</Text>
      </View>
    </ScrollView>
  );
}