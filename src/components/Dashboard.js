
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function Dashboard() {
  const navigate = useNavigate(); 

  const integrateGmail = () => {
    navigate('/integrate-gmail'); 
  };

  const handleLogout = () => {
    // Assuming you're using sessionStorage to manage the login state
    sessionStorage.removeItem('isAuthenticated'); // Clear the authentication flag
    navigate('/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={integrateGmail}>Integrate Gmail</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
