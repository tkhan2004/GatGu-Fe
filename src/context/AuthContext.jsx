import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Check for stored user first (faster)
            const storedUser = apiService.getStoredUser();
            const token = apiService.getAccessToken();

            if (token && storedUser) {
                setUser(storedUser);
                setLoading(false);
                setInitializing(false);

                // Verify token in background
                try {
                    const userData = await apiService.getCurrentUser();
                    setUser(userData);
                    apiService.setStoredUser(userData);
                } catch (error) {
                    console.error('Token verification failed:', error);
                    // Token invalid, clear everything
                    apiService.removeTokens();
                    setUser(null);
                }
            } else if (token) {
                // Have token but no stored user
                try {
                    const userData = await apiService.getCurrentUser();
                    setUser(userData);
                    apiService.setStoredUser(userData);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    apiService.removeTokens();
                    setUser(null);
                }
                setLoading(false);
                setInitializing(false);
            } else {
                // No token
                setLoading(false);
                setInitializing(false);
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
            setLoading(false);
            setInitializing(false);
        }
    };

    const login = async (username, password) => {
        try {
            setLoading(true);
            await apiService.login(username, password);
            const userData = await apiService.getCurrentUser();
            setUser(userData);
            apiService.setStoredUser(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            const response = await apiService.register(userData);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        apiService.logout();
        setUser(null);
        navigate('/login');
    };

    const updateUserData = (newUserData) => {
        setUser(newUserData);
        apiService.setStoredUser(newUserData);
    };

    const value = {
        user,
        loading,
        initializing,
        login,
        register,
        logout,
        updateUserData,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
