import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DisplayForm() {
    const [forms, setForms] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/displayform');
                setForms(response.data);
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
        };
        fetchData();
    }, []);
    return (
        <div>
            <h1>Display Forms</h1>
            <ul>
                {forms.map(form => (
                    <li key={form.form_id}>
                        <h2>{form.title}</h2>
                        <p>{form.description}</p>
                        <p>Start Time: {form.start_time}</p>
                        <p>End Time: {form.end_time}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DisplayForm;