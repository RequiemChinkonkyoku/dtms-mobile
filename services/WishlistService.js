import ApiManager from './ApiManager';

export const addToWishlist = async (wishlistData) => {
    try {
        const response = await ApiManager.post('/wishlists', wishlistData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('Error adding to wishlist:', error.response?.data?.message);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to add to wishlist'
        };
    }
};

export const fetchWishlist = async (customerAccountId) => {
    try {
        const response = await ApiManager.get('/wishlists');
        const filteredData = response.data.objectList
            .filter(item => item.customerAccountId === customerAccountId)
            .sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

        return {
            success: true,
            data: filteredData || []
        };
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to fetch wishlist',
            data: []
        };
    }
};

export const removeFromWishlist = async (wishlistId) => {
    try {
        const response = await ApiManager.delete(`/wishlists/${wishlistId}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to remove from wishlist'
        };
    }
};