import ApiManager from './ApiManager';

export const fetchTrainingReportByDogId = async (dogId) => {
    try {
        const response = await ApiManager.get(`/trainingReport/get-training-reports-by-dog-id/${dogId}`);
        return response.data.object;
    } catch (error) {
        console.error('Error fetching class details:', error);
        return null;
    }
};

export const createTrainingReport = async (reportData) => {
    try {
        const response = await ApiManager.post('/trainingReport/create-training-report', reportData);
        return response.data;
    } catch (error) {
        console.error('Error submitting training report:', error);
        throw error;
    }
};