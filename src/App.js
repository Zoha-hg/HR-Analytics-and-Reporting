import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './UserContext';
// import './App.css';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import CreateForm from './components/CreateForm';
import FillForm from './components/FillForm';
import DisplayForm from './components/DisplayForm';
import Dashboard from './components/Dashboard'; 
import GmailIntegrate from './components/GmailIntegrate';
import GmailDashboard from './components/GmailDashboard';
import Sidebar from './components/sidebar';
import TimeTracker from './components/TimeTracker';
import Unread from './components/unreadGmail';


function App() {
  return (
    <UserProvider>
      <div className="App">
        <Router>
        <div>
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/form" element={<CreateForm />} />
            <Route path="/feedbackform/fillform" element={<FillForm />} />
            <Route path="/display" element={<DisplayForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path= "/gmail" element={<GmailIntegrate/>} />
            <Route path= "/gmail-authorized" element={<GmailDashboard/>} />
            <Route path= "/calendar" element={<TimeTracker/>} />
            <Route path="/unread" element={<Unread/>}/>
            </Routes>
        </div>
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;
