import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import useSkillRatingsChartStyles from './EmployeeAnalysisStyles'; // Import the styles

const SkillRatingsChart = () => {
  const classes = useSkillRatingsChartStyles();
  const [skillData, setSkillData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    axios.get('http://localhost:8000/employee-skill-averages', { headers })
      .then(response => {
        const skillNames = Object.keys(response.data);
        const skillAverages = skillNames.map(skill => response.data[skill].average);
        const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF', '#FF9F40'];
        
        setSkillData({
          labels: skillNames,
          datasets: [
            {
              label: 'Skill Averages',
              data: skillAverages,
              backgroundColor: backgroundColors.slice(0, skillNames.length),
            },
          ],
        });
      })
      .catch(error => {
        console.error('Error fetching skill averages:', error);
      });
  }, []);

  return (
    <Box className={classes.chartContainer}>
      {/* Use Typography for the title */}
      <Typography className={classes.title} align="center">
        Skill Ratings
      </Typography>
      {/* Doughnut chart component */}
      <Doughnut data={skillData} options={{ maintainAspectRatio: true }} />
    </Box>
    
  );
};

export default SkillRatingsChart;