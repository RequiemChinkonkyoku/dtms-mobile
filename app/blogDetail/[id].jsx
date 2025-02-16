import { View, Text, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { fetchBlogs } from '../../services/BlogService';

export default function BlogDetail() {
    const { id } = useLocalSearchParams();
    const [blog, setBlog] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        loadBlogDetail();
    }, []);

    useEffect(() => {
          navigation.setOptions({
            headerTitle: 'Blog',
            headerShown: true
          });
      }, []);
    

    const loadBlogDetail = async () => {
        const blogs = await fetchBlogs();
        if (blogs) {
            const selectedBlog = blogs.find(item => item.id === id);
            setBlog(selectedBlog);
        }
    };

    if (!blog) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
            <Image 
                source={{ uri: blog.imageUrl }}
                style={{
                    width: '100%',
                    height: 250,
                    borderRadius: 10,
                }}
            />
            <Text style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                marginTop: 15 
            }}>
                {blog.title}
            </Text>
            <Text style={{ 
                fontSize: 14, 
                color: 'gray', 
                marginTop: 5 
            }}>
                Published on {new Date(blog.timePublished).toLocaleDateString()}
            </Text>
            <Text style={{ 
                fontSize: 16, 
                marginTop: 15, 
                lineHeight: 24 
            }}>
                {blog.content}
            </Text>
        </ScrollView>
    );
}
