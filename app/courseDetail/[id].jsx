import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { fetchCourseById } from '../../services/CourseService';
import { MaterialIcons } from '@expo/vector-icons';
import { courseDetailsStyles } from '../../styles/CourseDetailStyles';

export default function CourseDetail() {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        loadCourseDetail();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Course Detail',
            headerShown: true
        });
    }, []);

    const loadCourseDetail = async () => {
        const course = await fetchCourseById(id);
        if (course) {
            setCourse(course);
            console.log(id)
        }
    };

    if (!course) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={courseDetailsStyles.container}>
            <Image
                source={typeof course.imageUrl === 'string' 
                    ? { uri: course.imageUrl } 
                    : require('./../../assets/images/dog.png')}
                style={courseDetailsStyles.image}
            />
            
            {/* Course Header */}
            <View style={courseDetailsStyles.headerContainer}>
                <Text style={courseDetailsStyles.title}>{course.name}</Text>
                <Text style={courseDetailsStyles.trainer}>
                    Created by {course.createdTrainerId || 'Unknown'}
                </Text>
            </View>

            {/* Course Stats */}
            <View style={courseDetailsStyles.statsContainer}>
                <InfoItem
                    icon="schedule"
                    label="Duration"
                    value={`${course.durationInWeeks} weeks`}
                />
                <InfoItem
                    icon="calendar-today"
                    label="Sessions"
                    value={`${course.daysPerWeek} days/week`}
                />
                <InfoItem
                    icon="groups"
                    label="Capacity"
                    value={`${course.minDogs}-${course.maxDogs} dogs`}
                />
            </View>

            {/* Price Section */}
            <View style={courseDetailsStyles.priceContainer}>
                <Text style={courseDetailsStyles.priceLabel}>Course Price</Text>
                <Text style={courseDetailsStyles.price}>${course.price}</Text>
            </View>

            {/* Description */}
            <View style={courseDetailsStyles.section}>
                <Text style={courseDetailsStyles.sectionTitle}>Description</Text>
                <Text style={courseDetailsStyles.description}>
                    {course.description || 'No description available'}
                </Text>
            </View>

            {/* Additional Details */}
            <View style={courseDetailsStyles.section}>
                <Text style={courseDetailsStyles.sectionTitle}>Course Details</Text>
                <View style={courseDetailsStyles.detailsGrid}>
                    <DetailItem label="Slots per Day" value={course.slotsPerDay} />
                    <DetailItem label="Trainers" value={`${course.minTrainers}-${course.maxTrainers}`} />
                    <DetailItem label="Complexity" value={`Level ${course.complexity}`} />
                    <DetailItem label="Status" value={course.status === 1 ? 'Active' : 'Inactive'} />
                </View>
            </View>
        </ScrollView>
    );
}

const InfoItem = ({ icon, label, value }) => (
    <View style={courseDetailsStyles.infoItem}>
        <MaterialIcons name={icon} size={24} color="#666" />
        <Text style={courseDetailsStyles.infoLabel}>{label}</Text>
        <Text style={courseDetailsStyles.infoValue}>{value}</Text>
    </View>
);

const DetailItem = ({ label, value }) => (
    <View style={courseDetailsStyles.detailItem}>
        <Text style={courseDetailsStyles.detailLabel}>{label}</Text>
        <Text style={courseDetailsStyles.detailValue}>{value}</Text>
    </View>
);
