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

export const fetchPretestsByClass = async (classId) => {
    try {
        const response = await ApiManager.get('/pretest');
        const pretests = response.data.objectList || [];
        const classPretests = pretests.filter(
            pretest => pretest.classId === classId
        );
        return {
            success: true,
            message: "Successfully retrieved class pretests",
            object: null,
            objectList: classPretests
        };
    } catch (error) {
        console.error('Error fetching class pretests:', error);
        return {
            success: false,
            message: "Error fetching class pretests",
            object: null,
            objectList: []
        };
    }
};

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

export const updatePretestStatus = async (pretestId, status, note) => {
    try {
        const response = await ApiManager.put(`/pretest/update-pretest-status/${pretestId}`, {
            status: status,
            note: note
        });
        return response.data;
    } catch (error) {
        console.error('Error updating pretest status:', error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to update pretest status'
        };
    }
};