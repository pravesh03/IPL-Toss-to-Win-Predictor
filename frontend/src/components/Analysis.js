import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Paper,
    Alert,
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from 'recharts';

// Enhanced color palette
const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6', '#1abc9c'];
const CHART_COLORS = {
    primary: '#3498db',
    secondary: '#2ecc71',
    tertiary: '#f1c40f',
    quaternary: '#e74c3c'
};

// Custom styles
const styles = {
    container: {
        mt: 4,
        p: 3,
        background: 'linear-gradient(to bottom right, #f8f9fa, #e9ecef)',
        borderRadius: 3,
    },
    title: {
        fontWeight: 700,
        color: '#2c3e50',
        textAlign: 'center',
        mb: 4,
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    },
    chartContainer: {
        p: 3,
        background: '#ffffff',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
            transform: 'translateY(-5px)',
        },
    },
    chartTitle: {
        fontWeight: 600,
        color: '#34495e',
        mb: 2,
    },
    probabilityAlert: {
        mb: 4,
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        '& .MuiAlert-message': {
            fontSize: '1.2rem',
            fontWeight: 600,
            color: '#2c3e50',
        },
        animation: 'fadeIn 0.5s ease-in',
        '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(-20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
        },
    },
    summaryCard: {
        height: '100%',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: 2,
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
            transform: 'translateY(-5px)',
        },
    },
    summaryContent: {
        '& .MuiTypography-h6': {
            color: '#2c3e50',
            fontWeight: 600,
            mb: 2,
        },
        '& .MuiTypography-body1': {
            color: '#34495e',
            fontSize: '1.1rem',
            mb: 2,
        },
        '& .MuiTypography-body2': {
            color: '#7f8c8d',
            fontSize: '0.95rem',
            mb: 1,
        },
    },
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Paper
                sx={{
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0',
                }}
            >
                <Typography variant="subtitle2" color="primary">
                    {label}
                </Typography>
                {payload.map((entry, index) => (
                    <Typography key={index} variant="body2" sx={{ color: entry.color }}>
                        {`${entry.name}: ${entry.value}`}
                    </Typography>
                ))}
            </Paper>
        );
    }
    return null;
};

