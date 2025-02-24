import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import CourseCard from './CourseCard';
import { fetchCourses } from '../../services/CourseService';

export default function CourseList({ searchQuery }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        setLoading(true);
        const data = await fetchCourses();
        if (data) {
            setCourses(data);
            console.log('Update Courses:', data);
        }
        setLoading(false);
    };

    const filteredCourses = useMemo(() => {
        if (!searchQuery) return courses;
        return courses.filter(course => 
            course.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [courses, searchQuery]);

    return (
        <View style={{ flex: 0, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Courses</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : 
            filteredCourses.length > 0 ? (
                <FlatList
                    style={{ padding: 10 }}
                    data={filteredCourses}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (<CourseCard course={item} />)}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListFooterComponent={<View style={{ height: 300 }} />}
                    onRefresh={loadCourses}
                    refreshing={loading}
                />
            ) : (
                <Text style={{ textAlign: 'center', fontSize: 16, color: 'gray' }}>
                    {searchQuery ? 'No matching courses found' : 'No courses available'}
                </Text>
            )}
        </View>
    );
}