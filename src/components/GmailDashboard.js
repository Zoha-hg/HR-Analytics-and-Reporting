import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './GmailDashboard.module.css'; // Ensure you have the correct path to your CSS module

function GmailDashboard() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/gmail/messages', getAuthHeaders());
            // Process the messages as needed for your application
            const formattedMessages = response.data.map(msg => ({
                ...msg,
                fromName: extractNameFromEmail(msg.from), // Extract the sender's name from the email
                snippet: msg.body.substring(0, 50) + '...' // Truncate the body to show a snippet
            }));
            setMessages(formattedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            // Handle errors, such as updating the UI to show an error message
        }
    };
    
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}` // Assuming your backend expects a Bearer token
            }
        };
    };
    
    // Utility function to extract the name from an email string
    const extractNameFromEmail = (email) => {
        const match = email.match(/^(.*?)</); // This regex finds the name before the email
        return match ? match[1].trim() : email; // If no name is found, return the whole email
    };
    
    const handleSelectMessage = (message) => {
        setSelectedMessage(message);
    };

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.title}>Gmail Dashboard</h1>
            <div className={styles.splitView}>
                <div className={styles.messageList}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={styles.messagePreview}
                            onClick={() => handleSelectMessage(message)}
                        >
                            <div className={styles.senderName}>
                                {message.fromName} {/* Extract the name from the email */}
                            </div>
                            <div className={styles.messageTime}>{message.date}</div>
                            <div className={styles.messageSnippet}>{message.snippet}</div>
                        </div>
                    ))}
                </div>
                <div className={styles.messageDetails}>
                    {selectedMessage && (
                        <>
                            <div className={styles.messageSubject}>{selectedMessage.subject}</div>
                            <div className={styles.messageFrom}>{selectedMessage.from}</div>
                            <div className={styles.messageDate}>{selectedMessage.date}</div>
                            <div className={styles.messageBody}>{selectedMessage.body}</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GmailDashboard;
