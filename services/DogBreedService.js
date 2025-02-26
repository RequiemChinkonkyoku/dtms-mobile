import ApiManager from './ApiManager';

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