const Analysis = ({ prediction, formData }) => {
    if (!prediction || !prediction.team1_stats) return null;

    // Extract probability from the result string
    const probabilityMatch = prediction.result.match(/(\d+\.\d+)%/);
    const winningProbability = probabilityMatch ? parseFloat(probabilityMatch[1]) : 0;
    const winningTeam = prediction.result.includes(formData.team1) ? formData.team1 : formData.team2;

    const winRateData = [
        {
            name: formData.team1,
            'Win Rate': (prediction.team1_stats.win_rate * 100).toFixed(1),
        },
        {
            name: formData.team2,
            'Win Rate': (prediction.team2_stats.win_rate * 100).toFixed(1),
        },
    ];

    const matchStatsData = [
        {
            name: formData.team1,
            'Total Matches': prediction.team1_stats.total_matches,
            'Match Wins': prediction.team1_stats.match_wins,
            'Toss Wins': prediction.team1_stats.toss_wins,
        },
        {
            name: formData.team2,
            'Total Matches': prediction.team2_stats.total_matches,
            'Match Wins': prediction.team2_stats.match_wins,
            'Toss Wins': prediction.team2_stats.toss_wins,
        },
    ];

    const h2hData = [
        {
            name: `${formData.team1} Wins`,
            value: prediction.head_to_head.team1_wins,
        },
        {
            name: `${formData.team2} Wins`,
            value: prediction.head_to_head.team2_wins,
        },
    ];

    // Prepare radar data for each team
    const team1RadarData = [
        { metric: 'Win Rate', value: (prediction.team1_stats.win_rate * 100).toFixed(1), fullMark: 100 },
        { metric: 'Total Matches', value: prediction.team1_stats.total_matches, fullMark: Math.max(prediction.team1_stats.total_matches, prediction.team2_stats.total_matches) },
        { metric: 'Match Wins', value: prediction.team1_stats.match_wins, fullMark: Math.max(prediction.team1_stats.match_wins, prediction.team2_stats.match_wins) },
        { metric: 'Toss Wins', value: prediction.team1_stats.toss_wins, fullMark: Math.max(prediction.team1_stats.toss_wins, prediction.team2_stats.toss_wins) },
    ];
    const team2RadarData = [
        { metric: 'Win Rate', value: (prediction.team2_stats.win_rate * 100).toFixed(1), fullMark: 100 },
        { metric: 'Total Matches', value: prediction.team2_stats.total_matches, fullMark: Math.max(prediction.team1_stats.total_matches, prediction.team2_stats.total_matches) },
        { metric: 'Match Wins', value: prediction.team2_stats.match_wins, fullMark: Math.max(prediction.team1_stats.match_wins, prediction.team2_stats.match_wins) },
        { metric: 'Toss Wins', value: prediction.team2_stats.toss_wins, fullMark: Math.max(prediction.team1_stats.toss_wins, prediction.team2_stats.toss_wins) },
    ];

    return (
        <Box sx={{
            p: { xs: 2, md: 5 },
            minHeight: '100vh',
            width: '100vw',
            position: 'absolute',
            left: 0,
            top: 0,
            background: 'linear-gradient(135deg, #181c2f 0%, #232946 100%)',
        }}>
            <Grid container spacing={5} justifyContent="center">
                {/* Match Prediction Box - Top and Centered */}
                <Grid item xs={12}>
                    <Paper
                        elevation={6}
                        sx={{
                            mb: 4,
                            p: { xs: 3, md: 5 },
                            background: 'linear-gradient(90deg, #7c4dff 0%, #00bfae 100%)',
                            color: '#fff',
                            borderRadius: 4,
                            boxShadow: '0 8px 32px 0 rgba(124, 77, 255, 0.18)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 4,
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: { md: 4, xs: 0 }, mb: { xs: 2, md: 0 } }}>
                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 4V2H7v2H2v2c0 3.31 2.69 6 6 6h1v2.09A6.978 6.978 0 0 0 7 17c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2 0-1.64-.79-3.09-2-4.09V12h1c3.31 0 6-2.69 6-6V4h-5zm-7 8c-2.21 0-4-1.79-4-4V6h4v6zm10-4c0 2.21-1.79 4-4 4V6h4v2z" fill="#FFD700"/>
                            </svg>
                        </Box>
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', letterSpacing: 1, mb: 1, color: '#fff', textShadow: '0 2px 12px #7c4dff' }}>
                            Match Prediction
                        </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 900, color: '#FFD700', mb: 1, textShadow: '0 2px 16px #00bfae' }}>
                                {winningProbability}%
                            </Typography>
                            <Typography variant="h5" sx={{ color: '#fff', opacity: 0.95, fontWeight: 600 }}>
                                Probability of {winningTeam} winning the match
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Performance Key Metrics for Both Teams - Side by Side or Stacked */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{
                        p: 4,
                        background: 'linear-gradient(120deg, #232946 60%, #7c4dff 100%)',
                        borderRadius: 4,
                        boxShadow: '0 4px 24px rgba(124,77,255,0.15)',
                        textAlign: 'center',
                    }}>
                        <Typography variant="h5" sx={{ mb: 2, color: '#b47cff', fontWeight: 'bold', letterSpacing: 1 }}>{formData.team1} Metrics</Typography>
                        <ResponsiveContainer width="100%" height={350}>
                            <RadarChart data={team1RadarData} cx="50%" cy="50%" outerRadius={120}>
                                <PolarGrid stroke="#b47cff" />
                                <PolarAngleAxis dataKey="metric" stroke="#b47cff" tick={{ fontWeight: 600, fontSize: 15 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} stroke="#7c4dff" />
                                <Radar
                                    name={formData.team1}
                                    dataKey="value"
                                    stroke="#b47cff"
                                    fill="#7c4dff"
                                    fillOpacity={0.5}
                                />
                                <Tooltip content={<CustomTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{
                        p: 4,
                        background: 'linear-gradient(120deg, #232946 60%, #00bfae 100%)',
                        borderRadius: 4,
                        boxShadow: '0 4px 24px rgba(0,191,174,0.15)',
                        textAlign: 'center',
                    }}>
                        <Typography variant="h5" sx={{ mb: 2, color: '#00bfae', fontWeight: 'bold', letterSpacing: 1 }}>{formData.team2} Metrics</Typography>
                        <ResponsiveContainer width="100%" height={350}>
                            <RadarChart data={team2RadarData} cx="50%" cy="50%" outerRadius={120}>
                                <PolarGrid stroke="#5df2d6" />
                                <PolarAngleAxis dataKey="metric" stroke="#00bfae" tick={{ fontWeight: 600, fontSize: 15 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} stroke="#00bfae" />
                                <Radar
                                    name={formData.team2}
                                    dataKey="value"
                                    stroke="#00bfae"
                                    fill="#00bfae"
                                    fillOpacity={0.5}
                                />
                                <Tooltip content={<CustomTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Team Statistics Section */}
                <Grid item xs={12}>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#b47cff', letterSpacing: 1, textAlign: 'center' }}>
                        Team Statistics
                    </Typography>
                    <Grid container spacing={4}>
                        {/* Win Rate Comparison */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{
                                p: 3,
                                height: '100%',
                                background: 'linear-gradient(120deg, #232946 60%, #7c4dff 100%)',
                                boxShadow: '0 2px 8px rgba(124,77,255,0.10)',
                                borderRadius: 3
                            }}>
                                <Typography variant="h6" sx={{ mb: 2, color: '#b47cff', fontWeight: 600 }}>
                                    Win Rate Comparison
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={winRateData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#b47cff" />
                                        <XAxis dataKey="name" stroke="#b47cff" />
                                        <YAxis stroke="#b47cff" />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar dataKey="Win Rate" fill="#b47cff" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        {/* Head to Head Stats */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{
                                p: 3,
                                height: '100%',
                                background: 'linear-gradient(120deg, #232946 60%, #00bfae 100%)',
                                boxShadow: '0 2px 8px rgba(0,191,174,0.10)',
                                borderRadius: 3
                            }}>
                                <Typography variant="h6" sx={{ mb: 2, color: '#00bfae', fontWeight: 600 }}>
                                    Head to Head Statistics
                                </Typography>
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                                        <Pie
                                            data={h2hData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={{ stroke: '#666666', strokeWidth: 1 }}
                                            label={({
                                                cx,
                                                cy,
                                                midAngle,
                                                innerRadius,
                                                outerRadius,
                                                value,
                                                name,
                                                percent,
                                                index
                                            }) => {
                                                const RADIAN = Math.PI / 180;
                                                const radius = outerRadius + 50;
                                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                                const nameText = name;
                                                const statsText = `(${value} matches, ${(percent * 100).toFixed(0)}%)`;
                                                const color = COLORS[index % COLORS.length];
                                                return (
                                                    <g>
                                                        <text
                                                            x={x}
                                                            y={y - 10}
                                                            fill={color}
                                                            textAnchor={x > cx ? 'start' : 'end'}
                                                            dominantBaseline="central"
                                                            style={{ 
                                                                fontSize: '14px',
                                                                fontWeight: 'bold',
                                                                filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))'
                                                            }}
                                                        >
                                                            {nameText}
                                                        </text>
                                                        <text
                                                            x={x}
                                                            y={y + 10}
                                                            fill={color}
                                                            textAnchor={x > cx ? 'start' : 'end'}
                                                            dominantBaseline="central"
                                                            style={{ 
                                                                fontSize: '12px',
                                                                filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))'
                                                            }}
                                                        >
                                                            {statsText}
                                                        </text>
                                                    </g>
                                                );
                                            }}
                                            outerRadius={120}
                                            innerRadius={60}
                                            fill="#00bfae"
                                            dataKey="value"
                                            paddingAngle={2}
                                        >
                                            {h2hData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={COLORS[index % COLORS.length]}
                                                    stroke="#ffffff"
                                                    strokeWidth={2}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        {/* Match Statistics */}
                        <Grid item xs={12}>
                            <Paper sx={{
                                p: 3,
                                background: 'linear-gradient(120deg, #232946 60%, #7c4dff 100%)',
                                boxShadow: '0 2px 8px rgba(124,77,255,0.10)',
                                borderRadius: 3
                            }}>
                                <Typography variant="h6" sx={{ mb: 2, color: '#b47cff', fontWeight: 600 }}>
                                    Detailed Match Statistics
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={matchStatsData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#b47cff" />
                                        <XAxis dataKey="name" stroke="#b47cff" />
                                        <YAxis stroke="#b47cff" />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar dataKey="Total Matches" fill="#b47cff" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Match Wins" fill="#00bfae" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Toss Wins" fill="#ff9800" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analysis; 