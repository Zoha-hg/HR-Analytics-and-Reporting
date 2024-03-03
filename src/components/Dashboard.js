
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import GmailIntegrate from './GmailIntegrate'; // Import GmailIntegrate component

// function Dashboard() {
//     const navigate = useNavigate(); 

//     const handleLogout = () => {
//         sessionStorage.removeItem('isAuthenticated');
//         navigate('/login');
//     };

//     return (
//         <div>
//             <h1>Dashboard</h1>
//             <GmailIntegrate /> {/* Use GmailIntegrate as a component */}
//             <button onClick={handleLogout}>Logout</button>
//         </div>
//     );
// }

// export default Dashboard;
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();

    const handleIntegrateGmail = () => {
        navigate('/integrate-gmail');
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleIntegrateGmail}>Integrate Gmail</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;
