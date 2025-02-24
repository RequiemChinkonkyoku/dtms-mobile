import { View, FlatList, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import CourseCard from './CourseCard';
import { fetchCourses, fetchCoursesByCategoryId } from '../../services/CourseService';
import { fetchCategories } from '../../services/CategoriesService';

export default function CourseList({ searchQuery }) {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategories();
        loadCourses();
    }, []);

    const loadCategories = async () => {
        const data = await fetchCategories();
        if (data) {
            setCategories(data);
        }
    };

    const loadCourses = async (categoryId = null) => {
        setLoading(true);
        let data;
        if (categoryId) {
            data = await fetchCoursesByCategoryId(categoryId);
        } else {
            data = await fetchCourses();
        }
        if (data) {
            setCourses(data);
        }
        setLoading(false);
    };

    const handleCategoryPress = (categoryId) => {
        setSelectedCategory(categoryId);
        loadCourses(categoryId);
    };

    const filteredCourses = useMemo(() => {
        if (!searchQuery) return courses;
        return courses.filter(course => 
            course.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [courses, searchQuery]);

    return (
        <View style={{
            flex: 0,
            backgroundColor: '#f5f5f5',
            borderRadius: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            margin: 10,
            padding: 15,
        }}>
            {/* Categories Section */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 20 }}
            >
                <TouchableOpacity
                    style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor: !selectedCategory ? '#007AFF' : '#E8E8E8',
                        marginRight: 10,
                    }}
                    onPress={() => {
                        setSelectedCategory(null);
                        loadCourses();
                    }}
                >
                    <Text style={{
                        color: !selectedCategory ? '#FFF' : '#333',
                        fontWeight: '600',
                    }}>
                        All
                    </Text>
                </TouchableOpacity>
                
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 20,
                            backgroundColor: selectedCategory === category.id ? '#007AFF' : '#E8E8E8',
                            marginRight: 10,
                        }}
                        onPress={() => handleCategoryPress(category.id)}
                    >
                        <Text style={{
                            color: selectedCategory === category.id ? '#FFF' : '#333',
                            fontWeight: '600',
                        }}>
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={{
                fontSize: 26,
                fontWeight: 'bold',
                marginBottom: 15,
                color: '#333',
                paddingHorizontal: 5,
                borderLeftWidth: 4,
                borderLeftColor: '#007AFF',
                paddingLeft: 10,
            }}>
                Courses
            </Text>

            {loading ? (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : 
            filteredCourses.length > 0 ? (
                <FlatList
                    style={{
                        paddingHorizontal: 5,
                    }}
                    data={filteredCourses}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (<CourseCard course={item} />)}
                    contentContainerStyle={{
                        paddingBottom: 20,
                        gap: 15,
                    }}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={<View style={{ height: 425 }} />}
                    onRefresh={() => loadCourses(selectedCategory)}
                    refreshing={loading}
                />
            ) : (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 30,
                }}>
                    <Text style={{
                        textAlign: 'center',
                        fontSize: 16,
                        color: '#666',
                        lineHeight: 24,
                    }}>
                        {searchQuery ? 'No matching courses found' : 'No courses available'}
                    </Text>
                </View>
            )}
        </View>
    );
}