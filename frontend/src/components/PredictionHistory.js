import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Container,
  Divider,
  Grid,
} from '@mui/material';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import StadiumIcon from '@mui/icons-material/Stadium';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScoreIcon from '@mui/icons-material/Score';

// Helper function to calculate the best streak of correct predictions
const calculateBestStreak = (predictions) => {
  let currentStreak = 0;
  let bestStreak = 0;
  
  predictions.forEach(prediction => {
    if (prediction.predictionCorrect) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });
  
  return bestStreak;
};

const PredictionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample data - replace with actual API call
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Simulated API call
        const data = [
          {
            id: 1,
            date: '2024-03-20',
            team1: 'Mumbai Indians',
            team2: 'Chennai Super Kings',
            venue: 'Mumbai',
            toss_winner: 'Mumbai Indians',
            toss_decision: 'bat',
            prediction: 'Mumbai Indians are likely to win',
            confidence: 0.84,
            accuracy: 0.82,
          },
          {
            id: 2,
            date: '2024-02-20',
            team1: 'Royal Challengers Bangalore',
            team2: 'Kolkata Knight Riders',
            venue: 'Bangalore',
            toss_winner: 'Royal Challengers Bangalore',
            toss_decision: 'field',
            prediction: 'Royal Challengers Bangalore are likely to win',
            confidence: 0.83,
            accuracy: 0.80,
          },
          // Add more sample predictions
        ];
        setHistory(data);
        setLoading(false);

        const stats = {
          totalPredictions: data.length,
          correctPredictions: data.filter(p => p.predictionCorrect).length,
          averageConfidence: data.reduce((acc, p) => acc + p.confidence, 0) / data.length,
          bestStreak: calculateBestStreak(data)
        };
      } catch (err) {
        setError('Failed to fetch prediction history');
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      position: 'absolute',
      left: 0,
      top: 0,
      background: 'linear-gradient(135deg, #181c2f 0%, #232946 100%)',
      py: { xs: 2, md: 6 },
      px: { xs: 1, md: 4 },
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h3" gutterBottom sx={{ 
          color: '#b47cff',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 4,
          letterSpacing: 1,
          textShadow: '0 2px 12px #7c4dff',
        }}>
          <SportsCricketIcon sx={{ fontSize: 40, color: '#00bfae' }} /> Prediction History
        </Typography>

        {/* History Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {history.map((prediction) => (
            <Grid item xs={12} md={6} key={prediction.id}>
              <Card 
                sx={{ 
                  background: 'rgba(36, 40, 59, 0.95)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 4,
                  boxShadow: '0 8px 32px 0 rgba(124, 77, 255, 0.18)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.03)',
                    boxShadow: '0 12px 40px 0 rgba(0,191,174,0.18)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#b47cff', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon /> {prediction.date}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        icon={prediction.confidence >= 0.7 ? <CheckCircleIcon /> : <ErrorIcon />}
                        label={`${Math.round(prediction.confidence * 100)}% Confidence`}
                        color={prediction.confidence >= 0.7 ? 'success' : 'warning'}
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip
                        icon={<TrendingUpIcon />}
                        label={`${Math.round(prediction.accuracy * 100)}% Accuracy`}
                        color="info"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <Chip
                      icon={<GroupsIcon />}
                      label={`${prediction.team1} vs ${prediction.team2}`}
                      sx={{ bgcolor: '#232946', color: '#b47cff', fontWeight: 600 }}
                    />
                    <Chip
                      icon={<StadiumIcon />}
                      label={prediction.venue}
                      sx={{ bgcolor: '#232946', color: '#00bfae', fontWeight: 600 }}
                    />
                    <Chip
                      icon={<SportsCricketIcon />}
                      label={`Toss: ${prediction.toss_winner} (${prediction.toss_decision})`}
                      sx={{ bgcolor: '#232946', color: '#ff9800', fontWeight: 600 }}
                    />
                  </Box>

                  <Typography 
                    variant="body1" 
                    sx={{ 
                      p: 2, 
                      bgcolor: '#7c4dff', 
                      color: 'white', 
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      letterSpacing: 0.5,
                      boxShadow: '0 2px 8px #7c4dff44',
                    }}
                  >
                    {prediction.prediction}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Table View */}
        <Card sx={{ background: 'rgba(36, 40, 59, 0.95)', backdropFilter: 'blur(8px)', borderRadius: 4, boxShadow: '0 4px 24px #7c4dff44', color: '#f4f4f4' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: '#b47cff', fontWeight: 700, mb: 2, letterSpacing: 1 }}>
              Detailed History
            </Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 'none', background: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#b47cff', fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ color: '#b47cff', fontWeight: 700 }}>Teams</TableCell>
                    <TableCell sx={{ color: '#00bfae', fontWeight: 700 }}>Venue</TableCell>
                    <TableCell sx={{ color: '#ff9800', fontWeight: 700 }}>Toss</TableCell>
                    <TableCell sx={{ color: '#b47cff', fontWeight: 700 }}>Prediction</TableCell>
                    <TableCell align="right" sx={{ color: '#00bfae', fontWeight: 700 }}>Winner</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((prediction) => {
                    // Extract predicted winner from the prediction string
                    let predictedWinner = 'N/A';
                    const match = prediction.prediction.match(/^(.*?)\s+are likely to win/i);
                    if (match && match[1]) {
                      predictedWinner = match[1];
                    }
                    return (
                      <TableRow key={prediction.id} hover sx={{ '&:hover': { background: '#232946' } }}>
                        <TableCell>
                          <Box sx={{ bgcolor: '#38405a', color: '#fff', borderRadius: 2, px: 2, py: 1, fontWeight: 500, display: 'inline-block', minWidth: 90, textAlign: 'center' }}>
                            {prediction.date}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ bgcolor: '#38405a', color: '#fff', borderRadius: 2, px: 2, py: 1, fontWeight: 500, display: 'inline-block', minWidth: 180 }}>
                            {`${prediction.team1} vs ${prediction.team2}`}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ bgcolor: '#38405a', color: '#fff', borderRadius: 2, px: 2, py: 1, fontWeight: 500, display: 'inline-block', minWidth: 90, textAlign: 'center' }}>
                            {prediction.venue}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ bgcolor: '#38405a', color: '#fff', borderRadius: 2, px: 2, py: 1, fontWeight: 500, display: 'inline-block', minWidth: 150 }}>
                            {`${prediction.toss_winner} (${prediction.toss_decision})`}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ bgcolor: '#38405a', color: '#fff', borderRadius: 2, px: 2, py: 1, fontWeight: 500, display: 'inline-block', minWidth: 180 }}>
                            {prediction.prediction}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={predictedWinner}
                            color="success"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default PredictionHistory; 