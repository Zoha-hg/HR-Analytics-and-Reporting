import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dashboard_icon from './assets/Dashboard.png';
import employee_icon from './assets/Employee.svg';
import feedback_icon from './assets/Feedback.svg';
import turnover_icon from './assets/Turnover.svg';
import calendar_icon from './assets/Calendar.svg';
import gmail_icon from './assets/Turnover.svg';

function DisplayForms() {
    const [forms, setForms] = useState([]);
    // const [username, setUsername] = useState('');

    function getFirstTwoDigits(number) {

        const numberString = number.toString();
        const firstTwoDigits = numberString.slice(0, 2);
    
        return firstTwoDigits;
    }

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
                setForms(response.data);
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
        };

        const getData = async () => {
            let username = await fetchUserName();
            fetchData(username);
            // setUsername(username);
        }

        getData();
    }, []);

    const handleGoToForm = async (form_id) =>
    {
        if((getFirstTwoDigits(form_id) === '10')||(getFirstTwoDigits(form_id) === '20'))
        {
            console.log("going to form " + form_id);
            window.location.href = '/feedbackform/fillform/?feedback_id=' + form_id;
        }
        else
        {
            console.log("going to display form results");
            window.location.href = '/feedbackform/displayresults/?form_id=' + form_id;
        }
    }

    const filledForms = forms.filter(form => form.filled);
    const unfilledForms = forms.filter(form => !form.filled);

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
                <h2>Incomplete</h2>
                <ul>
                    {unfilledForms.length > 0 ? (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {unfilledForms.map(form => (
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
                <h2>Complete</h2>
                <ul>
                    {filledForms.length > 0 ? (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {filledForms.map(form => (
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

export default DisplayForms;