import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchBlogs } from '../../services/BlogService';
import BlogCard from './BlogCard';

export default function BlogList() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        const blogData = await fetchBlogs();
        if (blogData) {
            setBlogs(blogData);
        }
    };

    return (
        <View>
            <View style={{
                padding: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
            }}>
                <Text style={{
                    paddingLeft: 5,
                    fontSize: 20,
                    fontWeight: 'bold',
                }}>
                    Latest Blogs
                </Text>
                <Text style={{
                    color: '#007AFF',
                    fontWeight: '500',
                }}>
                    View All
                </Text>
            </View>

            <FlatList
                data={blogs}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <BlogCard blog={item} />}
            />
        </View>
    );
}
