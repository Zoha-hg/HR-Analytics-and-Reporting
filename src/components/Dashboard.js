import React, { useState, useEffect } from 'react';
import { Typography, Grid, Drawer, List, ListItem, ListItemText, Toolbar, Divider, Box, Avatar} from '@mui/material';
import { Card, CardContent, CardActions, Button } from '@mui/material/';
import { Link, useLocation } from 'react-router-dom';
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
                <ListItem component={Link} to="/" className={classes.drawerItem}>
                    <ListItemText primary="MAIN MENU"/>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={dashboard} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Dashboard"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={employee} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Employee"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={feedback} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Feedback Forms"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={reports} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Turnover Reports"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={calendar} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Calendar"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={email} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Email"/>
                    </Box>
                </ListItem>
            </List>
        //   <List>
        //     <ListItem component={Link} to="/form" className={classes.drawerItem}>
        //       <ListItemText primary="Create a Form" />
        //     </ListItem>
        //     <ListItem component={Link} to="/fill" className={classes.drawerItem}>
        //       <ListItemText primary="Fill a Form" />
        //     </ListItem>
        //     <ListItem component={Link} to="/display" className={classes.drawerItem}>
        //       <ListItemText primary="Display Forms" />
        //     </ListItem>
        //   </List>
        );
      case 'hr professional':
        return (
            <List>
                <ListItem component={Link} to="/" className={classes.drawerItem}>
                    <ListItemText primary="MAIN MENU"/>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={dashboard} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Dashboard"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={employee} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Employee"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={feedback} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Feedback Forms"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={reports} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Turnover Reports"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={calendar} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Calendar"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={email} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Email"/>
                    </Box>
                </ListItem>
            </List>
        //   <List>
        //     <ListItem component={Link} to="/form" className={classes.drawerItem}>
        //       <ListItemText primary="Create a Form" />
        //     </ListItem>
        //     <ListItem component={Link} to="/display" className={classes.drawerItem}>
        //       <ListItemText primary="Display Forms" />
        //     </ListItem>
        //   </List>
        );
      case 'employee':
        return (
            <List>
                <ListItem component={Link} to="/" className={classes.drawerItem}>
                    <ListItemText primary="MAIN MENU"/>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={dashboard} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Dashboard"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={employee} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Employee"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={feedback} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Feedback Forms"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={calendar} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Calendar"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={email} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Email"/>
                    </Box>
                </ListItem>
            </List>
        //   <List>
        //     <ListItem component={Link} to="/fill" className={classes.drawerItem}>
        //       <ListItemText primary="Fill a Form" />
        //     </ListItem>
        //     <ListItem component={Link} to="/display" className={classes.drawerItem}>
        //       <ListItemText primary="Display Forms" />
        //     </ListItem>
        //   </List>
        );
      case 'manager':
        return (
            <List>
                <ListItem component={Link} to="/" className={classes.drawerItem}>
                    <ListItemText primary="MAIN MENU"/>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={dashboard} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Dashboard"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={employee} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Employee"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={feedback} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Feedback Forms"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={reports} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Turnover Reports"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={calendar} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Calendar"/>
                    </Box>
                </ListItem>
                <ListItem component={Link} to="/dashboard" className={classes.drawerItem}>
                    <Box display="flex" alignItems="center">
                        <img src={email} alt="Logo" style={{ width: 20, marginRight: 25, marginLeft:15}} />
                        <ListItemText primary="Email"/>
                    </Box>
                </ListItem>
            </List>
        //   <List>
        //     <ListItem component={Link} to="/fill" className={classes.drawerItem}>
        //       <ListItemText primary="Fill a Form" />
        //     </ListItem>
        //     <ListItem component={Link} to="/display" className={classes.drawerItem}>
        //       <ListItemText primary="Display Forms" />
        //     </ListItem>
        //   </List>
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
            <ListItem component={Link} to="/" className={classes.drawerItem}>
                <Box display="flex" alignItems="center">
                <img src={Logo} alt="Logo" style={{ width: 60, marginRight: 5 }} />
                <ListItemText primary="Data Drive" />
                </Box>
            </ListItem>
            </List>
            {drawerContent()}
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
                    <Grid item className={classes.cardItem}>
                        <Card variant='outlined' sx={{ minWidth: 450, minHeight: 300 }}>
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
                    <Grid item className={classes.cardItem}>
                        <Card variant='outlined' sx={{ minWidth: 450, minHeight: 300 }}>
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
                                <Card variant='outlined' sx={{ minWidth: 100, minHeight: 100 }}>
                                    <CardContent>
                                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign:'center', marginBottom:2 }}>
                                            unread emails.
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">Learn More</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                            <Grid item className={classes.cardItem}>
                                <Card variant='outlined' sx={{ minWidth: 100, minHeight: 100 }}>
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
                    <Grid item className={classes.cardItem}>
                        <Card variant='outlined' sx={{ minWidth: 900, minHeight: 250 }}>
                            <CardContent>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign:'center', marginBottom:2 }}>
                                    performance chart.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Learn More</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item className={classes.cardItem}>
                        <Card variant='outlined' sx={{ minWidth: 400, minHeight: 250 }}>
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
                </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};



export default Dashboard;
