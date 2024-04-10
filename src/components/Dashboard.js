import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Dashboard = () => {
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem('token');
            // console.log('Token:', token);
            try {
                // console.log('Fetching user role...')
                // Make a GET request to the /user-role endpoint to extract the user's role based on the token
                const response = await axios.get('http://localhost:8000/user-role', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // console.log('User role response:', response);
                setRole(response.data.role);
            } catch (error) {
                console.error('Error fetching user role:', error);
                // If there's an error, redirect to the login page
                alert('Failed to fetch user role. Please log in again.');
                navigate('/login');
            }
        };

        fetchUserRole();
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Welcome to the Dashboard</h1>
            {role === 'Admin' && (
                // Admin Dashboard content
                <div>
                    <h2>Admin Dashboard</h2>
                </div>
            )}
            {role === 'HR professional' && (
                // HR Dashboard content
                <div>
                    <h2>HR Dashboard</h2>
                </div>
            )}
            {role === 'Employee' && (
                // Employee Dashboard content
                <div>
                    <h2>Employee Dashboard</h2>
                </div>
            )}
            {role === 'Manager' && (
                // Manager Dashboard content
                <div>
                    <h2>Manager Dashboard</h2>
                    
                 </div>
            )}
        </div>
    );
};

export default Dashboard;

// import React from 'react';
// import { useLocation, Link } from 'react-router-dom';

// const Dashboard = () => {
//     const location = useLocation();
//     const userContext = location.state || {}; // Default to an empty object if state is null

//     return (
//         <div className="dashboard-container">
//             <h1>Welcome to the Dashboard</h1>
//             {userContext.role === 'admin' && (
//                 <div>
//                     <h2>Admin Dashboard</h2>
//                     <p>Admin can see all the data</p>
//                     <Link to="/form"><button>Create a Form</button></Link>
//                     <Link to="/fill"><button>Fill a Form</button></Link>
//                     <Link to="/display"><button>Display Forms</button></Link>
//                 </div>
//             )}
//             {userContext.role === 'HR professional' && (
                // <div>
                //     <h2>HR Dashboard</h2>
                //     <p>HR can see all the data</p>
                //     <Link to="/form"><button>Create a Form</button></Link>
                //     <Link to="/display"><button>Display Forms</button></Link>
                // </div>
//             )}
//             {userContext.role === 'Employee' && (
                // <div>
                //     <h2>Employee Dashboard</h2>
                //     <p>User can see only their data</p>
                //     <Link to="/form"><button>Create a Form</button></Link>
                //     <Link to="/fill"><button>Fill a Form</button></Link>
                //     <Link to="/display"><button>Display Forms</button></Link>
                // </div>
//             )}
//             {userContext.role === 'Manager' && (
//                 <div>
//                     <h2>Manager Dashboard</h2>
//                     <p>Manager can see only their department data</p>
//                     <Link to="/fill"><button>Fill a Form</button></Link>
//                     <Link to="/display"><button>Display Forms</button></Link>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Dashboard;
