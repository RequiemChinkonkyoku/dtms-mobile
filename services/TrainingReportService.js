import ApiManager from './ApiManager';

export const createTrainingReport = async (reportData) => {
    try {
        const response = await ApiManager.post('/trainingReport/create-training-report', reportData);
        return response.data;
    } catch (error) {
        console.error('Error submitting training report:', error);
        throw error;
    }
};

export const updateTrainingReport = async (reportId, reportData) => {
    try {
        const response = await ApiManager.put(`/trainingReport/update-training-report/${reportId}`, reportData);
        return response.data;
    } catch (error) {
        console.error('Error updating training report:', error);
        throw error;
    }
};

export const fetchAllTrainingReports = async () => {
    try {
        const response = await ApiManager.get('/trainingReport/get-all-training-reports');
        return response.data.objectList || [];
    } catch (error) {
        console.error('Error fetching training reports:', error);
        return [];
    }
};

export const fetchTrainingReportsByEnrollmentId = async (enrollmentId) => {
    try {
        const response = await ApiManager.get('/trainingReport/get-all-training-reports');
        const reports = response.data.objectList || [];
        const enrollmentReports = reports.filter(
            report => report.enrollmentId === enrollmentId
        );
        return {
            success: true,
            message: "Successfully retrieved enrollment training reports",
            object: null,
            objectList: enrollmentReports
        };
    } catch (error) {
        console.error('Error fetching enrollment training reports:', error);
        return {
            success: false,
            message: "Error fetching enrollment training reports",
            object: null,
            objectList: []
        };
    }
};