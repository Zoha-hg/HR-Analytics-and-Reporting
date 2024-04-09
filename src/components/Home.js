import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Grid, Button } from '@mui/material';
import useStyles from './homeStyles'; // Import styles
import logo from './assets/HR logo.png'; // Import logo image
import BarAnimation from './BarAnimation'; // Import the BarAnimation component

const Home = () => {
  const classes = useStyles(); // Apply styles

  return (
    <Grid container spacing={3} className={classes.homeContainer}>
      {/* Header */}
      <Grid item xs={12} className={classes.header}>
        <img src={logo} alt="Logo" className={classes.logo} />
        <Typography variant="h6" className={classes.brandName}>Data Drive</Typography>
      </Grid>
      {/* Title and buttons */}
      <Grid item xs={12} sm={12} md={5} className={classes.leftContainer}>
        <Typography variant="h1" textAlign={'left'}>Welcome to HR Data Drive!</Typography>
        <Typography variant="h6" textAlign={'left'}>Your one-stop solution for HR analytics and reporting. Harness the power of data to optimize your workforce, improve decision-making, and drive success.</Typography>
        <Button component={Link} to="/signup" variant="contained" className={classes.signUpButton}
        sx="color: secondary; background-color: #fff; border-radius: 50px; padding: 0.5em 1em; margin-right: 1em; font-size: 1.5em; margin-top: 1em;"
        >
          Sign Up
        </Button>
        <Button component={Link} to="/login" variant="outlined" className={classes.loginButton}
        sx="color: #fff; border-radius: 50px; padding: 0.5em 1.25em; margin-right: 1em; font-size: 1.5em; margin-top: 1em;">
          Log In
        </Button>
      </Grid>
      {/* Graph */}
      <Grid item xs={12} sm={12} md={5} className={classes.rightContainer}>
        <BarAnimation/>
      </Grid>
      {/* Footer */}
      <Grid item xs={12}>
        <footer className={classes.footer}>
          <Typography>&copy; 2024 Data Drive</Typography>
          <nav>
            <Button component={Link} to="/">Home</Button>
            <Button component={Link} to="/">Contact</Button>
          </nav>
        </footer>
      </Grid>
    </Grid>
  );
};

export default Home;
