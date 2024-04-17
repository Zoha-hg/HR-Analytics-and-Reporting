import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Typography, Grid, Toolbar, Divider, Box, Paper} from '@mui/material';
import { Card, CardContent, CardActions, Button } from '@mui/material/';
import { LineChart } from '@mui/x-charts/LineChart';
import Company from '../assets/logo.png';
import profile from '../assets/profile.png';
import DashboardStyles from '../DashboardStyles';
import UnreadEmail from '../unreadGmail';
import TimeTracker from '../TimeTrackingCard';
import { Bar } from 'react-chartjs-2';


const HRProfessionalDashboard = ({ role }) => {
    const classes = DashboardStyles();
    const [forms, setForms] = useState([]);
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState('');
    const [numUnreadEmails, setNumUnreadEmails] = useState(0);
    const navigate = useNavigate();
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Probability of Promotion',
                data: [],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    });
    const [topThreeEmployees, setTopThreeEmployees] = useState([]);

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8000/user-role', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserRole(response.data.role);
                return response.data.role;
            } catch (error) {
                console.error('Error fetching user role:', error);
                alert('Failed to fetch user role. Please log in again.');
                navigate('/login');
            }
        };
        const fetchReports = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8000/api/performancereports', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fetchedReports = response.data.employees;
                // console.log(fetchedReports);
                setChartData({
                    labels: fetchedReports.map(report => report.employee_name),
                    datasets: [
                        {
                            label: 'Probability of Promotion',
                            data: fetchedReports.map(report => report.probability),
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        },
                    ],
                });

                const response2 = await axios.get('http://localhost:8000/api/turnover', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fetchedTurnoverData = response2.data.turnover;
                // console.log(fetchedTurnoverData);
                const sortedReports = [...fetchedTurnoverData].sort((a, b) => b.probability - a.probability);
    

                const topThreeReports = sortedReports.slice(0, 3);
                setTopThreeEmployees(topThreeReports.map(report => ({
                    name: report.employee_name,
                    // Convert to number if it's a string and then use toFixed
                    probability: typeof report.probability === 'number' 
                        ? report.probability.toFixed(2) 
                        : parseFloat((report.probability)*100).toFixed(2)
                })));



                console.log(topThreeEmployees);
    
            } catch (error) {
                console.error('Error fetching performance reports:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };
        // const fetchReports = async () => {
        //     const token = localStorage.getItem('token');
        //     try {
        //         const response = await axios.get('http://localhost:8000/api/performancereports', {
        //             headers: { Authorization: `Bearer ${token}` },
        //         });
        //         const fetchedReports = response.data.employees;
        //         setChartData({
        //             labels: fetchedReports.map(report => report.employee_name),
        //             datasets: [
        //                 {
        //                     label: 'Probability of Promotion',
        //                     data: fetchedReports.map(report => report.probability),
        //                     backgroundColor: 'rgba(53, 162, 235, 0.5)',
        //                 },
        //             ],
        //         });
        //     } catch (error) {
        //         console.error('Error fetching performance reports:', error);
        //         if (error.response && error.response.status === 401) {
        //             navigate('/login');
        //         }
        //     }
        // };
        fetchReports();
        // const findHighestTurnoverProbabilties = async () => {
        //     // Creating a list of the 3 most likely to turnover employees based on probabilities
        //     const token = localStorage.getItem('token');
        //     try {
        //         const response = await axios.get('http://localhost:8000/api/performancereports', {
        //             headers: { Authorization: `Bearer ${token}` },
        //         });
        //         const fetchedReports = response.data.employees;
                
        //     } catch (error) {
        //         console.error('Error fetching performance reports:', error);
        //         if (error.response && error.response.status === 401) {
        //             navigate('/login');
        //         }
        //     }
        // };
        const fetchUserName = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8000/user-name', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsername(response.data.username);
                return response.data.username;
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };

        const fetchData = async (username, role) => {
            try {
                const response = await axios.post('http://localhost:8000/displayforms', { user: username, user_role: role });
                setForms(response.data);
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
        };

        const getData = async () => {
            let role = await fetchUserRole();
            let username = await fetchUserName();
            fetchData(username, role);
        }

        getData();
    }, []);

    const handleGoToForm = async (form_id) => {
        if (userRole === "Employee" || userRole === "Manager") {
            window.location.href = '/feedbackform/fillform/?feedback_id=' + form_id;
        } else {
            window.location.href = '/feedbackform/displayresults/?form_id=' + form_id;
        }
    }

    const formatDate = (date) => {
        const year = date.split('-')[0];
        const month = date.split('-')[1];
        const day = date.split('-')[2].split('T')[0]
        return day + "/" + month + "/" + year;
    }

    const handleUnreadEmailCount = (count) => {
        setNumUnreadEmails(count);
    }

    const ongoingForms = forms.filter(form => new Date(form.start_time) <= new Date() && new Date(form.end_time) >= new Date())
    const finishedForms = forms.filter(form => new Date(form.end_time) < new Date())

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
        </Toolbar>
        <Divider/>
        {/* specific dashboard content. */}
        {/* first row and its grids. */}
        <Grid container className={classes.cards} rowSpacing={1} columnSpacing={1}>
          <Grid container className={classes.firstRow}>
            <Grid item className={classes.cardItem}>
            <Link to="/gmail" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card variant="outlined" sx={{ minWidth: 450, maxWidth: 450, minHeight: 305, maxHeight: 305, overflow: 'hidden', paddingBottom:2 }}>
                    <CardContent>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', marginBottom: 2, color: '#03716C', fontFamily: 'Lexend' }}>
                            You have {numUnreadEmails} unread messages.
                        </Typography>
                        <div style={{ maxHeight: 305, overflowY: 'auto', scrollbarWidth: 'none', WebkitScrollbar: 'none', paddingBottom:100 }}>
                            <Grid container>
                                <UnreadEmail handleUnreadEmailCount={handleUnreadEmailCount}/>
                            </Grid>
                        </div>
                    </CardContent>
                </Card>
            </Link>
            </Grid>
            <Grid item className={classes.cardItem}>
                <Link to="/turnover" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Card variant="outlined" sx={{ minWidth: 450, minHeight: 305 }}>
                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', marginBottom: 2, color: '#03716C', fontFamily: 'Lexend' }}>
                                Turnover Reports
                            </Typography>
                            {/* Here we map over the topThreeEmployees state to display the data */}
                            {topThreeEmployees.map((employee, index) => (
                                <Typography key={index}>
                                    {index + 1}. {employee.name} - {employee.probability}%
                                </Typography>
                            ))}
                        </CardContent>
                        <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>
                </Link>
            </Grid>
            <Box className={classes.stack} sx={{ flexGrow: 0 }}>
              <Grid container direction={'column'}>
                <Grid item className={classes.cardItem}>
                    <TimeTracker/>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {/* second row and its grids. */}
          <Grid container className={classes.secondRow}>
            <Grid item className={classes.cardItem}>
                <Link to="/turnover" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card variant="outlined" sx={{ minWidth: 916, minHeight: 250 }}>
                    <CardContent>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', marginBottom: 0, color: '#03716C', fontFamily: 'Lexend' }}>
                        Performance Chart
                    </Typography>
                    {/* <LineChart
                        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                        series={[
                        {
                            data: [2, 5.5, 2, 8.5, 1.5, 5],
                        },
                        ]}
                        width={850}
                        height={220}
                    /> */}
                    {/* <Box display="flex" flexDirection="column" alignItems="center" p={2}>
                        <Paper elevation={3} sx={{ mb: 2, p: 2, width: '100%', maxWidth: '800px' }}>
                            <Typography variant="h6" align="center">Performance Chart</Typography>
                            <Bar data={chartData} />
                        </Paper>
                    </Box> */}
                    <Bar data={chartData} width={850} height={220}/>
                    </CardContent>
                </Card>
                </Link>
            </Grid>
            <Box flexGrow={1}>
              <Grid item className={classes.cardItem}>
              <Link to="/feedbackform" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Card variant="outlined" sx={{ maxWidth: 453, minHeight: 295, maxHeight: 295 }}>
                        <CardContent> {/* Ensure no padding at the bottom */}
                            <Typography variant="h6" component="div" sx={{ textAlign: 'center', marginBottom: 1, color: '#03716C', fontFamily: 'Lexend' }}>
                                Ongoing Feedback Forms
                            </Typography>
                            {ongoingForms.length === 0 ? (
                                <Typography variant="body1" component="div" sx={{ textAlign: 'center' }}>
                                    No Pending Forms
                                </Typography>
                            ) : (
                                <div style={{ maxHeight: 230, overflowY: 'auto', scrollbarWidth: 'none', WebkitScrollbar: 'none' }}>
                                    {ongoingForms.map(form => (
                                        <Paper key={form.form_id} className="form-card" onClick={() => handleGoToForm(form.form_id)}>
                                            <div>
                                                <Typography variant="body1" component="div" sx={{ textAlign: 'center' }}>
                                                    {form.title}
                                                </Typography>
                                                <Typography variant="body2" component="div" sx={{ textAlign: 'center' }}>
                                                    Due: {formatDate(form.end_time)}
                                                </Typography>
                                                <Typography variant="body2" component="div" sx={{ textAlign: 'center' }}>
                                                    Description: {form.description}
                                                </Typography>
                                            </div>
                                        </Paper>
                                    ))}
                                </div>
                            )}
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

export default HRProfessionalDashboard;
