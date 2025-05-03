import { View, Text, Image, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { fetchLegalDocumentById } from "../../services/LegalDocumentService";
import { legalDocumentDetailStyles as styles } from "../../styles/LegalDocumentDetailStyles";

export default function LegalDocumentDetail() {
    const { id } = useLocalSearchParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Document Details",
            headerShown: true,
        });
        loadDocument();
    }, [id]);

    const loadDocument = async () => {
        try {
            const response = await fetchLegalDocumentById(id);
            if (response.success) {
                setDocument(response.object);
            }
        } catch (error) {
            console.error("Error loading document:", error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadDocument();
        setRefreshing(false);
    }, []);

    const getStatusInfo = (status) => {
        switch (status) {
            case 0:
                return {
                    backgroundColor: "#fff3e0",
                    textColor: "#f57c00",
                    text: "Pending",
                    icon: "pending",
                };
            case 1:
                return {
                    backgroundColor: "#e8f5e9",
                    textColor: "#2e7d32",
                    text: "Approved",
                    icon: "check-circle",
                };
            case 2:
                return {
                    backgroundColor: "#ffebee",
                    textColor: "#d32f2f",
                    text: "Rejected",
                    icon: "cancel",
                };
            default:
                return {
                    backgroundColor: "#f5f5f5",
                    textColor: "#666666",
                    text: "Unknown",
                    icon: "help",
                };
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!document) {
        return (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={48} color="#666" />
                <Text style={styles.errorText}>Document not found</Text>
            </View>
        );
    }

    const statusInfo = getStatusInfo(document.status);

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
            <View style={styles.content}>
                <View style={styles.header}>
                    <MaterialIcons name="description" size={32} color="#007AFF" />
                    <Text style={styles.title}>{document.name}</Text>
                </View>

                {document.imageUrl && (
                    <Image
                        source={{ uri: document.imageUrl }}
                        style={styles.documentImage}
                        resizeMode="contain"
                    />
                )}

                <View style={styles.infoSection}>
                    <View
                        style={[
                            styles.statusContainer,
                            { backgroundColor: statusInfo.backgroundColor },
                        ]}
                    >
                        <MaterialIcons
                            name={statusInfo.icon}
                            size={24}
                            color={statusInfo.textColor}
                        />
                        <Text style={[styles.statusText, { color: statusInfo.textColor }]}>
                            {statusInfo.text}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <MaterialIcons name="description" size={20} color="#666" />
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Description</Text>
                            <Text style={styles.detailText}>
                                {document.description || "No description provided"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <MaterialIcons name="access-time" size={20} color="#666" />
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Upload Time</Text>
                            <Text style={styles.detailText}>
                                {new Date(document.uploadTime).toLocaleDateString("vi-VN")}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <MaterialIcons name="update" size={20} color="#666" />
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Last Updated</Text>
                            <Text style={styles.detailText}>
                                {new Date(document.lastUpdatedTime).toLocaleDateString("vi-VN")}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}