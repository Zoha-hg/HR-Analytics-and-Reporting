import React, { useState, useEffect } from 'react';
import { Typography, Grid, Drawer, List, ListItem, ListItemText, Toolbar, Divider, Box, Avatar, ListItemButton} from '@mui/material';
import { Card, CardContent, CardActions, Button } from '@mui/material/';
import { Link, useLocation } from 'react-router-dom';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import DashboardStyles from './DashboardStyles'; // Import the styles
import Logo from './assets/HR logo.png'; // Import logo image
import Company from './assets/logo.png'
import calendar from './assets/calendar.png'
import email from './assets/email.svg'
import feedback from './assets/feedback.png'
import employee from './assets/employee.png'
import reports from './assets/reports.png'
import dashboard from './assets/dashboard.png'
import profile from './assets/profile.png'

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
                <ListItemButton component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={employee} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Employee"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={feedback} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Feedback Forms"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={reports} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Turnover Reports"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={calendar} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Calendar"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/dashboard">
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
                <ListItem component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={employee} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Employee"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={feedback} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Feedback Forms"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={reports} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Turnover Reports"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={calendar} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Calendar"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard">
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
                <ListItemButton component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={employee} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Employee"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={feedback} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Feedback Forms"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={calendar} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Calendar"/>
                    </Box>
                </ListItemButton>
                <ListItemButton component={Link} to="/dashboard">
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
                <ListItem component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={employee} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Employee"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={feedback} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Feedback Forms"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={reports} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Turnover Reports"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard">
                    <Box display="flex" alignItems="center">
                        <img src={calendar} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText style={{ color: '#ffff', }} primary="Calendar"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard">
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
                <ListItemButton component={Link} to="/">
                    <Box display="flex" alignItems="center">
                    {/* <img src={Logo} alt="Logo" style={{ width: 60, marginRight: 5 }} /> */}
                    <ListItemText style={{ color: '#ffff', }} primary="Log Out" />
                    </Box>
                </ListItemButton>
            </List>
            
        </Drawer>
      </Grid>
      {/* Main content */}
      <Grid item xs={9.25} md={10} lg={10.5}>
        <Box className={classes.mainContent}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <img src={Company} alt="Company Logo" style={{ width: 150}} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign:'right', marginRight:2 }}>
                {role} Dashboard
              </Typography>
            </Box>
            {/* Avatar */}
            <Divider orientation="vertical" flexItem/>
            <Avatar alt="Avatar" src={profile} sx={{marginLeft:2}}/>
          </Toolbar>
            <Divider/>
          {/* specific dashboard content. */}
          {/* first row and its grids. */}
            <Grid container className={classes.cards} rowSpacing={1} columnSpacing={1}>
                <Grid container className={classes.firstRow}>
                    {/* <Box flexGrow={1}> */}
                        <Grid item className={classes.cardItem}>
                            <Card variant='outlined' sx={{ minWidth: 450, minHeight: 305 }}>
                                <CardContent>
                                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign:'center', marginBottom:2 }}> 
                                        date, upcoming schedule, etc.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Learn More</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    {/* </Box> */}
                    <Grid item className={classes.cardItem}>
                        <Card variant='outlined' sx={{ minWidth: 450, minHeight: 305 }}>
                            <CardContent>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign:'center', marginBottom:2 }}>
                                    Turnover Reports
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Learn More</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Box className={classes.stack} sx={{ flexGrow: 1 }}>
                        <Grid container direction={'column'}>
                            <Grid item className={classes.cardItem}>
                                <Card variant='outlined' sx={{ minWidth: 100, minHeight: 40 }}>
                                    <CardContent>
                                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign:'center', marginBottom:0 }}>
                                            unread emails.
                                        </Typography>
                                    </CardContent>
                                    {/* <CardActions>
                                        <Button size="small">Learn More</Button>
                                    </CardActions> */}
                                </Card>
                            </Grid>
                            <Grid item className={classes.cardItem}>
                                <Card variant='outlined' sx={{ minWidth: 100, minHeight: 200 }}>
                                    <CardContent>
                                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign:'center', marginBottom:2 }}>
                                            calendar
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">Learn More</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                {/* second row and its grids. */}
                <Grid container className={classes.secondRow}>
                    {/* <Box flexGrow={1}> */}
                        <Grid item className={classes.cardItem}>
                            <Card variant='outlined' sx={{ minWidth: 932, minHeight: 250 }}>
                                <CardContent>
                                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign:'center', marginBottom:0 }}>
                                        performance chart.
                                    </Typography>
                                    <LineChart
                                        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                                        series={[
                                            {
                                            data: [2, 5.5, 2, 8.5, 1.5, 5],
                                            },
                                        ]}
                                        width={900}
                                        height={200}
                                        />
                                </CardContent>
                            </Card>
                        </Grid>
                    {/* </Box> */}
                    <Box flexGrow={1}>
                        <Grid item className={classes.cardItem}>
                            <Card variant='outlined' sx={{ minWidth: 20, minHeight: 250 }}>
                                <CardContent>
                                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign:'center', marginBottom:2 }}>
                                        feedback forms.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Learn More</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};



export default Dashboard;
