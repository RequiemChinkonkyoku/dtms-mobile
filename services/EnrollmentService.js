import ApiManager from './ApiManager';

export const fetchDogFirstEnroll = async (dogId, courseId) => {
    try {
        const response = await ApiManager.get(`/enrollments/${dogId}/first-enroll/${courseId}`);
        console.log('Dog Course Completion Status:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error checking course completion:', error);
        return false;
    }
};