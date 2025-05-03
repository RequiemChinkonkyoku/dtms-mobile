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

export const createLegalDocument = async (documentData) => {
    try {
        const response = await ApiManager.post('/legalDocument', documentData);
        console.log('Created Legal Document:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating legal document:', error);
        throw error;
    }
};

export const fetchLegalDocumentById = async (documentId) => {
    try {
        const response = await ApiManager.get(`/legalDocument/${documentId}`);
        console.log('Legal Document:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching legal document:', error);
        return null;
    }
};