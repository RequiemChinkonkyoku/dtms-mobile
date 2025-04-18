import { View, Text, Image, Dimensions, ScrollView, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { fetchAllMemberships } from '../../services/MembershipService';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from './ProfileDetailStyles';

export default function ProfileDetailCard({ profileData, onRefreshProfile }) {
  const windowWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const [memberships, setMemberships] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { userInfo } = useAuth();
  const isTrainer = userInfo?.role?.includes('Trainer');

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'My Profile',
      headerShown: true
    });
    loadMemberships();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadMemberships(),
        onRefreshProfile(),
      ]);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefreshProfile]);

  const loadMemberships = async () => {
    const data = await fetchAllMemberships();
    setMemberships(data.sort((a, b) => a.requiredPoints - b.requiredPoints));
  };

  const getTierColor = (tierName) => {
    switch (tierName.toLowerCase()) {
      case 'basic': return '#CD7F32';
      case 'gold': return '#CFB53B';
      case 'platinum': return '#4682B4';
      default: return '#666';
    }
  };

  const getTierBackgroundColor = (tierName, isCurrentTier) => {
    if (!isCurrentTier) return '#f5f5f5';
    switch (tierName.toLowerCase()) {
      case 'basic': return '#FFF1E6';
      case 'gold': return '#FFF8E7';
      case 'platinum': return '#F0F8FF';
      default: return '#f5f5f5';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#007AFF"]}
          tintColor="#007AFF"
        />
      }
    >
      <View style={styles.coverSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              profileData.imageUrl
                ? { uri: profileData.imageUrl }
                : require("../../assets/images/placeholder.png")
            }
            style={styles.profileImage}
          />
        </View>
      </View>

      <View style={styles.basicInfoSection}>
        <Text style={styles.fullName}>{profileData.fullName}</Text>
        <View style={styles.emailContainer}>
          <MaterialCommunityIcons name="email-outline" size={20} color="#666" style={{ marginRight: 8 }} />
          <Text style={styles.emailText}>{profileData.email}</Text>
        </View>

        <View style={[
          styles.statusContainer,
          profileData.status === 1 ? styles.statusActive : styles.statusInactive
        ]}>
          <MaterialCommunityIcons
            name={profileData.status === 1 ? "check-circle-outline" : "close-circle-outline"}
            size={20}
            color={profileData.status === 1 ? "#2E7D32" : "#C62828"}
            style={{ marginRight: 5 }}
          />
          <Text style={[
            styles.statusText,
            profileData.status === 1 ? styles.statusTextActive : styles.statusTextInactive
          ]}>
            {profileData.status === 1 ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="card-account-details-outline" size={24} color="#007AFF" />
          <Text style={styles.sectionTitle}>Contact Information</Text>
        </View>

        <View style={styles.contactList}>
          <View style={styles.contactItem}>
            <MaterialCommunityIcons name="phone-outline" size={24} color="#007AFF" style={styles.contactItemIcon} />
            <View>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{profileData.phoneNumber}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <MaterialCommunityIcons name="map-marker-outline" size={24} color="#007AFF" style={styles.contactItemIcon} />
            <View style={styles.contactItemContent}>
              <Text style={styles.contactLabel}>Address</Text>
              <Text style={styles.contactValue}>{profileData.address}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <MaterialCommunityIcons name="calendar" size={24} color="#007AFF" style={styles.contactItemIcon} />
            <View>
              <Text style={styles.contactLabel}>Date of Birth</Text>
              <Text style={styles.contactValue}>
                {new Date(profileData.dateOfBirth).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <MaterialCommunityIcons name="gender-male-female" size={24} color="#007AFF" style={styles.contactItemIcon} />
            <View>
              <Text style={styles.contactLabel}>Gender</Text>
              <Text style={styles.contactValue}>{profileData.gender === 1 ? "Male" : "Female"}</Text>
            </View>
          </View>
        </View>
      </View>

      {!isTrainer && (
        <View style={styles.cardContainer}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="star-circle-outline" size={24} color="#007AFF" />
            <Text style={styles.sectionTitle}>Membership Status</Text>
          </View>

          <View style={styles.pointsSection}>
            <Text style={styles.contactLabel}>Your Current Points</Text>
            <View style={styles.pointsRow}>
              <MaterialCommunityIcons name="star" size={32} color="#007AFF" />
              <Text style={styles.pointsValue}>{profileData.membershipPoints}</Text>
            </View>
          </View>

          <View style={styles.tierSection}>
            <Text style={styles.tierHeader}>Membership Tiers</Text>
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
                <View key={tier.id} style={[
                  styles.tierCard,
                  {
                    backgroundColor,
                    borderWidth: isCurrentTier ? 1 : 0,
                    borderColor: tierColor,
                  }
                ]}>
                  <View style={styles.tierCardHeader}>
                    <View style={styles.tierInfo}>
                      <MaterialCommunityIcons
                        name={isCurrentTier ? "crown" : "crown-outline"}
                        size={24}
                        color={tierColor}
                      />
                      <View>
                        <Text style={[styles.tierName, { color: tierColor }]}>{tier.name}</Text>
                        {isCurrentTier && (
                          <Text style={[styles.tierLabel, { color: tierColor }]}>Current Tier</Text>
                        )}
                      </View>
                    </View>
                    <Text style={[styles.tierDiscount, { color: tierColor }]}>{tier.discountAmount}% OFF</Text>
                  </View>

                  <Text style={styles.tierDescription}>{tier.description}</Text>

                  <View style={styles.progressBar}>
                    <View style={[
                      styles.progressFill,
                      {
                        width: `${progress}%`,
                        backgroundColor: tierColor,
                      }
                    ]} />
                  </View>

                  <View style={styles.tierPoints}>
                    <Text style={styles.pointsText}>{tier.requiredPoints} points required</Text>
                    {index < memberships.length - 1 && (
                      <Text style={styles.pointsText}>Next: {memberships[index + 1].requiredPoints} points</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.benefitsInfo}>
            <Text style={styles.benefitsText}>
              Earn points with every purchase and unlock exclusive benefits!
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}