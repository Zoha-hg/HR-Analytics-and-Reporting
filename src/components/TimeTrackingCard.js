import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import './TimeTracker.css';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import {Button, Typography, CircularProgress, Box } from '@mui/material/';
import { Card, CardContent } from '@mui/material/';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FULL_CIRCLE_SECONDS = 60;

const TimeTrackerCard = () => {
    const [isTracking, setIsTracking] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timer, setTimer] = useState(null);
    const [timeLogId, setTimeLogId] = useState(null);
    const [progress, setProgress] = useState(0);
    const [graphData, setGraphData] = useState({});
    const [currentPeriod, setCurrentPeriod] = useState('daily');
    const [totalTimeDisplay, setTotalTimeDisplay] = useState('');
    const [selectedDate, setSelectedDate] = useState(
        new Date().toLocaleDateString('en-CA') // 'en-CA' gives YYYY-MM-DD format
    );
    const [activeButton, setActiveButton] = useState(null);

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: currentPeriod === 'daily' ? 'Hour of the Day' :
                        currentPeriod === 'weekly' ? 'Day of the Week' :
                            'Day of the Month', // Change the label based on the current period
                },
                beginAtZero: true,
            },
            y: {
                title: {
                    display: true,
                    text: currentPeriod === 'daily' ? ' Duration (minutes)' :
                        'Duration (minutes)',
                },
                beginAtZero: true,
            }
        },
    };


    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        fetchTotalTimeForDate(selectedDate); // Fetch graph data for the current date
        setCurrentPeriod('daily');
    }, []);


    useEffect(() => {
        if (isTracking) {
            if (timer) clearInterval(timer);  // Clear any existing timer before creating a new one
            const interval = setInterval(() => {
                const now = Date.now();
                const secondsElapsed = Math.floor((now - startTime) / 1000);
                setElapsedTime(secondsElapsed);
                setProgress((secondsElapsed % FULL_CIRCLE_SECONDS) / FULL_CIRCLE_SECONDS * 100);
            }, 1000);
            setTimer(interval);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isTracking, startTime]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const handleDailyClick = () => {
        const selected = selectedDate;
        fetchTotalTimeForDate(selected);
        setCurrentPeriod('daily');
        setActiveButton('daily');
    };

    const handleWeeklyClick = () => {
        const selected = selectedDate;
        fetchTotalTimeGraphWeekly(selected);
        setCurrentPeriod('weekly');
        setActiveButton('weekly');
    };

    const handleMonthlyClick = () => {
        const selected = selectedDate;
        fetchTotalTimeGraphMonthly(selected);
        setCurrentPeriod('monthly');
        setActiveButton('monthly');
    };


    const handleStart = async () => {
        try {
            const response = await axios.post('https://hr-analytics-and-reporting-production.up.railway.app/start-time-log', {}, getAuthHeaders());
            setIsTracking(true);
            setTimeLogId(response.data._id);
            setStartTime(Date.now());
            setElapsedTime(0);
        } catch (error) {
            console.error('Error starting the timer:', error);
        }
    };


    function formatDuration(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        // Create an array of the time components
        const timeComponents = [
            hours, minutes, seconds
        ].map(val => val < 10 ? `0${val}` : val.toString()); // Pad with leading zeros if necessary

        // Construct the formatted time string
        let formattedTime = timeComponents.join(':');

        // Remove the hours component if it's "00"
        if (formattedTime.startsWith('00:')) {
            formattedTime = formattedTime.substring(3);
        }

        return formattedTime;
    }

    const handleStop = async () => {
        if (!timeLogId) {
            console.error('No timeLogId set');
            return;
        }
        try {
            await axios.post('https://hr-analytics-and-reporting-production.up.railway.app/stop-time-log', { timeLogId }, getAuthHeaders());
            setIsTracking(false);
            setTimeLogId(null);
            if (currentPeriod === 'daily') {
                fetchTotalTimeForDate(selectedDate);
            } else if (currentPeriod === 'weekly') {
                fetchTotalTimeGraphWeekly(selectedDate);
            } else if (currentPeriod === 'monthly') {
                fetchTotalTimeGraphMonthly(selectedDate);
            }
        } catch (error) {
            console.error('Error stopping the timer:', error);
        }
    };

    const fetchTotalTimeForDate
    = async (date) => {
        const url = `https://hr-analytics-and-reporting-production.up.railway.app/total-time-graph/${date}`;
        try {
            const response = await axios.get(url, getAuthHeaders());

            if (response.data && response.data.hourlyDurations) {
                const dataForGraph = {
                    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), // Labels for each hour of the day
                    datasets: [{
                        label: 'Total Time',
                        data: response.data.hourlyDurations,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                };
                setGraphData(dataForGraph); // Update state to trigger re-render
                const totalDurationInSeconds = response.data.dailyDurations.reduce((sum, current) => sum + current, 0);
                setTotalTimeDisplay(formatDuration(totalDurationInSeconds));
            } else {
                console.error('No hourly data found for date:', date);
                setGraphData({});
            }
        } catch (error) {
            console.error(`Error fetching total time for date ${date}:`, error);
        }
    };

    const fetchTotalTimeGraphWeekly = async (date) => {
        const url = `https://hr-analytics-and-reporting-production.up.railway.app/total-time-graph-weekly/${date}`;
        try {
            const response = await axios.get(url, getAuthHeaders());
            // Map durations to days of the week for the graph
            if (response.data && response.data.dailyDurations) {
                const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                // Convert duration from seconds to minutes
                const durationsInMinutes = response.data.dailyDurations.map(duration => duration);
                const dataForGraph = {
                    labels: labels,
                    datasets: [{
                        label: 'Total Time',
                        data: durationsInMinutes,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                };
                setGraphData(dataForGraph);
                const totalDurationInSeconds = response.data.dailyDurations.reduce((sum, current) => sum + current, 0);
                setTotalTimeDisplay(formatDuration(totalDurationInSeconds)); // Keep in mind to format the display correctly
            } else {
                console.error('No data found for the week:', date);
                setGraphData({});
            }
        } catch (error) {
            console.error('Error fetching weekly graph data:', error);
        }
    };

    const fetchTotalTimeGraphMonthly = async (date) => {
        const url = `https://hr-analytics-and-reporting-production.up.railway.app/total-time-graph-monthly/${date}`;
        try {
            const response = await axios.get(url, getAuthHeaders());
            // Map durations to days of the month for the graph
            if (response.data && response.data.dailyDurations) {
                const daysInMonth = response.data.dailyDurations.length;
                const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1); // Create labels for each day of the month
                // Convert durations from seconds to hours
                const durationsInHours = response.data.dailyDurations.map(duration => duration);
                const dataForGraph = {
                    labels: labels,
                    datasets: [{
                        label: 'Total Time',
                        data: durationsInHours,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                };
                setGraphData(dataForGraph);
                const totalDurationInSeconds = response.data.dailyDurations.reduce((sum, current) => sum + (current * 3600), 0);
                setTotalTimeDisplay(formatDuration(totalDurationInSeconds));
            } else {
                console.error('No data found for the month:', date);
                setGraphData({}); // Clears graph area or shows a "no data" message
            }
        } catch (error) {
            console.error('Error fetching monthly graph data:', error);
        }
    };

    const formatElapsedTime = elapsedTime => {
        const totalSeconds = Math.floor(elapsedTime);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };


    const size = 300;
    const strokeWidth = 6;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <Card
            variant="outlined"
            sx={{ minWidth: 400, maxWidth: 400, minHeight: 305, maxHeight: 305 }}
            onClick={(e) => {
            // Prevent card click event from propagating when the button is clicked
            e.stopPropagation();
            }}
        >
            <CardContent>
            <Link to="/calendar" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
                variant="h6"
                component="div"
                sx={{
                flexGrow: 1,
                textAlign: 'center',
                marginBottom: 1,
                color: '#03716C',
                fontFamily: 'Lexend',
                }}
            >
                Time tracking
            </Typography>
            </Link>
            <Box style={{ textAlign: 'center' }}>
                <Typography variant="h6" style={{ color: '#333', marginBottom: 2 }}>
                Time Elapsed: {formatElapsedTime(elapsedTime)}
                </Typography>
                <Box style={{ position: 'relative' }}>
                <CircularProgress variant="determinate" value={progress} size={100} sx={{ marginTop: 2 }} />
                <Box style={{}}>
                    <Button
                    onClick={isTracking ? handleStop : handleStart}
                    variant="contained"
                    color={isTracking ? 'primary' : 'primary'}
                    sx={{ marginTop: 2 }}
                    >
                    {isTracking ? 'Stop Tracking' : 'Start Tracking'}
                    </Button>
                </Box>
                </Box>
            </Box>
            </CardContent>
        </Card>
    );
};

export default TimeTrackerCard;
