import React from 'react';
import SkillRatingsChart from './EmployeeAnalysis';
import { Box } from '@mui/material';
import useSkillRatingsChartStyles from './EmployeeAnalysisStyles'; // Import the styles

const SkillRatingsChartsContainer = () => {
  const classes = useSkillRatingsChartStyles();

  return (
    <Box className={classes.flexContainer}>
      <SkillRatingsChart className = {classes.borderedContainer}/>
      {/* <SkillRatingsChart />
      <SkillRatingsChart />
      <SkillRatingsChart />
      <SkillRatingsChart /> */}
      {/* Add more charts as needed */}
    </Box>
  );
};

export default SkillRatingsChartsContainer;
