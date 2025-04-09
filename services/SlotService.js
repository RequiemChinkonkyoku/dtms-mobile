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

export const checkinSlot = async (slotId) => {
    try {
        const response = await ApiManager.put(`/slots/checkin-slot/${slotId}`);
        return response.data;
    } catch (error) {
        console.error('Error checking in slot:', error);
        throw error;
    }
};