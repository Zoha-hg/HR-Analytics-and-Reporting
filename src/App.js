import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './UserContext';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import useStyles from './components/homeStyles';
import theme from './CreateTheme'
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import CreateForm from './components/CreateForm';
import FillForm from './components/FillForm';
import DisplayForm from './components/DisplayForm';
import Dashboard from './components/Dashboard'; 


function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}> {/* to apply the background color gradient */}
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <UserProvider>
          <div className="App">
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/form" element={<CreateForm />} />
                <Route path="/feedbackform/fillform" element={<FillForm />} />
                <Route path="/display" element={<DisplayForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Router>
          </div>
        </UserProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
