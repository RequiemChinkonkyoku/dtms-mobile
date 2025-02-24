import ApiManager from './ApiManager';


export const fetchAccounts = async () => {
  try {
    const response = await ApiManager.get('/accounts');
    console.log('Accounts:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return null;
  }
};