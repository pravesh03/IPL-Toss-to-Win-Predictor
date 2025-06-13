import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5010';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to all requests
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response?.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export const makePrediction = async (formData) => {
    try {
        const response = await api.post('/predict', formData);
        return response.data;
    } catch (error) {
        console.error('Prediction error:', error.response || error);
        throw new Error(error.response?.data?.error || 'Failed to make prediction');
    }
};

export const getPredictionStats = async () => {
    try {
        const response = await api.get('/predictions/stats');
        return response.data;
    } catch (error) {
        console.error('Stats error:', error.response || error);
        throw new Error(error.response?.data?.error || 'Failed to fetch prediction stats');
    }
};

export const getRealTimeAnalysis = async (formData) => {
    try {
        const response = await api.post('/analysis/real-time', formData);
        return response.data;
    } catch (error) {
        console.error('Analysis error:', error.response || error);
        throw new Error(error.response?.data?.error || 'Failed to get real-time analysis');
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/login', credentials);
        const { access_token, username } = response.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('username', username);
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response || error);
        throw new Error(error.response?.data?.error || 'Login failed');
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/register', userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error.response || error);
        throw new Error(error.response?.data?.error || 'Registration failed');
    }
};

export const getPredictionHistory = async () => {
    try {
        const response = await api.get('/predictions/history');
        return response.data;
    } catch (error) {
        console.error('History error:', error.response || error);
        throw new Error(error.response?.data?.error || 'Failed to fetch prediction history');
    }
};