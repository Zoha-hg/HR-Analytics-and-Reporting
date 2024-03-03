import React from 'react';
import './App.css';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import GmailIntegrate from './components/GmailIntegrate';
import Gmail from './components/Gmail';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path= "/integrate-gmail" 
            element={
            <ProtectedRoute>
              <GmailIntegrate/>
            </ProtectedRoute>
          } 
          />
          <Route 
            path= "/gmail" 
            element={
            <ProtectedRoute>
              <Gmail/>
            </ProtectedRoute>
          } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
