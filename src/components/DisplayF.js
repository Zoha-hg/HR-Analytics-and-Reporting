import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DisplayForms() {
    const [forms, setForms] = useState([]);
    const [username, setUsername] = useState('');
    useEffect(() => {

        // event.preventDefault();
        const fetchUserName = async () => {
            // Getting user token
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
        // const fetchData = async (usern) => {
        //     try {
                
        //         console.log("user",usern);
        //         const response = await axios.get('http://localhost:8000/displayform');
        //         setForms(response.data);
        //     } catch (error) {
        //         console.error('Error fetching forms:', error);
        //     }
        // };
        const getData = async () => {
            let username = await fetchUserName();
            fetchData(username);
            setUsername(username);
        }

        getData();
    }, []);

    const handleGoToForm = async (form_id) =>
    {
        console.log("going to form " + form_id);
        window.location.href = '/feedbackform/fillform/?user_id=' + username+ '?feedback_id=' + form_id;
    }
    const filledForms = forms.filter(form => form.filled);
    const unfilledForms = forms.filter(form => !form.filled);
    return (
        <div>
            <h1>Display Forms</h1>
            <h2>Incomplete</h2>
            <ul>
                {unfilledForms.map(form => (
                    <li key={form.form_id}>
                        <button type="button" onClick={() => handleGoToForm(form.form_id)}>
                        <h2>{form.title}</h2>
                        <p>{form.description}</p>
                        <p>Start Time: {form.start_time}</p>
                        <p>End Time: {form.end_time}</p>
                        </button>
                    </li>
                ))}
            </ul>
            <h2>Complete</h2>
            <ul>
                {filledForms.map(form => (
                    <li key={form.form_id}>
                        <button type="button" onClick={() => handleGoToForm(form.form_id)}>
                        <h2>{form.title}</h2>
                        <p>{form.description}</p>
                        <p>Start Time: {form.start_time}</p>
                        <p>End Time: {form.end_time}</p>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DisplayForms;