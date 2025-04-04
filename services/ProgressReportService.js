import ApiManager from './ApiManager';

export const fetchDogClassProgressReports = async (classId, dogId) => {
    try {
        const response = await ApiManager.get(`/progressReports/classes/${classId}/dogs/${dogId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching progress reports:', error.response?.data || error.message);
        throw error; 
    }
};

export const fetchProgressReportById = async (id) => {
  try {
    const response = await ApiManager.get(`/progressReports/${id}`);
    console.log('Progress Report Details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching progress report by ID:', error);
    return null;
  }
};