import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


const Dashboard = () => {
    // Get the user context from location state
    const location = useLocation();
    const userContext = location.state;
//     const tempfunction = async () => {
//     const response = await axios.post('http://localhost:8000/login');
//     console.log(response)
//   }
    // tempfunction();
    return (
        <div className="dashboard-container">
        {/* <h1>Welcome, {userContext.email}!</h1> */}
        {userContext.role === 'Admin' ? <h1>Admin</h1> : <h1>User</h1>}
        {/* {userContext.role === 'Admin' ? tempfunction() : <h1>User</h1>} */}
        {/* Rest of your dashboard content here */}
        </div>
    );
};

export default Dashboard;
