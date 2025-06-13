import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CssBaseline from '@mui/material/CssBaseline';
import PredictionForm from './components/PredictionForm';
import PredictionHistory from './components/PredictionHistory';
import DataAnalysis from './components/DataAnalysis';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { Box } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Deep blue
      light: '#63a4ff',
      dark: '#004ba0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00bfae', // Teal accent
      light: '#5df2d6',
      dark: '#008e76',
      contrastText: '#fff',
    },
    info: {
      main: '#ff9800', // Orange accent
      light: '#ffc947',
      dark: '#c66900',
      contrastText: '#fff',
    },
    background: {
      default: 'linear-gradient(135deg, #e3f2fd 0%, #f8fafc 100%)',
      paper: '#ffffff',
    },
    text: {
      primary: '#222b45',
      secondary: '#5a6270',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: 1,
    },
    h5: {
      fontWeight: 600,
      letterSpacing: 0.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: 0.5,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f8fafc 100%)',
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(25, 118, 210, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: 'transparent',
                width: '100%',
                position: 'relative',
                zIndex: 0,
              }}>
                <Navbar />
                <Box sx={{ 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'transparent',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected routes */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <PredictionForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/history"
                      element={
                        <ProtectedRoute>
                          <PredictionHistory />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/analysis"
                      element={
                        <ProtectedRoute>
                          <DataAnalysis />
                        </ProtectedRoute>
                      }
                    />

                    {/* Redirect any unknown routes to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Box>
              </Box>
            </LocalizationProvider>
          </Router>
        </ThemeProvider>
      </StyledEngineProvider>
    </AuthProvider>
  );
}

export default App;
