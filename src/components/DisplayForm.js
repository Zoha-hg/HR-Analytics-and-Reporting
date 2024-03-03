import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DisplayForm() {
    const [forms, setForms] = useState([]);
    const [username, setUsername] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/displayform');
                setForms(response.data);
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
        };
        
        const fetchUserName = async () => {
            // Getting user token
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8000/user-name', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Setting username to the current user's username
                setUsername(response.data.username);
    
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };
        fetchData();
        fetchUserName();
    }, []);


    const handleGoToForm = async (form_id) => {

       


        // event.preventDefault();
        console.log("going to form " + form_id);
        // fetch the feedback forms of the current user's ID
        // Temporarily using username instead of ID
        window.location.href = '/feedbackform/fillform/?feedback_id=' + form_id;
    }
    //hello

    return (
        <div>
            <h1>Display Forms</h1>
            <ul>
                {forms.map(form => (
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

export default DisplayForm;