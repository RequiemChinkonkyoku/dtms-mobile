import { View, Text } from 'react-native';
import React from 'react';
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from '../../styles/CertificateCardStyles';

export default function CertificateCard({ certificate }) {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <MaterialIcons name="verified" size={28} color="#4CAF50" />
                <Text style={styles.title}>
                    {certificate.name}
                </Text>
            </View>

            <Text style={styles.description}>
                Description: {certificate.description}
            </Text>

            <View style={styles.courseContainer}>
                <Text style={styles.courseName}>
                    Course: {certificate.courseName}
                </Text>
                <Text style={styles.courseDescription}>
                    Description: {certificate.courseDescription}
                </Text>
            </View>

            <View style={styles.statusContainer}>
                <View style={[
                    styles.statusBadge,
                    certificate.status === 1 ? styles.statusBadgeActive : styles.statusBadgeInactive
                ]}>
                    <MaterialIcons 
                        name={certificate.status === 1 ? "check-circle" : "cancel"} 
                        size={16} 
                        color={certificate.status === 1 ? "#2e7d32" : "#d32f2f"} 
                    />
                    <Text style={[
                        styles.statusText,
                        certificate.status === 1 ? styles.statusTextActive : styles.statusTextInactive
                    ]}>
                        {certificate.status === 1 ? 'Active' : 'Inactive'}
                    </Text>
                </View>
            </View>
        </View>
    );
}