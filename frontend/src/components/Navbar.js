import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
} from '@mui/material';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import HistoryIcon from '@mui/icons-material/History';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const handleLogoutClick = () => {
        setOpenLogoutDialog(true);
    };

    const handleLogoutConfirm = () => {
        logout();
        setOpenLogoutDialog(false);
        navigate('/login');
    };

    const handleLogoutCancel = () => {
        setOpenLogoutDialog(false);
    };

    const navItems = [
        { path: '/', label: 'Home', icon: <HomeIcon />, tooltip: 'Go to Prediction Form' },
        { path: '/history', label: 'History', icon: <HistoryIcon />, tooltip: 'View Prediction History' },
        { path: '/analysis', label: 'Analysis', icon: <AnalyticsIcon />, tooltip: 'View Analysis' }
    ];

    return (
        <>
        <AppBar 
            position="static" 
            sx={{
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
            }}
        >
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SportsCricketIcon 
                            sx={{ 
                                mr: 2,
                                animation: 'spin 4s linear infinite',
                                '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' },
                                },
                            }} 
                        />
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: 'white',
                                fontWeight: 'bold',
                                    cursor: 'pointer'
                            }}
                                onClick={() => navigate('/')}
                        >
                            IPL Predictor
                        </Typography>
                    </Box>

                        {isAuthenticated && (
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        {navItems.map((item) => (
                                    <Tooltip key={item.path} title={item.tooltip} arrow>
                            <Button
                                            onClick={() => navigate(item.path)}
                                startIcon={item.icon}
                                sx={{
                                    color: 'white',
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                                    width: location.pathname === item.path ? '100%' : '0%',
                                        height: '2px',
                                        backgroundColor: 'white',
                                        transition: 'width 0.3s ease-in-out',
                                    },
                                    '&:hover::after': {
                                        width: '100%',
                                    },
                                }}
                            >
                                {item.label}
                            </Button>
                                    </Tooltip>
                        ))}
                                <Tooltip title="Logout" arrow>
                                    <Button
                                        onClick={handleLogoutClick}
                                        startIcon={<LogoutIcon />}
                                        sx={{
                                            color: 'white',
                                            ml: 2,
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            },
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </Tooltip>
                    </Box>
                        )}
                </Toolbar>
            </Container>
        </AppBar>

            {/* Logout Confirmation Dialog */}
            <Dialog
                open={openLogoutDialog}
                onClose={handleLogoutCancel}
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        color: 'white',
                        minWidth: '300px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                    }
                }}
            >
                <DialogTitle sx={{ 
                    color: '#1976d2',
                    fontWeight: 'bold',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    Confirm Logout
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        mt: 2
                    }}>
                        Are you sure you want to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ 
                    padding: 2,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <Button 
                        onClick={handleLogoutCancel}
                        sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                    >
                        No, Cancel
                    </Button>
                    <Button 
                        onClick={handleLogoutConfirm}
                        variant="contained"
                        color="primary"
                        startIcon={<LogoutIcon />}
                        sx={{
                            ml: 2,
                            '&:hover': {
                                backgroundColor: '#1565c0'
                            }
                        }}
                    >
                        Yes, Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Navbar; 