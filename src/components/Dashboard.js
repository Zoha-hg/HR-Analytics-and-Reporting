import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Dashboard = () => {
    // Get the user context from location state
    const location = useLocation();
    const userContext = location.state;

    // Implement role based access control
    // Show different dashboard elements based on the user's role

    return (
        <div className="dashboard-container">
            {/* Showing dashboards based on the user's role */}
            <h1>Welcome to the Dashboard</h1>

            {/* Admin Dashboard */}
            {userContext.role === 'admin' && (
                <div>
                    <h2>Admin Dashboard</h2>
                    <p>Admin can see all the data</p>
                    <Link to="/form">
                        <button>Create a Form</button>
                    </Link>
                    <Link to="/fill">
                        <button>Fill a Form</button>
                    </Link>
                    <Link to="/display">
                        <button>Display Forms</button>
                    </Link>
                </div>
            )}

            {/* HR Dashboard */}
            {userContext.role === 'HR professional' && (
                <div>
                    <h2>HR Dashboard</h2>
                    <p>HR can see all the data</p>
                    <Link to="/form">
                        <button>Create a Form</button>
                    </Link>
                    <Link to="/display">
                        <button>Display Forms</button>
                    </Link>
                </div>
            )}

            {/* User Dashboard */}
            {userContext.role === 'Employee' && (
                <div>
                    <h2>Employee Dashboard</h2>
                    <p>User can see only their data</p>
                    <Link to="/form">
                        <button>Create a Form</button>
                    </Link>
                    <Link to="/fill">
                        <button>Fill a Form</button>
                    </Link>
                    <Link to="/display">
                        <button>Display Forms</button>
                    </Link>
                </div>
            )}
            
            {/* Manager Dashboard */}
            {userContext.role === 'Manager' && (
                <div>
                    <h2>Manager Dashboard</h2>
                    <p>Manager can see only their department data</p>
                    <Link to="/fill">
                        <button>Fill a Form</button>
                    </Link>
                    <Link to="/display">
                        <button>Display Forms</button>
                    </Link>
                </div>
            )}

        </div>
    );
};

export default Dashboard;


//     const tempfunction = async () => {
//     const response = await axios.post('http://localhost:8000/login');
//     console.log(response)
//   }
    // tempfunction();



