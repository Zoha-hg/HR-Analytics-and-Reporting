import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Typography, Grid, Drawer, List, ListItem, ListItemText, Toolbar, Divider, Box, Avatar, ListItemButton} from '@mui/material';
import { Card, CardContent, CardActions, Button } from '@mui/material/';
import { LineChart } from '@mui/x-charts/LineChart';
import Company from './assets/logo.png'
import profile from './assets/profile.png'
import LogoutIcon from '@mui/icons-material/Logout';

import DashboardStyles from './DashboardStyles'; // Import the styles
import Logo from './assets/HR logo.png'; // Import logo image
import calendar from './assets/Clock.png'
import email from './assets/envelope.svg'
import feedback from './assets/Feedback.svg'
import employee from './assets/Employee.svg'
import reports from './assets/Turnover.svg'
import dashboard from './assets/Dashboard.svg'

import AdminDashboard from './Dashboards/AdminDashboard';
import HRProfessionalDashboard from './Dashboards/HRDashboard';
import EmployeeDashboard from './Dashboards/EmployeeDashboard';
import ManagerDashboard from './Dashboards/ManagerDashboard';

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
                <ListItem component={Link} to="/dashboard">
                    <ListItemText style={{ color: '#ffff', }} primary="MAIN MENU"/>
                </ListItem>
                <ListItemButton component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={dashboard} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Dashboard"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/employeeperformance">
                    <Box display="flex" alignItems="center">
                        <img src={employee} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Employee"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/feedbackform">
                    <Box display="flex" alignItems="center">
                        <img src={feedback} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Feedback Forms"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/turnover">
                    <Box display="flex" alignItems="center">
                        <img src={reports} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Turnover Reports"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/timetrack">
                    <Box display="flex" alignItems="center">
                        <img src={calendar} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Time Track"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/gmail">
                    <Box display="flex" alignItems="center">
                        <img src={email} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Email"/>
                    </Box>
                </ListItemButton>
            </List>
        );
      case 'hr professional':
        return (
            <List>
                <ListItem component={Link} to="/dashboard">
                    <ListItemText style={{ color: '#ffff', }} primary="MAIN MENU"/>
                </ListItem>
                <ListItemButton component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={dashboard} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Dashboard"/>
                    </Box>
                </ListItemButton>
                {/* <ListItem component={Link} to="/employeeperformance">
                    <Box display="flex" alignItems="center">
                        <img src={employee} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Employee"/>
                    </Box>
                </ListItem> */}
                <ListItem component={Link} to="/feedbackform">
                    <Box display="flex" alignItems="center">
                        <img src={feedback} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Feedback Forms"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/turnover">
                    <Box display="flex" alignItems="center">
                        <img src={reports} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Turnover Reports"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/timetrack">
                    <Box display="flex" alignItems="center">
                        <img src={calendar} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Time Track"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/gmail">
                    <Box display="flex" alignItems="center">
                        <img src={email} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Email"/>
                    </Box>
                </ListItem>
            </List>
        );
      case 'employee':
        return (
            <List>
                <ListItem component={Link} to="/dashboard">
                    <ListItemText style={{ color: '#ffff', }} primary="MAIN MENU"/>
                </ListItem>
                <ListItemButton component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={dashboard} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Dashboard"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/employees">
                    <Box display="flex" alignItems="center">
                        <img src={employee} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Employee"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/feedbackform">
                    <Box display="flex" alignItems="center">
                        <img src={feedback} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Feedback Forms"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/timetrack">
                    <Box display="flex" alignItems="center">
                        <img src={calendar} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Time Track"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/gmail">
                    <Box display="flex" alignItems="center">
                        <img src={email} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Email"/>
                    </Box>
                </ListItemButton>
            </List>
        );
      case 'manager':
        return (
            <List>
                <ListItem component={Link} to="/">
                    <ListItemText style={{ color: '#ffff', }} primary="MAIN MENU"/>
                </ListItem>
                <ListItem component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={dashboard} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Dashboard"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/employees">
                    <Box display="flex" alignItems="center">
                        <img src={employee} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Employee"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/feedbackform">
                    <Box display="flex" alignItems="center">
                        <img src={feedback} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Feedback Forms"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/turnover">
                    <Box display="flex" alignItems="center">
                        <img src={reports} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Turnover Reports"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/timetrack">
                    <Box display="flex" alignItems="center">
                        <img src={calendar} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Time Track"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/gmail">
                    <Box display="flex" alignItems="center">
                        <img src={email} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Email"/>
                    </Box>
                </ListItem>
            </List>
        );
      default:
        return null;
    }
  };

  const renderDashboardContent = () => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <AdminDashboard role={role}/>;
      case 'hr professional':
        return <HRProfessionalDashboard role={role}/>;
      case 'employee':
        return <EmployeeDashboard role={role}/>;
      case 'manager':
        return <ManagerDashboard role={role}/>;
      default:
        return null;
    }
  };

  return (
    <Grid container className={classes.container}>
      {/* Drawer */}
      {/* can also try left side margin/padding padding better. */}
      <Grid item xs={2.75} md={2} lg={1.5}> 
        <Drawer
            variant="permanent"
            anchor="left"
            open={drawerOpen}
            classes={{
            paper: classes.drawerPaper,
            }}
        >
            <List>
                <ListItem component={Link} to="/">
                    <Box display="flex" alignItems="center">
                    <img src={Logo} alt="Logo" style={{ width: 60, marginRight: 5 }} />
                    <ListItemText style={{ color: '#ffff', }} primary="Data Drive" />
                    </Box>
                </ListItem>
                {drawerContent()}
            </List>
            <List alignItems='flex-end'>
                <Divider />
                <ListItemButton component={Link} to="/">
                    <Box display="flex" alignItems="center">
                    <LogoutIcon style={{ color: '#ffff', marginRight: 10, marginLeft: 5}} />
                    <ListItemText style={{ color: '#ffff', }} primary="Log Out" />
                    </Box>
                </ListItemButton>
                <Divider />
            </List>
        </Drawer>
      </Grid>
      {/* Main content */}
      <Grid item xs={9.25} md={10} lg={10.5}>
        {renderDashboardContent()}
      </Grid>
    </Grid>
  );
};



export default Dashboard;