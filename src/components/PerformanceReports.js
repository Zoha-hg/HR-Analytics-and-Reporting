import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HRPerformanceReports from './PerformanceReports/HRPerformanceReports';
import ManagerPerformanceReports from './PerformanceReports/ManagerPerformanceReports';

const PerformanceReportsAndTurnover = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('https://hr-analytics-and-reporting-production.up.railway.app/user-role', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        navigate('/login');
      }
    };

    fetchUserRole();
  }, [navigate]);

  const renderPerformanceReports = () => {
    switch (role.toLowerCase()) {
      case 'hr professional':
        return <HRPerformanceReports />;
      case 'manager':
        return <ManagerPerformanceReports />;
      default:
        // Optionally handle other roles or return null
        return null;
    }
  };

  return (
    <div>
      {renderPerformanceReports()}
    </div>
  );
};

export default PerformanceReportsAndTurnover;
