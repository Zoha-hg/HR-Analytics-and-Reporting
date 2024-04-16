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
                setReports(response.data);
            } catch (error) {
                console.error('Error fetching performance reports:', error);
            }
        };

        fetchReports();
    }, []);

    return (
        <div>
            <h1>Performance Reports</h1>
            <div>
                {reports.map((report) => (
                    <div key={report.id}>
                        <h2>{report.name}</h2>
                        <p>{report.description}</p>
                        <Link to={`/performancereports/${report.id}`}>View Report</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}   

export default PerformanceReports;
