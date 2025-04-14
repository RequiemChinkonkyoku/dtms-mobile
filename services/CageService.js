import ApiManager from './ApiManager';

export const fetchCages = async () => {
  try {
    const response = await ApiManager.get('/cages');
    return response.data.objectList;
  } catch (error) {
    console.error('Error fetching cages:', error);
    return null;
  }
};

export const fetchCageById = async (cageId) => {
  try {
    const response = await ApiManager.get(`/cages/${cageId}`);
    return response.data.object;
  } catch (error) {
    console.error('Error fetching cage:', error);
    return null;
  }
};