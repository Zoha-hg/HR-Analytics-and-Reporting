import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import styles from './GmailDashboard.module.css';

function GmailDashboard() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/gmail/messages', getAuthHeaders());
            const formattedMessages = response.data.map(msg => ({
                ...msg,
                fromName: extractNameFromEmail(msg.from),
                snippet: msg.body.substring(0, 50) + '...'
            }));
            setMessages(formattedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const extractNameFromEmail = (email) => {
        const match = email.match(/^(.*?)</);
        return match ? match[1].trim() : email;
    };

    const handleSelectMessage = (message) => {
        setSelectedMessage(message);
    };

    return (
        <Container fluid>
            
            <Row>
            
                <Col sm={9} className="bg-white" style={{ height: "100vh" }}>
                    <div className={styles.dashboard}>
                        <h1 className={styles.title}>Gmail Dashboard</h1>
                        <div className={styles.splitView}>
                            <div className={styles.messageList}>
                                {messages.map((message, index) => (
                                    <div key={index} className={styles.messagePreview} onClick={() => handleSelectMessage(message)}>
                                        <div className={styles.senderName}>{message.fromName}</div>
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
                </Col>
            </Row>
        </Container>
    );
}

export default GmailDashboard;
