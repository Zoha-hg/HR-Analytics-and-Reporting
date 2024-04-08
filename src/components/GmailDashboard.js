import React, { useState } from 'react';
import axios from 'axios';

function GmailDashboard() {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [emailContent, setEmailContent] = useState('');

    // const fetchLabels = async () => {
    //     try {
    //         const response = await axios.get('/api/gmail/labels');
    //         console.log('Labels:', response.data);
    //     } catch (error) {
    //         console.error('Error fetching labels:', error);
    //     }
    // };

    const fetchLabels = async () => {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        try {
            const response = await axios.get('http://localhost:8000/api/gmail/labels', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Labels:', response.data);
        } catch (error) {
            console.error('Error fetching labels:', error);
        }
    };


    const fetchMessages = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8000/api/gmail/messages', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // const response = await axios.get('');
            console.log('Messages:', response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendEmail = async () => {
        const message = `TO: ${email}\nSubject: ${subject}\nContent-Type: text/html; charset=utf-8\n\n${emailContent}`;
        const token = localStorage.getItem('token'); // Or however you're storing the token
        const headers = {
            Authorization: `Bearer ${token}`
        };
    
        try {
            await axios.post('http://localhost:8000/api/gmail/send', { message }, { headers });
            setEmail('');
            setSubject('');
            setEmailContent('');
            alert('Email sent!');
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email. Please try again.');
        }
    };
    
    return (
        <div>
            <h1>Gmail Dashboard</h1>

            <div>
                <h2>Fetch Labels</h2>
                <button onClick={fetchLabels}>Fetch Labels</button>
            </div>

            <div>
                <h2>Fetch Messages</h2>
                <button onClick={fetchMessages}>Fetch Messages</button>
            </div>

            <div>
                <h2>Send Email</h2>
                <label>
                    Email Address:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <br />
                <label>
                    Subject:
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </label>
                <br />
                <textarea value={emailContent} onChange={(e) => setEmailContent(e.target.value)}></textarea>
                <button onClick={sendEmail}>Send</button>
            </div>
        </div>
    );
}

export default GmailDashboard;
