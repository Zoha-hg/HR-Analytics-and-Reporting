import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dashboard_icon from './assets/Dashboard.png';
import employee_icon from './assets/Employee.svg';
import feedback_icon from './assets/Feedback.svg';
import turnover_icon from './assets/Turnover.svg';
import calendar_icon from './assets/Calendar.svg';
import gmail_icon from './assets/Turnover.svg';

function HRDisplayForms() {
    const [forms, setForms] = useState([]);

    useEffect(() => {

        const fetchUserName = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8000/user-name', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return response.data.username;
                
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };
        
        const fetchData = async (username) => {
            try {
                const response = await axios.post('http://localhost:8000/displayforms', {user: username});
                console.log("response.data: ", response.data);
                setForms(response.data);
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
        };

        const getData = async () => {
            let username = await fetchUserName();
            fetchData(username);
        }

        getData();
    }, []);

    const handleGoToForm = async (form_id) =>
    {
        console.log("going to display form results");
        window.location.href = '/feedbackform/displayresults/?form_id=' + form_id;
    }


    return (
        <div>
            <div >
                <ul>
                    <li><button><img src={dashboard_icon} alt="Dashboard"></img></button></li>
                    <li><img src={employee_icon} alt="Employee"></img></li>
                    <li><img src={turnover_icon} alt="Turnover"></img></li>
                    <li><img src={feedback_icon} alt="Feedback"></img></li>
                    <li><img src={calendar_icon} alt="Calendar"></img></li>
                </ul>
            </div>
            <div>
                <h1>Feedback Forms</h1>
                <ul>
                    {forms.length > 0 ? (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {forms.map(form => (
                                <li key={form.form_id}>
                                    <button type="button" onClick={() => handleGoToForm(form.form_id)}>
                                        <h3>{form.title}</h3>
                                        <p>{form.description}</p>
                                        <p>Start Time: {form.start_time}</p>
                                        <p>End Time: {form.end_time}</p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        ) : (
                            <p>None</p>
                        )}
                </ul>
            </div>
        </div>
    );
}

export default HRDisplayForms;