import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TossWinPredictor from './TossWinPredictor';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('TossWinPredictor Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders all form elements', () => {
    render(<TossWinPredictor />);
    
    // Check for form elements
    expect(screen.getByText('🏏 IPL Toss-to-Win Predictor')).toBeInTheDocument();
    expect(screen.getByLabelText(/Team 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Team 2/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Toss Winner/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Toss Decision/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
  });

  test('form validation - empty fields', () => {
    render(<TossWinPredictor />);
    
    // Try to submit with empty fields
    const submitButton = screen.getByRole('button', { name: /predict/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Please fill out all fields.')).toBeInTheDocument();
  });

  test('form validation - same teams', async () => {
    render(<TossWinPredictor />);
    
    // Select same team for both dropdowns
    const team1Select = screen.getByLabelText(/Team 1/i);
    const team2Select = screen.getByLabelText(/Team 2/i);
    
    fireEvent.change(team1Select, { target: { value: 'Mumbai Indians' } });
    fireEvent.change(team2Select, { target: { value: 'Mumbai Indians' } });
    
    const submitButton = screen.getByRole('button', { name: /predict/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Team 1 and Team 2 must be different.')).toBeInTheDocument();
  });

  test('successful prediction', async () => {
    // Mock successful API response
    axios.post.mockResolvedValueOnce({
      data: { result: 'Predicted Toss-Win Probability: 65%' }
    });

    render(<TossWinPredictor />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Team 1/i), { 
      target: { value: 'Mumbai Indians', name: 'team1' } 
    });
    fireEvent.change(screen.getByLabelText(/Team 2/i), { 
      target: { value: 'Chennai Super Kings', name: 'team2' } 
    });
    fireEvent.change(screen.getByLabelText(/Toss Winner/i), { 
      target: { value: 'Mumbai Indians', name: 'toss_winner' } 
    });
    fireEvent.change(screen.getByLabelText(/Toss Decision/i), { 
      target: { value: 'bat', name: 'toss_decision' } 
    });
    fireEvent.change(screen.getByLabelText(/City/i), { 
      target: { value: 'Mumbai', name: 'city' } 
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /predict/i }));

    // Wait for and verify the prediction
    await waitFor(() => {
      expect(screen.getByText(/Predicted Toss-Win Probability: 65%/i)).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    // Mock API error
    axios.post.mockRejectedValueOnce(new Error('API Error'));

    render(<TossWinPredictor />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Team 1/i), { 
      target: { value: 'Mumbai Indians', name: 'team1' } 
    });
    fireEvent.change(screen.getByLabelText(/Team 2/i), { 
      target: { value: 'Chennai Super Kings', name: 'team2' } 
    });
    fireEvent.change(screen.getByLabelText(/Toss Winner/i), { 
      target: { value: 'Mumbai Indians', name: 'toss_winner' } 
    });
    fireEvent.change(screen.getByLabelText(/Toss Decision/i), { 
      target: { value: 'bat', name: 'toss_decision' } 
    });
    fireEvent.change(screen.getByLabelText(/City/i), { 
      target: { value: 'Mumbai', name: 'city' } 
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /predict/i }));

    // Wait for and verify error message
    await waitFor(() => {
      expect(screen.getByText('Error fetching prediction. Please try again.')).toBeInTheDocument();
    });
  });
}); 