import ApiManager from './ApiManager';

export const fetchCustomerProfile = async (accountId) => {
    try {
        const response = await ApiManager.get(`/customerProfile/${accountId}`);
        console.log('Customer account Details:', response.data);
        return response.data;
    } catch (error) {
        // console.error('Error fetching Account by ID:', error);
        return null;
    }
};

export const fetchTrainerProfile = async (accountId) => {
    try {
        const response = await ApiManager.get(`/trainerProfile/${accountId}`);
        console.log('Trainer account Details:', response.data);
        return response.data;
    } catch (error) {
        // console.error('Error fetching Account by ID:', error);
        return null;
    }
};