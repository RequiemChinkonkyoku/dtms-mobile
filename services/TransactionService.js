import ApiManager from './ApiManager';

export const fetchTransactionsByAccountId = async (accountId) => {
    try {
        const response = await ApiManager.get(`/transactions/by-account/${accountId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
};