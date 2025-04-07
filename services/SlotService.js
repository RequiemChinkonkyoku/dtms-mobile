import ApiManager from './ApiManager';

export const fetchTrainerSlots = async (trainerId) => {
    try {
        const response = await ApiManager.get(`/slots/get-trainer-slots/${trainerId}`);
        return response.data.objectList;
    } catch (error) {
        console.error('Error fetching trainer slots:', error);
        return [];
    }
};