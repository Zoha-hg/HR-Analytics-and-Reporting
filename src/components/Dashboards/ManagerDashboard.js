import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Grid, Toolbar, Divider, Box, Avatar, Paper} from '@mui/material';
import { Card, CardContent, CardActions, Button } from '@mui/material/';
import { LineChart } from '@mui/x-charts/LineChart';
import Company from '../assets/logo.png'
import profile from '../assets/profile.png'
import UnreadEmail from '../unreadGmail2'; 
import DashboardStyles from '../DashboardStyles';
import TimeTracker from '../TimeTrackingCard2';
import { Bar } from 'react-chartjs-2';


const ManagerDashboard = ({ role }) => {
  const classes = DashboardStyles();
  const [forms, setForms] = useState([]);
  const [username, setUsername] = useState('');
  const [numUnreadEmails, setNumUnreadEmails] = useState(0);
  const [userRole, setUserRole] = useState('');
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
        {
            label: 'Probability of Promotion',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
    ],
});

  useEffect(() => {
      const fetchUserRole = async () => { // gets user role
          const token = localStorage.getItem('token');
          try {
              const response = await axios.get('https://hr-analytics-and-reporting-production.up.railway.app/user-role', {
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
                const response = await axios.get('https://hr-analytics-and-reporting-production.up.railway.app/api/teamperformancereports/managers', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setChartData({
                    labels: response.data.team.map(report => report.employee_name),
                    datasets: [
                        {
                            label: 'Probability of Promotion',
                            data: response.data.team.map(report => report.probability),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching team performance reports:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }};
        fetchReports();

      
        const fetchUserName = async () => { // gets username aka employee id
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('https://hr-analytics-and-reporting-production.up.railway.app/user-name', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsername(response.data.username);
                return response.data.username;
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };

        const fetchTasks = async (manager_id) => { // gets department tasks for the manager
            let tasks_data = await axios.post("https://hr-analytics-and-reporting-production.up.railway.app/getdepttasks", { manager_id });

            setTasks(tasks_data.data);
            console.log(tasks_data.data);
            console.log("TASKS ", tasks);
        }

        const getEmployeeTasks = async (employee_id) => { // gets employees own tasks
            let tasks_data = await axios.post("https://hr-analytics-and-reporting-production.up.railway.app/getowntasks", { employee_id });
            console.log("employees", tasks_data.data);
            if(tasks_data.error === undefined) {
                setTasks(tasks_data.data);
                console.log("TASKS ", tasks_data.data);
            }
            console.log("yoooo");
        }
        
        const getData2 = async () => { // gets the tasks according to user role
            let user = await fetchUserName();
            console.log("user", user);
            let userrole = await fetchUserRole();
            setUserRole(userrole);
            console.log("role ", userRole);
            if(userrole == "Manager")
            {
                fetchTasks(user);
            }
            else if(userrole == "Employee")
            {
                console.log("woah");
                getEmployeeTasks(user);
            }
        }

        getData2();


        const fetchData = async (username, role) => {
            try {
                const response = await axios.post('https://hr-analytics-and-reporting-production.up.railway.app/displayforms', { user: username, user_role: role });
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

  const ongoingForms = forms.filter(form => new Date(form.start_time) <= new Date() && new Date(form.end_time) >= new Date()).slice(0, 2);
  const finishedForms = forms.filter(form => new Date(form.end_time) < new Date()).slice(0, 2);

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
        <Divider />
        {/* specific dashboard content. */}
        {/* first row and its grids. */}
        <Grid container className={classes.cards} rowSpacing={1} columnSpacing={1}>
          <Grid container className={classes.firstRow}>
            <Grid item className={classes.cardItem} lg={4}>
            <Link to="/employees" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card variant="outlined" sx={{ minWidth: 400, maxWidth: 400, maxHeight: 300, minHeight: 300 }}>
                    <CardContent>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', marginBottom: 1, color: '#03716C', fontFamily: 'Lexend' }}>
                            Department Tasks
                        </Typography>
                        {tasks.length !== 0 && (
                        tasks.map(task => {
                            let backgroundColor;
                            switch (task.evaluation_status) {
                            case 'completed':
                                backgroundColor = '#c3eded'; // green
                                break;
                            case 'pending':
                                backgroundColor = '#e8eff9'; // blue
                                break;
                            case 'evaluate':
                                backgroundColor = '#f9e8f0'; // pink
                                break;
                            default:
                                backgroundColor = '#FFFFFF'; // default white
                            }

                            return (
                            <Paper key={task.id} variant='outlined' elevation={8} sx={{ marginBottom: 2, backgroundColor }}>
                                <div>
                                <Typography variant="h7" component="div" sx={{ textAlign: 'center' }}>{task.title}</Typography>
                                <Typography variant="body2" component="div" sx={{ textAlign: 'center' }}>{task.evaluation_status}</Typography>
                                </div>
                            </Paper>
                            )
                        })
                        )}
                    </CardContent>
                </Card>
                </Link>
            </Grid>
            <Grid item className={classes.cardItem} lg={4}>
                <Link to="/turnover" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card variant="outlined" sx={{ minWidth: 400, maxWidth: 400, maxHeight: 300, minHeight: 300 }}>
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
            <Box className={classes.stack} sx={{ flexGrow: 0 }}>
              <Grid container direction={'column'}>
                <Grid item className={classes.cardItem}>
                    <Link to="/gmail" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Card variant="outlined" sx={{ minWidth: 400, maxWidth: 400, minHeight: 85, maxHeight: 85 }}>
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
                <Grid item className={classes.cardItem} lg={4}>
                    <TimeTracker/>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {/* second row and its grids. */}
          <Grid container className={classes.secondRow}>
            <Grid item className={classes.cardItem} lg={8}>
            <Link to="/turnover" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card variant="outlined" sx={{ minWidth: 816, maxWidth: 816, minHeight: 250 }}>
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
                    <Bar data={chartData} width={850} height={220}/>
                    </CardContent>
                </Card>
                </Link>
            </Grid>
            <Box flexGrow={0}>
              <Grid item className={classes.cardItem} lg={4}>
              <Link to="/feedbackform" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card variant="outlined" sx={{ minWidth: 400, maxWidth: 400, maxHeight: 300, minHeight: 300 }}>
                    <CardContent>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', marginBottom: 1, color: '#03716C', fontFamily: 'Lexend' }}>
                        Ongoing Feedback Forms
                        </Typography>
                        {ongoingForms.length === 0 ? ( // Check if there are no ongoing forms
                        <Typography variant="h7" component="div" sx={{ textAlign: 'center', marginBottom: 0 }}>
                            No Pending Forms!
                        </Typography>
                        ) : (
                        ongoingForms.map(form => (
                            <Paper key={form.form_id} className="form-card" onClick={() => handleGoToForm(form.form_id)}>
                            <div key={form.form_id}>
                                <Typography variant="h7" component="div" sx={{ textAlign: 'center' }}>
                                {form.title}
                                </Typography>
                                <Typography variant="body2" component="div" sx={{ textAlign: 'center', marginBottom: 0 }}>
                                Due: {formatDate(form.end_time)}
                                </Typography>
                                <Typography variant="body2" component="div" sx={{ textAlign: 'center', marginBottom: 0 }}>
                                Description: {form.description}
                                </Typography>
                            </div>
                            </Paper>
                        ))
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

export default ManagerDashboard;
