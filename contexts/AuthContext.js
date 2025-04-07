import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import ApiManager from '../services/ApiManager';
import { decodeToken } from "../utils/TokenUtils";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await SecureStore.getItemAsync('user_token');
            if (token) {
                ApiManager.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const decodedToken = decodeToken(token);
                setUserInfo(decodedToken);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (token) => {
        await SecureStore.setItemAsync('user_token', token);
        ApiManager.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const decodedToken = decodeToken(token);
        setUserInfo(decodedToken);
        setIsAuthenticated(true);

        await SecureStore.setItemAsync('user_role', decodedToken.role);
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('user_token');
        await SecureStore.deleteItemAsync('user_role');
        delete ApiManager.defaults.headers.common['Authorization'];
        setUserInfo(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            loading,
            login,
            logout,
            checkAuth,
            userInfo
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);