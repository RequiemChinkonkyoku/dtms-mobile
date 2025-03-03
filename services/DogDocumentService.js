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

export const addDogDocument = async (documentData) => {
    try {
        const response = await ApiManager.post('/dogDocuments', documentData);
        return response.data;
    } catch (error) {
        console.error('Error adding dog document:', error);
        throw error;
    }
};
// Add this function to your existing DogDocumentService.js
export const getDogDocumentById = async (id) => {
    try {
        console.log(`Fetching document with ID: ${id}`);
        const response = await ApiManager.get(`/dogDocuments/${id}`);
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching dog document:', error);
        throw error;
    }
};