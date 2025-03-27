import ApiManager from './ApiManager';

export const fetchClassesByCourseId = async (courseId) => {
    try {
        const response = await ApiManager.get(`/class/get-classes-by-course-id/${courseId}`);
        return response.data.objectList;
    } catch (error) {
        console.error('Error fetching classes:', error);
        return [];
    }
};

export const fetchClassById = async (classId) => {
    try {
        const response = await ApiManager.get(`/class/${classId}`);
        return response.data.object;
    } catch (error) {
        console.error('Error fetching class details:', error);
        return null;
    }
};

export const fetchClassSlots = async (classId) => {
    try {
        const response = await ApiManager.get(`/class/get-class-slots/${classId}`);
        return response.data.object.slots;
    } catch (error) {
        console.error('Error fetching class slots:', error);
        return [];
    }
};

export const enrollInClass = async (enrollmentData) => {
    try {
        const response = await ApiManager.post('/class/enroll-class', enrollmentData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('Error enrolling in class:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to enroll in class'
        };
    }
};

export const fetchDogEnrolledClasses = async (dogId) => {
    try {
        const response = await ApiManager.get(`/class/get-dog-enrolled-classes/${dogId}`);
        return response.data.objectList;
    } catch (error) {
        console.error('Error fetching enrolled classes:', error);
        return [];
    }
};