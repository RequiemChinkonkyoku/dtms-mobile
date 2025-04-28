import ApiManager from './ApiManager';

export const markAttendance = async (attendanceData) => {
    try {
        const response = await ApiManager.post('/attendances', attendanceData);
        return response.data;
    } catch (error) {
        console.error('Error marking attendance:', error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to mark attendance'
        };
    }
};

export const getSlotAttendance = async (slotId) => {
    try {
        const response = await ApiManager.get('/attendances');
        const slotAttendances = response.data.filter(
            attendance => attendance.slotId === slotId
        );
        return {
            success: true,
            message: "Successfully retrieved slot attendance",
            object: slotAttendances
        };
    } catch (error) {
        console.error('Error fetching slot attendance:', error);
        throw error;
    }
};

export const getClassAttendance = async (classId) => {
    try {
        const response = await ApiManager.get('/attendances');
        const classAttendances = response.data.filter(
            attendance => attendance.classId === classId
        );
        return classAttendances;
    } catch (error) {
        console.error('Error fetching class attendance:', error);
        throw error;
    }
};

export const checkoutAttendance = async (attendanceId) => {
    try {
        const response = await ApiManager.put(`/attendances/checkout/${attendanceId}`);
        return response.data;
    } catch (error) {
        console.error('Error checking out attendance:', error);
        throw error;
    }
};