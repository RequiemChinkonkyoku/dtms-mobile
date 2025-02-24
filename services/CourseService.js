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

export const fetchCourseById = async (id) => {
  try {
    const response = await ApiManager.get(`/courses/${id}`);
    console.log('Course Details:', response.data);
    return response.data.object;
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    return null;
  }
};