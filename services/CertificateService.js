import ApiManager from './ApiManager';

export const fetchDogCertificates = async (dogId) => {
    try {
        const response = await ApiManager.get(`/certificates/by-dog/${dogId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dog certificates:', error);
        return [];
    }
};