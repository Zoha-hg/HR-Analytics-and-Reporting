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
              <Sidebar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/feedbackform" element={<DisplayForm />} />
                <Route path="/feedbackform/displayresults" element={<DisplayResults />} />
                <Route path="/feedbackform/createform" element={<CreateForm />} />
                <Route path="/feedbackform/fillform" element={<FillForm />} />
                <Route path="/employees" element={<ManageEmployees />} />
                <Route path="/employees/createtask" element={<CreateNewTask />} />
                <Route path="/employees/evaluatetask" element={<EvaluateTask />} />
                <Route path= "/gmail" element={<GmailIntegrate/>} />
                <Route path= "/gmail-authorized" element={<GmailDashboard/>} />
                {/* calendar ka naam change kar lena. */}
                <Route path= "/calendar" element={<TimeTracker/>} /> 
                <Route path="/unread" element={<Unread/>}/>
                {/* make sure to change turnover and performance respectively*/}
                <Route path="/turnover" element={<PerformanceReports/>}/>
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
