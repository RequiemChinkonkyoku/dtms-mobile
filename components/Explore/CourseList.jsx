import { View, FlatList, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import CourseCard from './CourseCard';
import { fetchCourses, fetchCoursesByCategoryId } from '../../services/CourseService';
import { fetchCategories } from '../../services/CategoriesService';
import { styles } from '../../styles/CourseListStyles';

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
        <View style={styles.container}>
            {/* Categories Section */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
            >
                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        !selectedCategory ? styles.categoryButtonActive : styles.categoryButtonInactive
                    ]}
                    onPress={() => {
                        setSelectedCategory(null);
                        loadCourses();
                    }}
                >
                    <Text style={[
                        styles.categoryText,
                        !selectedCategory ? styles.categoryTextActive : styles.categoryTextInactive
                    ]}>
                        All
                    </Text>
                </TouchableOpacity>
                
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryButton,
                            selectedCategory === category.id ? styles.categoryButtonActive : styles.categoryButtonInactive
                        ]}
                        onPress={() => handleCategoryPress(category.id)}
                    >
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === category.id ? styles.categoryTextActive : styles.categoryTextInactive
                        ]}>
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>
                Courses
            </Text>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : 
            filteredCourses.length > 0 ? (
                <FlatList
                    style={styles.courseList}
                    data={filteredCourses}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (<CourseCard course={item} />)}
                    contentContainerStyle={styles.courseListContent}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={<View style={styles.listFooter} />}
                    onRefresh={() => loadCourses(selectedCategory)}
                    refreshing={loading}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        {searchQuery ? 'No matching courses found' : 'No courses available'}
                    </Text>
                </View>
            )}
        </View>
    );
}