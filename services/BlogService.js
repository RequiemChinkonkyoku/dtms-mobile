import ApiManager from './ApiManager';


export const fetchBlogs = async () => {
  try {
    const response = await ApiManager.get('/blog/get-all-blogs');
    console.log('Blogs:', response.data);
    return response.data.objectList;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return null;
  }
};