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

export const fetchAccountById = async (accountId) => {
  try {
      const response = await ApiManager.get(`/accounts/${accountId}`);
      console.log('Account Details:', response.data);
      return response.data;
  } catch (error) {
      console.error('Error fetching Account by ID:', error);
      return null;
  }
};

export const loginAccount = async (credentials) => {
  try {
    const response = await ApiManager.post('/accounts/login', credentials);

    if (response.data.token === null){
      return {
        success: false,
        error: 'Invalid email or password'
      };
    } else{
      return {
        success: true,
        token: response.data.token
      };
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
};

export const registerAccount = async (accountData) => {
  try {
    const response = await ApiManager.post('/accounts/register', accountData);
    console.log('Registration Response:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error registering account:', error);
    if (error.response?.status === 500) {
      return {
        success: false,
        error: 'An account with this email or username already exists'
      };
    }
    if (error.response?.status === 400) {
      // Extract validation errors from response
      const errorMessage = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat()[0]
        : error.response?.data?.message || 'Invalid registration data';
      
      return {
        success: false,
        error: errorMessage
      };
    }
    return {
      success: false,
      error: 'Registration failed. Please try again.'
    };
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await ApiManager.post(`/accounts/Verify/${otp}?email=${email}`);
    console.log('Verify OTP Response:', response.data);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    if (error.response?.status === 400) {
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid OTP code'
      };
    }
    return {
      success: false,
      error: 'Verification failed. Please try again.'
    };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await ApiManager.post(`/accounts/forgotPassword?email=${email}`);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error in forgot password:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to process forgot password request'
    };
  }
};

export const resetPassword = async (email, otpCode, newPassword) => {
  try {
    const response = await ApiManager.put(`/accounts/resetPassword?email=${email}&otpCode=${otpCode}&newPassword=${newPassword}`);
    return {
      success: true,
      message: response.data
    };
  } catch (error) {
    console.error('Error in reset password:', error);
    return {
      success: false,
      error: error.response?.data || 'Failed to reset password'
    };
  }
};