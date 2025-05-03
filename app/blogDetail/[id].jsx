import { View, Text, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { fetchBlogs } from '../../services/BlogService';
import { styles } from '../../styles/BlogDetailStyles';

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
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image 
                source={{ uri: blog.imageUrl }}
                style={styles.blogImage}
            />
            <Text style={styles.title}>
                {blog.title}
            </Text>
            <Text style={styles.publishDate}>
                Published on {new Date(blog.timePublished).toLocaleDateString()}
            </Text>
            <Text style={styles.content}>
                {blog.content}
            </Text>
        </ScrollView>
    );
}