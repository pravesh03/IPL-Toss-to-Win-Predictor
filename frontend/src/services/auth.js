import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5010';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Don't redirect here anymore, let the AuthContext handle it
        }
        return Promise.reject(error);
    }
);

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        const { access_token, user } = response.data;
        
        if (access_token && user) {
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            return { token: access_token, user };
        }
        
        throw new Error('Invalid response from server');
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
        throw new Error(errorMessage);
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        const { access_token, user } = response.data;
        
        if (access_token && user) {
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
            return { token: access_token, user };
        }
        
        throw new Error('Invalid response from server');
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || 'Login failed';
        throw new Error(errorMessage);
    }
};

export const logoutUser = () => {
    try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};

export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

export const getAuthToken = () => {
    return localStorage.getItem('token');
};

export default api; 