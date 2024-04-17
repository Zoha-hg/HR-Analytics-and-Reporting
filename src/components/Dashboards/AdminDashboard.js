import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Typography, Grid, Toolbar, Divider, Box, Avatar} from '@mui/material';
import axios from 'axios';
import { Card, CardContent, CardActions, Button } from '@mui/material/';
import { LineChart } from '@mui/x-charts/LineChart';
import Company from '../assets/logo.png';
import profile from '../assets/profile.png';
import DashboardStyles from '../DashboardStyles';

const AdminDashboard = ({ role }) => {
  const classes = DashboardStyles(); // Apply styles
  const [feedbackForms, setFeedbackForms] = useState([]);

  // Fetch feedback forms data
  useEffect(() => {
    // Fetch feedback forms data from an API or other source
    const fetchData = async () => {
      try {
        // Example API call
        const response = await fetch('https://api.example.com/feedback-forms');
        const data = await response.json();
        setFeedbackForms(data);
      } catch (error) {
        console.error('Error fetching feedback forms:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container>
      <Box className={classes.mainContent}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img src={Company} alt="Company Logo" style={{ width: 150 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'right', marginRight: 2 }}>
              {role} Dashboard
            </Typography>
          </Box>
          {/* Avatar */}
          <Divider orientation="vertical" flexItem />
          <Avatar alt="Avatar" src={profile} sx={{ marginLeft: 2 }} />
        </Toolbar>
        <Divider />
        {/* specific dashboard content. */}
        {/* first row and its grids. */}
        <Grid container className={classes.cards} rowSpacing={1} columnSpacing={1}>
          <Grid container className={classes.firstRow}>
            <Grid item className={classes.cardItem}>
                <Link to="/employeeperformance" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card variant="outlined" sx={{ minWidth: 450, minHeight: 305 }}>
                    <CardContent>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', marginBottom: 2 }}>
                        date, upcoming schedule, etc.
                    </Typography>
                    </CardContent>
                    <CardActions>
                    <Button size="small">Learn More</Button>
                    </CardActions>
                </Card>
                </Link>
            </Grid>
            <Grid item className={classes.cardItem}>
                <Link to="/turnover" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card variant="outlined" sx={{ minWidth: 450, minHeight: 305 }}>
                    <CardContent>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', marginBottom: 2 }}>
                        Turnover Reports
                    </Typography>
                    </CardContent>
                    <CardActions>
                    <Button size="small">Learn More</Button>
                    </CardActions>
                </Card>
                </Link>
            </Grid>
            <Box className={classes.stack} sx={{ flexGrow: 1 }}>
              <Grid container direction={'column'}>
                <Grid item className={classes.cardItem}>
                    <Link to="/gmail" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Card variant="outlined" sx={{ minWidth: 100, minHeight: 40 }}>
                        <CardContent>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', marginBottom: 0 }}>
                            unread emails.
                        </Typography>
                        </CardContent>
                    </Card>
                    </Link>
                </Grid>
                <Grid item className={classes.cardItem}>
                    <Link to="/timetrack" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Card variant="outlined" sx={{ minWidth: 100, minHeight: 200 }}>
                        <CardContent>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', marginBottom: 2 }}>
                            Time tracking.
                        </Typography>
                        </CardContent>
                    </Card>
                    </Link>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {/* second row and its grids. */}
          <Grid container className={classes.secondRow}>
            <Grid item className={classes.cardItem}>
                <Link to="/turnover" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card variant="outlined" sx={{ minWidth: 932, minHeight: 250 }}>
                    <CardContent>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', marginBottom: 0 }}>
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
                </Link>
            </Grid>
            <Box flexGrow={1}>
              <Grid item className={classes.cardItem}>
                <Link to="/feedbackform" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card variant="outlined" sx={{ minWidth: 20, minHeight: 250 }}>
                    <CardContent>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', marginBottom: 2 }}>
                        Feedback Forms
                        </Typography>
                    </CardContent>
                </Card>
                </Link>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default AdminDashboard;
