import ApiManager from './ApiManager';


export const fetchCategories = async () => {
  try {
    const response = await ApiManager.get('/categories');
    console.log('Categories:', response.data.objectList);
    return response.data.objectList;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return null;
  }
};