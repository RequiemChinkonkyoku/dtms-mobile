import ApiManager from './ApiManager';

export const uploadImageToCloudinary = async (imageUri) => {
    try {
        // Extract filename from URI
        let filename = imageUri.split('/').pop();

        // Get file extension and determine MIME type
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image/jpeg`;

        let formData = new FormData();
        formData.append('file', {
            uri: imageUri,
            name: filename,
            type: type
        });

        console.log("Uploading Image:", {
            uri: imageUri,
            name: filename,
            type: type,
        });
        

        const uploadResponse = await ApiManager.post('/uploadFile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return uploadResponse.data;
    } catch (error) {
        if (error.response) {
            console.error("Server Error:", {
                data: error.response.data,
                status: error.response.status,
                headers: error.response.headers,
            });
        } else if (error.request) {
            console.error("Network Error:", error.request);
        } else {
            console.error("Error:", error.message);
        }
        throw error;
    }
};
