import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Alert,
  Tooltip,
  Chip,
  Grid,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StadiumIcon from '@mui/icons-material/Stadium';
import GroupsIcon from '@mui/icons-material/Groups';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TimelineIcon from '@mui/icons-material/Timeline';
import { makePrediction } from '../services/predictions';
import { useAuth } from '../context/AuthContext';

const PredictionForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    city: '',
    team1: '',
    team2: '',
    toss_winner: '',
    toss_decision: 'bat',
    match_date: new Date(),
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const teams = [
    'Mumbai Indians', 'Delhi Capitals', 'Chennai Super Kings',
    'Kolkata Knight Riders', 'Rajasthan Royals', 'Royal Challengers Bangalore',
    'Sunrisers Hyderabad', 'Lucknow Super Giants', 'Gujarat Titans', 'Punjab Kings'
  ];

  const venues = [
    'Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'Hyderabad',
    'Ahmedabad', 'Bangalore', 'Jaipur', 'Pune'
  ];

  const validateForm = () => {
    if (!formData.city) return "Please select a city";
    if (!formData.team1) return "Please select Team 1";
    if (!formData.team2) return "Please select Team 2";
    if (formData.team1 === formData.team2) return "Team 1 and Team 2 cannot be the same";
    if (!formData.toss_winner) return "Please select Toss Winner";
    if (formData.toss_winner !== formData.team1 && formData.toss_winner !== formData.team2) {
      return "Toss Winner must be one of the selected teams";
    }
    if (!formData.toss_decision) return "Please select Toss Decision";
    if (!formData.match_date) return "Please select Match Date";
    return null;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => {
      const newState = {
        ...prevState,
        [name]: value,
      };
      if (name === 'team1' || name === 'team2') {
        newState.toss_winner = '';
      }
      return newState;
    });
    setError(null);
    setPrediction(null);
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      match_date: date
    }));
    setError(null);
    setPrediction(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Format match_date to YYYY-MM-DD string
      const formattedData = {
        team1: formData.team1,
        team2: formData.team2,
        toss_winner: formData.toss_winner,
        toss_decision: formData.toss_decision,
        city: formData.city,
        match_date: formData.match_date
          ? (typeof formData.match_date === 'string'
              ? formData.match_date
              : formData.match_date.toISOString().split('T')[0])
          : ''
      };

      const data = await makePrediction(formattedData);
      localStorage.setItem('predictionData', JSON.stringify({ prediction: data, formData: formattedData }));
      navigate('/analysis');
    } catch (err) {
      setError(err.message || 'Failed to get prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #181c2f 0%, #232946 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, md: 6 },
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Floating shapes for GenZ appeal */}
      <Box sx={{
        position: 'absolute',
        top: 40,
        left: 60,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #7c4dff55 60%, transparent 100%)',
        filter: 'blur(8px)',
        zIndex: 1,
        animation: 'float1 6s ease-in-out infinite',
        '@keyframes float1': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px) scale(1.1)' },
        },
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: 60,
        right: 80,
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 70% 70%, #00bfae55 60%, transparent 100%)',
        filter: 'blur(10px)',
        zIndex: 1,
        animation: 'float2 7s ease-in-out infinite',
        '@keyframes float2': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(30px) scale(1.08)' },
        },
      }} />

      {/* Cricket Ball Animation */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          animation: 'spin 4s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
          zIndex: 2,
        }}
      >
        <SportsCricketIcon sx={{ fontSize: 60, color: '#00bfae' }} />
      </Box>

      {/* Trophy Animation */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          animation: 'float 3s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          zIndex: 2,
        }}
      >
        <EmojiEventsIcon sx={{ fontSize: 60, color: '#FFD700' }} />
      </Box>

      <Card 
        sx={{ 
          maxWidth: 600, 
          width: '100%',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(18px) saturate(160%)',
          borderRadius: 6,
          boxShadow: '0 8px 40px 0 #7c4dff22, 0 1.5px 8px 0 #00bfae22',
          border: '2px solid',
          borderImage: 'linear-gradient(120deg, #7c4dff 10%, #00bfae 90%) 1',
          position: 'relative',
          zIndex: 3,
          p: 0,
          overflow: 'visible',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'scale(1.025)',
            boxShadow: '0 12px 48px 0 #00bfae33, 0 2px 12px 0 #7c4dff33',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 6,
            boxShadow: '0 0 40px 10px #7c4dff11 inset',
            pointerEvents: 'none',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 }, position: 'relative' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative', mb: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  letterSpacing: 1,
                  color: '#1976d2',
                  textShadow: '0 2px 12px #1976d255',
                  mb: 0.5,
                  textAlign: 'center',
                  zIndex: 2,
                }}
              >
                IPL Match Predictor
              </Typography>
              {/* Animated underline */}
              <Box sx={{
                height: 5,
                width: '80%',
                mx: 'auto',
                borderRadius: 2,
                background: 'linear-gradient(90deg, #1976d2 0%, #00bfae 100%)',
                position: 'absolute',
                left: '10%',
                bottom: -8,
                animation: 'underlineGlow 2.5s infinite alternate',
                '@keyframes underlineGlow': {
                  '0%': { boxShadow: '0 0 8px 2px #1976d255' },
                  '100%': { boxShadow: '0 0 16px 4px #00bfae88' },
                },
              }} />
            </Box>
            <Typography variant="subtitle1" sx={{ color: '#1976d2', fontWeight: 500, textAlign: 'center', mt: 1 }}>
              Predict the winner of your favorite IPL matches with AI-powered insights!
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Match Date"
                    value={formData.match_date}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <FormControl fullWidth>
                        <InputLabel>Match Date</InputLabel>
                        {params.input}
                      </FormControl>
                    )}
                    minDate={new Date()}
                    disabled={isLoading}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    label="City"
                    disabled={isLoading}
                  >
                    {venues.map(venue => (
                      <MenuItem key={venue} value={venue}>{venue}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Team 1</InputLabel>
                  <Select
                    name="team1"
                    value={formData.team1}
                    onChange={handleChange}
                    label="Team 1"
                    disabled={isLoading}
                  >
                    {teams.map(team => (
                      <MenuItem 
                        key={team} 
                        value={team}
                        disabled={team === formData.team2}
                      >
                        {team}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Team 2</InputLabel>
                  <Select
                    name="team2"
                    value={formData.team2}
                    onChange={handleChange}
                    label="Team 2"
                    disabled={isLoading}
                  >
                    {teams.map(team => (
                      <MenuItem 
                        key={team} 
                        value={team}
                        disabled={team === formData.team1}
                      >
                        {team}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Toss Winner</InputLabel>
                  <Select
                    name="toss_winner"
                    value={formData.toss_winner}
                    onChange={handleChange}
                    label="Toss Winner"
                    disabled={isLoading || !formData.team1 || !formData.team2}
                  >
                    {formData.team1 && (
                      <MenuItem value={formData.team1}>{formData.team1}</MenuItem>
                    )}
                    {formData.team2 && (
                      <MenuItem value={formData.team2}>{formData.team2}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Toss Decision</InputLabel>
                  <Select
                    name="toss_decision"
                    value={formData.toss_decision}
                    onChange={handleChange}
                    label="Toss Decision"
                    disabled={isLoading || !formData.toss_winner}
                  >
                    <MenuItem value="bat">Bat</MenuItem>
                    <MenuItem value="field">Field</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    boxShadow: '0 4px 16px #7c4dff44',
                    background: 'linear-gradient(90deg, #7c4dff 0%, #00bfae 100%)',
                    color: '#fff',
                    letterSpacing: 1,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #00bfae 0%, #7c4dff 100%)',
                    },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Predict Match'}
                </Button>
              </Grid>
            </Grid>
          </form>

          {prediction && (
            <Alert 
              severity="success" 
              sx={{ 
                mt: 3,
                borderRadius: 2,
                animation: 'slideIn 0.3s ease-out',
                '@keyframes slideIn': {
                  from: { transform: 'translateY(-20px)', opacity: 0 },
                  to: { transform: 'translateY(0)', opacity: 1 },
                },
              }}
              icon={<EmojiEventsIcon />}
            >
              {prediction.result}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PredictionForm; 
