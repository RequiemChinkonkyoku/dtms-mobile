import ApiManager from './ApiManager';

export const fetchLegalDocumentsByCustomerId = async (customerId) => {
    try {
        const response = await ApiManager.get(`/legalDocument/customer/${customerId}`);
        console.log('Legal Documents:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching legal documents:', error);
        return null;
    }
};