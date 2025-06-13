import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
    Paper,
    Alert
} from '@mui/material';
import { makePrediction } from '../services/predictions';
import Analysis from './Analysis';

const DataAnalysis = () => {
    const [formData, setFormData] = useState({
        team1: '',
        team2: '',
        city: '',
        toss_winner: '',
        toss_decision: 'bat',
    });
    const [analysisData, setAnalysisData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if there's prediction data in localStorage
        const storedData = localStorage.getItem('predictionData');
        if (storedData) {
            try {
                const { prediction, formData: storedFormData } = JSON.parse(storedData);
                setFormData(storedFormData);
                setAnalysisData(prediction);
            } catch (err) {
                console.error('Error parsing stored prediction data:', err);
            }
        }
    }, []);

    const teams = [
        'Mumbai Indians',
        'Delhi Capitals',  // Previously Delhi Daredevils
        'Chennai Super Kings',
        'Kolkata Knight Riders',
        'Rajasthan Royals',
        'Royal Challengers Bangalore',
        'Sunrisers Hyderabad',
        'Punjab Kings',    // Previously Kings XI Punjab
        'Lucknow Super Giants',
        'Gujarat Titans'
    ];

    const venues = [
        'Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'Hyderabad',
        'Ahmedabad', 'Bangalore', 'Jaipur', 'Pune'
    ];

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'team1' || name === 'team2' ? { toss_winner: '' } : {}),
        }));
        setError(null);
    };

    const handleAnalyze = async () => {
        try {
            const data = await makePrediction(formData);
            setAnalysisData(data);
            setError(null);
            
            // Update localStorage with new analysis data
            localStorage.setItem('predictionData', JSON.stringify({
                prediction: data,
                formData: formData
            }));
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.message || 'Failed to analyze teams');
            setAnalysisData(null);
        }
    };

    const isFormValid = () => {
        return formData.team1 && formData.team2 && formData.city && 
               formData.team1 !== formData.team2;
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" gutterBottom align="center" color="primary" 
                sx={{ 
                    fontWeight: 'bold',
                    mb: 4,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}>
                IPL Data Analysis
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}

            {analysisData && (
                <Box sx={{ mt: 4 }}>
                    <Analysis prediction={analysisData} formData={formData} />
                </Box>
            )}
        </Container>
    );
};

export default DataAnalysis; 