import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TimeTracker.css';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement, // This was missing and is necessary for line charts
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

    useEffect(() => {
        if (isTracking) {
            if (timer) clearInterval(timer);  // Clear any existing timer before creating a new one
            const interval = setInterval(() => {
                const now = Date.now();
                const secondsElapsed = Math.floor((now - startTime) / 1000);
                setElapsedTime(secondsElapsed);
                const progressPercentage = (secondsElapsed % FULL_CIRCLE_SECONDS) / FULL_CIRCLE_SECONDS;
                setProgress(progressPercentage * 100);
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
        } catch (error) {
            console.error('Error stopping the timer:', error);
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
            if(response.data.timeEntries) {
              const dataForGraph = {
                labels: response.data.timeEntries.map(entry => entry.date),
                datasets: [{
                  label: 'Total Time',
                  data: response.data.timeEntries.map(entry => entry.duration),
                  fill: false,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
                }]
              };
              setGraphData(dataForGraph);
            } else {
              // Handle the case where timeEntries is not present or not an array
              console.error('timeEntries is not an array or not present in the response:', response.data);
            }
          } catch (error) {
            console.error(`Error fetching total time for the ${period}:`, error);
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
          {graphData.labels && (
      <div className="chart-container">
        <Line data={graphData} options={{ responsive: true }} />
      </div>
    )}
        </div>
    );
};

export default TimeTracker;
