import ApiManager from './ApiManager';

export const fetchDogBreeds = async () => {
    try {
      const response = await ApiManager.get('/dogBreeds');
      console.log('DogBreeds:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching dogBreeds:', error);
      return null;
    }
  };

export const fetchDogBreedById = async (id) => {
    try {
        const response = await ApiManager.get(`/dogBreeds/${id}`);
        console.log('DogBreed Details:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching dogBreed by ID:', error);
        return null;
    }
};