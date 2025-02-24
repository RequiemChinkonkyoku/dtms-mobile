import ApiManager from './ApiManager';


export const fetchCourses = async () => {
  try {
    const response = await ApiManager.get('/courses');
    console.log('Courses:', response.data.objectList);
    return response.data.objectList;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return null;
  }
};