import ApiManager from './ApiManager';

export const fetchTrainerSlots = async (trainerId) => {
    try {
        const response = await ApiManager.get(`/slots/get-trainer-slots/${trainerId}`);
        return response.data.objectList;
    } catch (error) {
        if (error.response?.status === 400) {
            return [];
        }

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
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to check in slot'
        };
    }
};

export const concludeSlot = async (slotId) => {
    try {
        const response = await ApiManager.put(`/slots/conclude-slot/${slotId}`);
        return response.data;
    } catch (error) {
        console.error('Error concluding slot:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to check in slot'
        };
    }
};