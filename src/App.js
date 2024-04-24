import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './UserContext';
// import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import useStyles from './components/homeStyles';
import theme from './CreateTheme'
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import CreateForm from './components/FeedbackForms/CreateForm';
import FillForm from './components/FeedbackForms/FillForm';
import DisplayForm from './components/FeedbackForms/DisplayForm';
import Dashboard from './components/Dashboard'; 
import DisplayResults from './components/FeedbackForms/DisplayFormResults';
import ManageEmployees from './components/EmployeesTasks/ManageEmployees';
import CreateNewTask from './components/EmployeesTasks/CreateNewTask'
import EvaluateTask from './components/EmployeesTasks/EvaluateTask';
import Sidebar from './components/sidebar';
import GmailIntegrate from './components/GmailIntegrate';
import GmailDashboard from './components/GmailDashboard';
import TimeTracker from './components/TimeTracker';
import Unread from './components/unreadGmail';
import PerformanceReports from './components/PerformanceReports';
import PerformanceReportsAndTurnover from './components/PerformanceReports';


function App() {
  // const classes = useStyles();

  return (
    <div>
    <CssBaseline />
    <ThemeProvider theme={theme}>
        <UserProvider>
          <div className="App">
            <Router>
            <div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<><Sidebar/><Dashboard /></>} />
                <Route path="/feedbackform" element={<><Sidebar/><DisplayForm /></>} />
                <Route path="/feedbackform/displayresults" element={<><Sidebar/><DisplayResults /></>} />
                <Route path="/feedbackform/createform" element={<><Sidebar/><CreateForm /></>} />
                <Route path="/feedbackform/fillform" element={<><Sidebar/><FillForm /></>} />
                <Route path="/employees" element={<><Sidebar/><ManageEmployees /></>} />
                <Route path="/employees/createtask" element={<><Sidebar/><CreateNewTask /></>} />
                <Route path="/employees/evaluatetask" element={<><Sidebar/><EvaluateTask /></>} />
                <Route path= "/gmail" element={<><Sidebar/><GmailIntegrate/></>} />
                <Route path= "/gmail-authorized" element={<><Sidebar/><GmailDashboard/></>} />
                {/* calendar ka naam change kar lena. */}
                <Route path= "/timetrack" element={<><Sidebar/><TimeTracker/></>} /> 
                <Route path="/unread" element={<><Sidebar/><Unread/></>}/>
                {/* make sure to change turnover and performance respectively*/}
                <Route path="/turnover" element={<><Sidebar/><PerformanceReportsAndTurnover/></>}/>
              </Routes>
            </div>
            </Router>
          </div>
        </UserProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
