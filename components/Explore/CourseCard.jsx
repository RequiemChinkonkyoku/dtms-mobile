import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { fetchAccountById } from '../../services/AccountService';

export default function CourseCard({ course }) {
    const router = useRouter();
    const [trainerName, setTrainerName] = useState('Loading...');

    useEffect(() => {
        loadTrainerName();
    }, [course]);

    const loadTrainerName = async () => {
        if (course.createdTrainerId) {
            const trainerData = await fetchAccountById(course.createdTrainerId);
            if (trainerData) {
                setTrainerName(trainerData.fullName);
            } else {
                setTrainerName('Unknown Trainer');
            }
        }
    };

    return (
        <TouchableOpacity
            onPress={() => router.push(`/courseDetail/${course.id}`)}
            style={{
                backgroundColor: '#fff',
                padding: 10,
                borderRadius: 8,
                marginBottom: 10,
                borderWidth: 1,
            }}>
            <Image
                source={typeof course.imageUrl === 'string' ? { uri: course.imageUrl } : require('./../../assets/images/dog.png')}
                style={{
                    height: 150,
                    borderRadius: 8,
                    width: '100%',
                    resizeMode: 'stretch',
                }}
            />
            <Text style={{ fontFamily: 'outfit-bold', fontSize: 18, marginTop: 5 }}>{course.name || 'N/A'}</Text>
            <Text style={{ fontFamily: 'outfit', fontSize: 14, color: 'gray' }}>{trainerName}</Text>
        </TouchableOpacity>
    );
}