import ApiManager from './ApiManager';

export const fetchDogClassProgressReports = async (classId, dogId) => {
    try {
        const response = await ApiManager.get(`/progressReports/classes/${classId}/dogs/${dogId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching progress reports:', error.response?.data || error.message);
        throw error; 
    }
};