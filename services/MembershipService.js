import ApiManager from './ApiManager';

export const fetchAllMemberships = async () => {
    try {
        const response = await ApiManager.get('/membership/get-all-memberships');
        return response.data.success ? response.data.objectList : [];
    } catch (error) {
        console.error('Error fetching memberships:', error);
        return [];
    }
};