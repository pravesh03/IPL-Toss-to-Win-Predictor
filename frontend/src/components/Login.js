import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Alert,
    Paper,
    CircularProgress,
    Collapse,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        general: ''
    });
    const [loading, setLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [isNetworkError, setIsNetworkError] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    // Clear network error state when component unmounts
    useEffect(() => {
        return () => setIsNetworkError(false);
    }, []);

    const validateForm = () => {
        const newErrors = {
            username: '',
            password: '',
            general: ''
        };
        let isValid = true;

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters long';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear specific field error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        
        // Clear general error when user types
        if (errors.general) {
            setErrors(prev => ({
                ...prev,
                general: ''
            }));
        }

        setIsNetworkError(false);
    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        setIsNetworkError(false);
        handleSubmit(new Event('submit'));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset errors
        setErrors({
            username: '',
            password: '',
            general: ''
        });

        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setIsNetworkError(false);

        try {
            const result = await login({
                username: formData.username,
                password: formData.password
            });
            
            if (result.success) {
                setFormData({ username: '', password: '' });
                navigate('/');
            } else {
                handleLoginError(result.error);
            }
        } catch (err) {
            handleLoginError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginError = (error) => {
        console.error('Login error:', error);
        
        // Network error
        if (!navigator.onLine || error.message?.includes('network')) {
            setIsNetworkError(true);
            setErrors(prev => ({
                ...prev,
                general: 'Network error. Please check your internet connection.'
            }));
            return;
        }

        // Rate limiting
        if (error.message?.includes('429') || error.message?.includes('too many')) {
            setErrors(prev => ({
                ...prev,
                general: 'Too many login attempts. Please try again later.'
            }));
            return;
        }

        // Invalid credentials
        if (error.message?.includes('401') || 
            error.message?.toLowerCase().includes('invalid') || 
            error.message?.toLowerCase().includes('incorrect')) {
            setErrors(prev => ({
                ...prev,
                general: 'Invalid username or password.'
            }));
            return;
        }

        // Account locked
        if (error.message?.toLowerCase().includes('locked')) {
            setErrors(prev => ({
                ...prev,
                general: 'Account locked. Please contact support.'
            }));
            return;
        }

        // Default error
        setErrors(prev => ({
            ...prev,
            general: error.message || 'An unexpected error occurred. Please try again.'
        }));
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 4, 
                    mt: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography 
                        component="h1" 
                        variant="h4"
                        sx={{
                            color: 'primary.main',
                            fontWeight: 'bold',
                            mb: 3
                        }}
                    >
                        Sign In
                    </Typography>
                    
                    <Collapse in={!!errors.general} sx={{ width: '100%', mb: 2 }}>
                        {errors.general && (
                        <Alert 
                                severity={isNetworkError ? "warning" : "error"}
                                action={
                                    <>
                                        {isNetworkError && (
                                            <IconButton
                                                color="inherit"
                                                size="small"
                                                onClick={handleRetry}
                                                disabled={loading}
                                            >
                                                <RefreshIcon />
                                            </IconButton>
                                        )}
                                        <IconButton
                                            color="inherit"
                                            size="small"
                                            onClick={() => setErrors(prev => ({ ...prev, general: '' }))}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </>
                                }
                            sx={{ 
                                    backgroundColor: isNetworkError ? 'rgba(237, 108, 2, 0.1)' : 'rgba(211, 47, 47, 0.1)',
                                    color: isNetworkError ? '#ed6c02' : '#ff1744',
                                    '& .MuiAlert-icon': {
                                        color: isNetworkError ? '#ed6c02' : '#ff1744'
                                    },
                                    animation: 'fadeIn 0.3s ease-in',
                                    '@keyframes fadeIn': {
                                        '0%': {
                                            opacity: 0,
                                            transform: 'translateY(-10px)'
                                        },
                                        '100%': {
                                            opacity: 1,
                                            transform: 'translateY(0)'
                                        }
                                    }
                            }}
                        >
                                {errors.general}
                        </Alert>
                    )}
                    </Collapse>

                    <Box 
                        component="form" 
                        onSubmit={handleSubmit} 
                        sx={{ width: '100%' }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleChange}
                            error={!!errors.username}
                            helperText={errors.username}
                            disabled={loading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.23)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                                '& .MuiFormHelperText-root': {
                                    color: '#ff1744'
                                }
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            disabled={loading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.23)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                                '& .MuiFormHelperText-root': {
                                    color: '#ff1744'
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.5,
                                position: 'relative'
                            }}
                        >
                            {loading ? (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: 'white',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                />
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                        <Button
                            component={Link}
                            to="/register"
                            fullWidth
                            variant="text"
                            sx={{ 
                                textTransform: 'none',
                                color: 'primary.main'
                            }}
                        >
                            Don't have an account? Sign Up
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login; 