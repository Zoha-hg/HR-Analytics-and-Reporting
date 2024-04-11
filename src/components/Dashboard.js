import React, { useState, useEffect } from 'react';
import { Typography, Drawer, List, ListItem, ListItemText, Toolbar, AppBar, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import DashboardStyles from './DashboardStyles'; // Import the styles
import Logo from './assets/HR logo.png'; // Import logo image
import Company from './assets/logo.png'

const Dashboard = () => {
  const classes = DashboardStyles(); // Use the defined styles
  const [role, setRole] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(true); // Drawer is initially open
  const location = useLocation(); // Get current location to highlight active link

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/user-role', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        alert('Failed to fetch user role. Please log in again.');
        // Redirect to login page if role fetching fails
        window.location.href = '/login';
      }
    };

    fetchUserRole();
  }, []);

  // Define drawer content based on user role
  const drawerContent = () => {
    switch (role.toLowerCase()) {
      case 'admin':
        return (
          <List>
            <ListItem component={Link} to="/form">
              <ListItemText primary="Create a Form" />
            </ListItem>
            <ListItem component={Link} to="/fill">
              <ListItemText primary="Fill a Form" />
            </ListItem>
            <ListItem component={Link} to="/display">
              <ListItemText primary="Display Forms" />
            </ListItem>
          </List>
        );
      case 'hr professional':
        return (
          <List>
            <ListItem component={Link} to="/form">
              <ListItemText primary="Create a Form" />
            </ListItem>
            <ListItem component={Link} to="/display">
              <ListItemText primary="Display Forms" />
            </ListItem>
          </List>
        );
      case 'employee':
        return (
          <List>
            <ListItem component={Link} to="/fill">
              <ListItemText primary="Fill a Form" />
            </ListItem>
            <ListItem component={Link} to="/display">
              <ListItemText primary="Display Forms" />
            </ListItem>
          </List>
        );
      case 'manager':
        return (
          <List>
            <ListItem component={Link} to="/fill">
              <ListItemText primary="Fill a Form" />
            </ListItem>
            <ListItem component={Link} to="/display">
              <ListItemText primary="Display Forms" />
            </ListItem>
          </List>
        );
      default:
        return null;
    }
  };

  return (
    <Box className={classes.root} sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        anchor="left"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <List>
            <ListItem component={Link} to="/" className={classes.drawerItem}>
                <Box display="flex" alignItems="center">
                    <img src={Logo} alt="Logo" style={{ width: 60, marginRight: 5}} />
                    <ListItemText primary="Data Drive"/>
                </Box>
            </ListItem>
        </List>
        {drawerContent()}
      </Drawer>
      <Box component="main" className={classes.mainContent}>
        <Typography variant="h2">Welcome to the {role} Dashboard</Typography>
        {/* Your specific dashboard content goes here */}
      </Box>
    </Box>
  );
};

export default Dashboard;
