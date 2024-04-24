import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Paper, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';

const HRPerformanceReports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Probability of Promotion',
                data: [],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    });
    const [turnoverData, setTurnoverData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Turnover Probability',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    });

    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('https://hr-analytics-and-reporting-production.up.railway.app/api/performancereports', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fetchedReports = response.data.employees;
                setReports(fetchedReports);
                setChartData({
                    labels: fetchedReports.map(report => report.employee_name),
                    datasets: [
                        {
                            label: 'Probability of Promotion',
                            data: fetchedReports.map(report => report.probability),
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching performance reports:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };
        const fetchTurnoverData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('https://hr-analytics-and-reporting-production.up.railway.app/api/turnover', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fetchedTurnoverData = response.data.turnover;
                setTurnoverData({
                    labels: fetchedTurnoverData.map(report => report.employee_name),
                    datasets: [
                        {
                            label: 'Turnover Probability',
                            data: fetchedTurnoverData.map(report => report.probability),
                            backgroundColor: 'rgba(0, 113, 127, 0.5)',
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching turnover data:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchReports();
        fetchTurnoverData();
    }, [navigate]);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
            <Paper elevation={3} sx={{ mb: 2, p: 2, width: '100%', maxWidth: '800px' }}>
                <Typography variant="h6" align="center">Performance Chart</Typography>
                <Bar data={chartData} />
            </Paper>
            <Paper elevation={3} sx={{ p: 2, width: '100%', maxWidth: '800px' }}>
                <Typography variant="h6" align="center">Turnover Chart</Typography>
                <Bar data={turnoverData} />
            </Paper>
        </Box>
    );
};

export default HRPerformanceReports;
