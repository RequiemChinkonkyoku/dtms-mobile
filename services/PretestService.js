import ApiManager from './ApiManager';

// export const fetchClassPretests = async (classId) => {
//     try {
//         const response = await ApiManager.get(`/pretest/get-class-pretests/${classId}`);
//         return response.data.success ? response.data.objectList : [];
//     } catch (error) {
//         console.error('Error fetching pretests:', error);
//         return [];
//     }
// };

export const fetchClassPretests = async (classId, dogId) => {
    try {
        const response = await ApiManager.post('/pretest/get-class-pretests', {
            classId: classId,
            dogId: dogId
        });
        return response.data.success ? response.data.objectList : [];
    } catch (error) {
        console.error('Error fetching pretests:', error);
        return [];
    }
};