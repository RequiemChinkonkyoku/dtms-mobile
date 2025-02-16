import ApiManager from './ApiManager';


export const fetchBlogs = async () => {
  try {
    const response = await ApiManager.get('/blog/get-all-blogs');
    console.log('Blogs:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return null;
  }
};