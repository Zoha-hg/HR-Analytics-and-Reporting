import React from 'react';
import './App.css';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import LoginPage2 from './components/LoginPage1/LoginPage1'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage2 />} />
          {/* <Route path='/login2' element={<LoginPage2 />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
