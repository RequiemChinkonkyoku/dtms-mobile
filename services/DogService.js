import ApiManager from './ApiManager';

export const fetchDogs = async () => {
  try {
    const response = await ApiManager.get('/dogs');
    console.log('Dogs:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching dogs:', error);
    return null;
  }
};

export const fetchDogById = async (id) => {
  try {
    const response = await ApiManager.get(`/dogs/${id}`);
    console.log('Dog Details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching dog by ID:', error);
    return null;
  }
};

export const AddNewDog = async (dogData) => {
  try {
    const response = await ApiManager.post('/dogs', dogData, {});
    console.log('Dog Added:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding dog:', error.response?.data || error.message);
    return null;
  }
};