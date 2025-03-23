import ApiManager from './ApiManager';

// export const fetchClassesByCourseId = async (courseId) => {
//     try {
//         const response = await axios.get(`/class?courseId=${courseId}`);
//         return response.data.objectList;
//     } catch (error) {
//         console.error('Error fetching classes:', error);
//         return [];
//     }
// };

export const fetchClassesByCourseId = async (courseId) => {
    try {
        const response = await ApiManager.get('/class');
        return response.data.objectList.filter(classItem => classItem.courseId === courseId);
    } catch (error) {
        console.error('Error fetching classes:', error);
        return [];
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