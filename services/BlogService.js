import ApiManager from './ApiManager';


export const fetchBlogs = async () => {
  try {
    const response = await ApiManager.get('/blogs');
    console.log('Blogs:', response.data);
    const activeBlogs = response.data.objectList.filter(blog => blog.status === 1);
    return activeBlogs;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return null;
  }
};