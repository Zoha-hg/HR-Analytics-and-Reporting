import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PerformanceReports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem('token');
            try {
                // Make a request to the backend API with authentication credentials
                const response = await axios.get('http://localhost:8000/api/performancereports', {
                    headers: {Authorization: `Bearer ${token}`},
                });
                setReports(response.data.employees); // Assuming the response structure includes the employees key
            } catch (error) {
                console.error('Error fetching performance reports:', error);
                if (error.response && error.response.status === 401) {
                    // Handle unauthorized access by navigating to a login page or showing a message
                    navigate('/login');
                }
            }
        };

        fetchReports();
    }, [navigate]);

    return (
        <div>
            <h1>Performance Reports</h1>
            <div>
                {reports.map((report) => (
                    <div key={report._id}>
                        <h2>{report.employee_name} - {report.position}</h2>
                        <p>Salary: {report.salary}</p>
                        <p>Hours Worked: {report.totalHoursWorked}</p>
                        <p>Average Skills: {report.averageSkills}</p>
                        <p>Total Completed Tasks: {report.totalCompletedTasks}</p>
                        <p>Probability: {report.probability !== undefined ? report.probability : 'N/A'}</p>
                        <Link to={`/performancereports/${report._id}`}>View Report</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PerformanceReports;
