import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Paper, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import useStyles from './ManagerPerformanceReportStyles'; // make sure you have this file for styles

const ManagerPerformanceReports = () => {
    const navigate = useNavigate();
    const classes = useStyles();
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Probability of Promotion',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('https://hr-analytics-and-reporting-production.up.railway.app/api/teamperformancereports/managers', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setChartData({
                    labels: response.data.team.map(report => report.employee_name),
                    datasets: [
                        {
                            label: 'Probability of Promotion',
                            data: response.data.team.map(report => report.probability),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching team performance reports:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchReports();
    }, [navigate]);

    return (
        <Box className={classes.root}>
            <Paper className={classes.paper} elevation={3}>
                <Typography variant="h6" align="center">Team's Performance Chart</Typography>
                <Bar data={chartData} options={{ responsive: true, scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }} />
            </Paper>
        </Box>
    );
};

export default ManagerPerformanceReports;
