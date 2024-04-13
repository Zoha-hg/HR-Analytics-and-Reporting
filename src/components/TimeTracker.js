import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TimeTracker.css';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

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

const TimeTracker = () => {
    const [isTracking, setIsTracking] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timer, setTimer] = useState(null);
    const [timeLogId, setTimeLogId] = useState(null);
    const [totalTime, setTotalTime] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [progress, setProgress] = useState(0);
    const [graphData, setGraphData] = useState({});
    const options = {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Hour of the Day', // X-axis label
            },
            // If using Chart.js 3, you can set beginAtZero to true if you want the axis to start at 0
            beginAtZero: true,
          },
          y: {
            title: {
              display: true,
              text: 'Duration (minutes)', // Y-axis label
            },
            // If using Chart.js 3, you can set beginAtZero to true if you want the axis to start at 0
            beginAtZero: true,
          }
        },
        // Include other options as needed for your chart
      };
      

    useEffect(() => {
        fetchTotalTimeGraph(); // Fetch graph data for the current date
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

    const handleStart = async () => {
        try {
            const response = await axios.post('http://localhost:8000/start-time-log', {}, getAuthHeaders());
            setIsTracking(true);
            setTimeLogId(response.data._id);
            setStartTime(Date.now());
            setElapsedTime(0);
        } catch (error) {
            console.error('Error starting the timer:', error);
        }
    };

    const handleStop = async () => {
        if (!timeLogId) {
            console.error('No timeLogId set');
            return;
        }
        try {
            await axios.post('http://localhost:8000/stop-time-log', { timeLogId }, getAuthHeaders());
            setIsTracking(false);
            setTimeLogId(null);
            fetchTotalTimeGraph();
        } catch (error) {
            console.error('Error stopping the timer:', error);
        }
    };
    const fetchTotalTimeGraph = async () => {
        const url = `http://localhost:8000/total-time-graph`;
        try {
            const response = await axios.get(url, getAuthHeaders());
      
            // If durations are provided for each hour, generate labels 0 to 23
            if (response.data && response.data.durations) {
                // Convert durations from seconds to minutes
                const durationsInMinutes = response.data.durations.map(duration => duration / 60);
      
                const dataForGraph = {
                    labels: Array.from({ length: 24 }, (_, i) => i), // Generates labels [0, 1, 2, ..., 23]
                    datasets: [{
                        label: 'Total Time',
                        data: durationsInMinutes,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                };
                setGraphData(dataForGraph);
            } else {
                console.error('No time entries found for today:', response.data);
                setGraphData({}); // Clears graph area or shows a "no data" message
            }
        } catch (error) {
            console.error('Error fetching graph data:', error);
        }
      };
      
      
const fetchTotalTime = async (period = 'daily') => {
        let url = `http://localhost:8000/total-time/${selectedDate}`;
        if (period === 'weekly') {
            url = `http://localhost:8000/total-time-weekly/${selectedDate}`;
        } else if (period === 'monthly') {
            url = `http://localhost:8000/total-time-monthly/${selectedDate}`;
        }
        try {
            const response = await axios.get(url, getAuthHeaders());
            const duration = response.data.totalDurationInSeconds;
            const formattedTime = formatDuration(duration);
            setTotalTime(formattedTime);
        } catch (error) {
            console.error(`Error fetching total time for the ${period}:`, error);
        }
    };
    const fetchTotalTimeForDate = async (date) => {
        const url = `http://localhost:8000/total-time/${date}`;
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
            } else {
                console.error('No hourly data found for date:', date);
                setGraphData({});
            }
        } catch (error) {
            console.error(`Error fetching total time for date ${date}:`, error);
        }
      };

      const fetchTotalTimeGraphWeekly = async (date) => {
        const url = `http://localhost:8000/total-time-graph-weekly/${date}`;
        try {
          const response = await axios.get(url, getAuthHeaders());
          // Map durations to days of the week for the graph
          if (response.data && response.data.dailyDurations) {
            const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dataForGraph = {
              labels: labels,
              datasets: [{
                label: 'Total Time',
                data: response.data.dailyDurations,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
            };
            setGraphData(dataForGraph);
          } else {
            console.error('No data found for the week:', date);
            setGraphData({});
          }
        } catch (error) {
          console.error('Error fetching weekly graph data:', error);
        }
      };
      const fetchTotalTimeGraphMonthly = async (date) => {
        const url = `http://localhost:8000/total-time-graph-monthly/${date}`;
        try {
          const response = await axios.get(url, getAuthHeaders());
          // Map durations to days of the month for the graph
          if (response.data && response.data.dailyDurations) {
            const daysInMonth = response.data.dailyDurations.length;
            const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1); // Create labels for each day of the month
            const dataForGraph = {
              labels: labels,
              datasets: [{
                label: 'Total Time',
                data: response.data.dailyDurations,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
            };
            setGraphData(dataForGraph);
          } else {
            console.error('No data found for the month:', date);
            setGraphData({});
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

    const formatDuration = totalSeconds => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const size = 200;
    const strokeWidth = 6;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="time-tracker-container">
          <div className="timer">
            <svg width={size} height={size} className="timer-svg">
                <circle
                  className="timer-circle-bg"
                  cx={center}
                  cy={center}
                  r={radius}
                  strokeWidth={strokeWidth}
                />
                <circle
                  className="timer-circle-fg"
                  cx={center}
                  cy={center}
                  r={radius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
            </svg>
            <span>{formatElapsedTime(elapsedTime)}</span>
          </div>
          <button onClick={isTracking ? handleStop : handleStart} className="timer-button">
            {isTracking ? 'Stop' : 'Start'} Tracking
          </button>
          <div>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            <button onClick={() => fetchTotalTime('daily')}>Get Total Time for Date</button>
            <button onClick={() => fetchTotalTime('weekly')}>Get Total Time for Week</button>
            <button onClick={() => fetchTotalTime('monthly')}>Get Total Time for Month</button>
          </div>
          {totalTime && <p>Total Time Tracked: {totalTime}</p>}
          <div className="chart-container">
                {graphData.labels ? (
                    <Line data={graphData} options={options} />
                ) : (
                    <p>No graph data available.</p>
                )}
            </div>
        </div>
    );
};

export default TimeTracker;
