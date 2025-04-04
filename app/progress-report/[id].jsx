import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { fetchProgressReportById } from "../../services/ProgressReportService";
import { MaterialIcons } from "@expo/vector-icons";
import { progressReportStyles as styles } from "../../styles/ProgressReportStyles";

export default function ProgressReportDetail() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Progress Report",
      headerShown: true,
    });
  }, []);

  useEffect(() => {
    loadProgressReport();
  }, [id]);

  const loadProgressReport = async () => {
    try {
      const data = await fetchProgressReportById(id);
      setReport(data);
    } catch (err) {
      setError("Failed to load progress report");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="error-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress Report Details</Text>
        <Text style={styles.date}>
          {new Date(report.attendanceDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.trainerInfo}>
          <MaterialIcons name="person" size={24} color="#007AFF" />
          <Text style={styles.trainerName}>{report.trainerName}</Text>
        </View>

        {report.dogName && (
          <View style={styles.dogInfo}>
            <MaterialIcons name="pets" size={24} color="#007AFF" />
            <Text style={styles.dogName}>{report.dogName}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feedback</Text>
        <Text style={styles.sectionContent}>{report.feedback}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Observations</Text>

        <View style={styles.observationItem}>
          <Text style={styles.observationTitle}>Health</Text>
          <Text style={styles.observationContent}>
            {report.healthObservation}
          </Text>
        </View>

        <View style={styles.observationItem}>
          <Text style={styles.observationTitle}>Behavior</Text>
          <Text style={styles.observationContent}>
            {report.behaviorObservation}
          </Text>
        </View>

        <View style={styles.observationItem}>
          <Text style={styles.observationTitle}>Performance</Text>
          <Text style={styles.observationContent}>
            {report.performanceObservation}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
