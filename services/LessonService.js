import ApiManager from './ApiManager';

export const fetchLessonById = async (id) => {
    try {
        const response = await ApiManager.get(`/lessons/${id}`);
        console.log('Lesson Details:', response.data);
        return response.data.object;
    } catch (error) {
        console.error('Error fetching lesson by ID:', error);
        return null;
    }
};