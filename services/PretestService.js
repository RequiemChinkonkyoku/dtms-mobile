import ApiManager from './ApiManager';

export const fetchClassPretests = async (classId) => {
    try {
        const response = await ApiManager.get(`/pretest/get-class-pretests/${classId}`);
        return response.data.success ? response.data.objectList : [];
    } catch (error) {
        console.error('Error fetching pretests:', error);
        return [];
    }
};