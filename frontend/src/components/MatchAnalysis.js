import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
} from '@mui/material';

const MatchAnalysis = ({ prediction, formData }) => {
    if (!prediction || !prediction.team1_stats) return null;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
                Match Analysis
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Team 1 Stats */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="primary">
                                {formData.team1} Statistics
                            </Typography>
                            <Typography variant="body2">
                                Total Matches: {prediction.team1_stats.total_matches}
                            </Typography>
                            <Typography variant="body2">
                                Toss Wins: {prediction.team1_stats.toss_wins}
                            </Typography>
                            <Typography variant="body2">
                                Match Wins: {prediction.team1_stats.match_wins}
                            </Typography>
                            <Typography variant="body2">
                                Win Rate: {(prediction.team1_stats.win_rate * 100).toFixed(1)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Head to Head Stats */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="primary">
                                Head to Head
                            </Typography>
                            <Typography variant="body2">
                                Total Matches: {prediction.head_to_head.total_matches}
                            </Typography>
                            <Typography variant="body2">
                                {formData.team1} Wins: {prediction.head_to_head.team1_wins}
                            </Typography>
                            <Typography variant="body2">
                                {formData.team2} Wins: {prediction.head_to_head.team2_wins}
                            </Typography>
                            <Typography variant="body2">
                                {formData.team1} Toss Wins: {prediction.head_to_head.team1_toss_wins}
                            </Typography>
                            <Typography variant="body2">
                                {formData.team2} Toss Wins: {prediction.head_to_head.team2_toss_wins}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Team 2 Stats */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="primary">
                                {formData.team2} Statistics
                            </Typography>
                            <Typography variant="body2">
                                Total Matches: {prediction.team2_stats.total_matches}
                            </Typography>
                            <Typography variant="body2">
                                Toss Wins: {prediction.team2_stats.toss_wins}
                            </Typography>
                            <Typography variant="body2">
                                Match Wins: {prediction.team2_stats.match_wins}
                            </Typography>
                            <Typography variant="body2">
                                Win Rate: {(prediction.team2_stats.win_rate * 100).toFixed(1)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MatchAnalysis; 