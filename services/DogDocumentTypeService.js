import ApiManager from './ApiManager';

export const fetchDogDocumentTypes = async () => {
    try {
        const response = await ApiManager.get('/dogDocumentTypes');
        return response.data;
    } catch (error) {
        console.error('Error fetching dog document types:', error);
        throw error;
    }
};