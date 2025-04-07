import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

export default function BlogCard({ blog }) {
    const router = useRouter();

    return (
        <TouchableOpacity 
            onPress={() => router.push(`/blogDetail/${blog.id}`)}
            style={{
                marginLeft: 20,
                marginRight: 10,
                padding: 10,
                backgroundColor: '#fff',
                borderRadius: 15,
                width: 210,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
            }}>
            <Image 
                source={{ uri: blog.imageUrl }}
                style={{
                    height: 130,
                    borderRadius: 15
                }}
            />
            <View style={{ marginTop: 7, gap: 5 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
                    {blog.title}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
