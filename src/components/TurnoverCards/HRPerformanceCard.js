import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Paper, Typography, Card, CardContent } from '@mui/material';
import { Bar } from 'react-chartjs-2';

const HRPerformanceCard = () => {
    const navigate = useNavigate();
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

    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('https://hr-analytics-and-reporting-production.up.railway.app/api/performancereports', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fetchedReports = response.data.employees;
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

        fetchReports();
    }, [navigate]);

    return (
        <Card variant="outlined" sx={{ minWidth: 916, minHeight: 250 }}>
            <CardContent>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', marginBottom: 0, color: '#03716C', fontFamily: 'Lexend' }}>
                    Performance Chart
                </Typography>
                {/* <Box display="flex" justifyContent="center">
                    <Bar data={chartData} />
                </Box> */}
            </CardContent>
        </Card>
    );
};

export default HRPerformanceCard;
