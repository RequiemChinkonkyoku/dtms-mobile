import ApiManager from './ApiManager';

export const getDogDocuments = async (dogId) => {
    try {
        const response = await ApiManager.get(`/dogDocuments/dog/${dogId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dog documents:', error);
        throw error;
    }
};