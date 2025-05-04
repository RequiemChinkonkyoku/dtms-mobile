import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { fetchCourseById } from '../../services/CourseService';
import { MaterialIcons } from '@expo/vector-icons';
import { courseDetailsStyles } from '../../styles/CourseDetailStyles';
import { fetchLessonById } from '../../services/LessonService';
import { fetchSkillById } from '../../services/SkillService';
import { LinearGradient } from 'expo-linear-gradient';
import EnrollmentModal from '../../components/CourseDetail/EnrollmentModal';
import { fetchAccountById } from '../../services/AccountService';
import { addToWishlist, fetchWishlist } from '../../services/WishlistService';
import { useAuth } from '../../contexts/AuthContext';

export default function CourseDetail() {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [dogBreeds, setDogBreeds] = useState([]);
    const [trainerName, setTrainerName] = useState('Unknown');
    const [isEnrollmentModalVisible, setIsEnrollmentModalVisible] = useState(false);
    const [lessonSkills, setLessonSkills] = useState({});
    const [isInWishlist, setIsInWishlist] = useState(false);
    const router = useRouter();
    const { userInfo } = useAuth();

    const checkWishlistStatus = async () => {
        try {
            const response = await fetchWishlist(userInfo.unique_name);
            if (response.success && response.data) {
                const isWishlisted = response.data.some(item => item.courseId === id);
                setIsInWishlist(isWishlisted);
            }
        } catch (error) {
            console.error('Error checking wishlist status:', error);
        }
    };

    useEffect(() => {
        loadCourseDetail();
        checkWishlistStatus();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Course Detail',
            headerShown: true
        });
    }, []);

    const loadCourseDetail = async () => {
        const courseData = await fetchCourseById(id);
        if (courseData) {
            setCourse(courseData);
            // Load trainer name
            if (courseData.createdTrainerId) {
                const trainerData = await fetchAccountById(courseData.createdTrainerId);
                if (trainerData) {
                    setTrainerName(trainerData.fullName);
                }
            }

            // Fetch lessons
            if (courseData.courseLessons && courseData.courseLessons.length > 0) {
                const lessonPromises = courseData.courseLessons.map(lessonId =>
                    fetchLessonById(lessonId.id)
                );
                const lessonResults = await Promise.all(lessonPromises);
                // Filter out null responses and map to the correct structure
                const validLessons = lessonResults
                    .filter(result => result && result)
                    .map(result => result);
                setLessons(validLessons);

                // Fetch skills for each lesson
                const skillsMap = {};
                for (const lesson of validLessons) {
                    if (lesson.skillId) {
                        const skillData = await fetchSkillById(lesson.skillId);
                        if (skillData) {
                            skillsMap[lesson.id] = skillData;
                        }
                    }
                }
                setLessonSkills(skillsMap);
            }

            if (courseData.courseDogBreeds) {
                setDogBreeds(courseData.courseDogBreeds);
            }
        }
    };

    if (!course) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const handlePrerequisitePress = (prerequisiteId) => {
        router.push(`/courseDetail/${prerequisiteId}`);
    };

    const handleAddToWishlist = async (customerAccountId, courseId) => {
        try {
            const wishlistData = {
                customerAccountId,
                courseId
            };
            const response = await addToWishlist(wishlistData);
            
            if (response.success) {
                Alert.alert(
                    'Success',
                    'Course added to wishlist successfully!'
                );
                await checkWishlistStatus();
            } else {
                Alert.alert(
                    'Error',
                    response.error || 'Failed to add course to wishlist'
                );
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            Alert.alert(
                'Error',
                'Something went wrong while adding to wishlist'
            );
        }
    };

    return (
        <>
            <ScrollView style={courseDetailsStyles.container}>
                <Image
                    source={typeof course.imageUrl === 'string'
                        ? { uri: course.imageUrl }
                        : require('./../../assets/images/dog.png')}
                    style={courseDetailsStyles.image}
                />

                {/* Course Header */}
                <View style={courseDetailsStyles.headerContainer}>
                    <View style={courseDetailsStyles.headerRow}>
                        <Text style={courseDetailsStyles.title}>{course.name}</Text>
                        <TouchableOpacity
                            style={courseDetailsStyles.wishlistButton}
                            onPress={() => handleAddToWishlist(userInfo.unique_name, id)}
                        >
                            <MaterialIcons name={isInWishlist ? "favorite" : "favorite-border"} size={24} color={isInWishlist ? "#FF3B30" : "#666"} />
                        </TouchableOpacity>
                    </View>
                    <Text style={courseDetailsStyles.trainer}>
                        Created by {trainerName}
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

                {/* Prerequisites Section */}
                {course.coursePrerequisites && course.coursePrerequisites.length > 0 && (
                    <View style={courseDetailsStyles.prerequisitesContainer}>
                        <View style={courseDetailsStyles.prerequisitesHeader}>
                            <MaterialIcons name="school" size={24} color="#007AFF" />
                            <Text style={courseDetailsStyles.prerequisitesTitle}>Prerequisites</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {course.coursePrerequisites.map(prerequisite => (
                                <TouchableOpacity
                                    key={prerequisite.id}
                                    style={courseDetailsStyles.prerequisiteCard}
                                    onPress={() => handlePrerequisitePress(prerequisite.id)}
                                    activeOpacity={0.7}
                                >
                                    <MaterialIcons name="stars" size={20} color="#007AFF" />
                                    <Text style={courseDetailsStyles.prerequisiteName}>
                                        {prerequisite.name}
                                    </Text>
                                    <MaterialIcons name="chevron-right" size={20} color="#007AFF" style={{ marginLeft: 8 }} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Eligible Dog Breeds */}
                <View style={courseDetailsStyles.breedContainer}>
                    <Text style={courseDetailsStyles.breedTitle}>Suitable for</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={courseDetailsStyles.breedScroll}>
                        {dogBreeds.map(breed => (
                            <View key={breed.id} style={courseDetailsStyles.breedTag}>
                                <MaterialIcons name="pets" size={16} color="#007AFF" />
                                <Text style={courseDetailsStyles.breedName}>{breed.name}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Price Section */}
                <View style={courseDetailsStyles.priceContainer}>
                    <Text style={courseDetailsStyles.priceLabel}>Course Price</Text>
                    <Text style={courseDetailsStyles.price}>{course.price.toLocaleString()}VNĐ</Text>
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

                {/* Lessons Section */}
                <View style={courseDetailsStyles.section}>
                    <Text style={courseDetailsStyles.sectionTitle}>Course Lessons</Text>
                    {lessons && lessons.length > 0 ? (
                        lessons.map((lesson, index) => (
                            <View key={lesson.id} style={courseDetailsStyles.lessonContainer}>
                                <MaterialIcons name="class" size={24} color="#007AFF" />
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={courseDetailsStyles.lessonTitle}>
                                        {index + 1}. {lesson.lessonTitle}
                                    </Text>
                                    <Text style={courseDetailsStyles.lessonDescription}>
                                        Description: {lesson.description}
                                    </Text>
                                    {lessonSkills[lesson.id] && (
                                        <View style={courseDetailsStyles.skillContainer}>
                                            <MaterialIcons name="stars" size={16} color="#FFD700" />
                                            <Text style={courseDetailsStyles.skillText}>
                                                Skill: {lessonSkills[lesson.id].name}
                                            </Text>
                                        </View>
                                    )}
                                    <View style={courseDetailsStyles.lessonDetails}>
                                        <Text style={courseDetailsStyles.lessonInfo}>
                                            <MaterialIcons name="schedule" size={16} color="#666" /> {lesson.duration} minutes
                                        </Text>
                                        <Text style={courseDetailsStyles.lessonInfo}>
                                            <MaterialIcons name="room" size={16} color="#666" /> {lesson.environment}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={courseDetailsStyles.description}>No lessons available</Text>
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={courseDetailsStyles.enrollButtonContainer}>
                <LinearGradient
                    colors={['#007AFF', '#00A2FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={courseDetailsStyles.gradientContainer}
                >
                    <TouchableOpacity
                        style={courseDetailsStyles.enrollButton}
                        onPress={() => {
                            console.log('Enroll pressed for course:', id);
                            setIsEnrollmentModalVisible(true);
                        }}
                    >
                        <View>
                            <Text style={courseDetailsStyles.enrollButtonText}>Enroll Now</Text>
                            <Text style={courseDetailsStyles.enrollSubText}>Start Your Dog's Journey Today</Text>
                        </View>
                        <Text style={courseDetailsStyles.enrollPrice}>
                            {course.price.toLocaleString()}
                            <Text style={courseDetailsStyles.currencyText}> VNĐ</Text>
                        </Text>
                    </TouchableOpacity>
                    <EnrollmentModal
                        visible={isEnrollmentModalVisible}
                        onClose={() => setIsEnrollmentModalVisible(false)}
                        courseId={id}
                        maxDogs={course.maxDogs}
                        coursePrice={course.price}
                    />
                </LinearGradient>
            </View>
        </>
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
