import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons } from "@expo/vector-icons";

export default function CertificateCard({ certificate }) {
    return (
        <View style={{
            backgroundColor: '#fff',
            borderRadius: 15,
            padding: 15,
            marginBottom: 15,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <MaterialIcons name="verified" size={24} color="#4CAF50" />
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginLeft: 10,
                    color: '#333'
                }}>
                    {certificate.name}
                </Text>
            </View>

            <Text style={{
                fontSize: 14,
                color: '#666',
                marginBottom: 10
            }}>
                {certificate.description}
            </Text>

            <View style={{
                backgroundColor: '#f5f5f5',
                padding: 10,
                borderRadius: 8
            }}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: '#1976d2',
                    marginBottom: 5
                }}>
                    Course: {certificate.courseName}
                </Text>
                <Text style={{
                    fontSize: 14,
                    color: '#666'
                }}>
                    {certificate.courseDescription}
                </Text>
            </View>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10
            }}>
                <View style={{
                    backgroundColor: certificate.status === 1 ? '#e8f5e9' : '#ffebee',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 12
                }}>
                    <Text style={{
                        color: certificate.status === 1 ? '#2e7d32' : '#d32f2f',
                        fontSize: 12,
                        fontWeight: '500'
                    }}>
                        {certificate.status === 1 ? 'Active' : 'Inactive'}
                    </Text>
                </View>
            </View>
        </View>
    );
}