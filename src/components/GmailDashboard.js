import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './GmailDashboard.module.css';

function GmailDashboard() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [currentView, setCurrentView] = useState('inbox');

    useEffect(() => {
        fetchMessages();
    }, [currentView]);

    const fetchMessages = async () => {
        // Construct the URL based on the current view
        let url = `http://localhost:8000/api/gmail/${currentView}`;

        try {
            const response = await axios.get(url, getAuthHeaders());
            const formattedMessages = response.data.map(msg => ({
                ...msg,
                fromName: extractNameFromEmail(msg.from),
                snippet: msg.body.substring(0, 30) + '...'
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
        <div className={styles.dashboard}>
            <div className={styles.sidebar}>
                {/* Sidebar Sections */}
                <div className={styles.sidebarSection}>
                    <div className={styles.sidebarTitle}>Folders</div>
                    <button onClick={() => setCurrentView('inbox')} 
                            className={currentView === 'inbox' ? styles.active : ''}>
                        Inbox
                    </button>
                    <button onClick={() => setCurrentView('sent')} 
                            className={currentView === 'sent' ? styles.active : ''}>
                        Sent Items
                    </button>
                    <button onClick={() => setCurrentView('drafts')} 
                            className={currentView === 'drafts' ? styles.active : ''}>
                        Drafts
                    </button>
                    <button onClick={() => setCurrentView('deleted')} 
                            className={currentView === 'deleted' ? styles.active : ''}>
                        Deleted Items
                    </button>
                    <button onClick={() => setCurrentView('junk')} 
                            className={currentView === 'junk' ? styles.active : ''}>
                        Junk Email
                    </button>
                </div>
            </div>
            <section className={styles.emailListSection}>
            {messages.map((message, index) => (
          <div key={index} 
               className={selectedMessage === message ? styles.messageSelected : styles.messagePreview} 
               onClick={() => handleSelectMessage(message)}>
            <div className={styles.messageInfo}>
              <div className={styles.senderName}>{message.fromName}</div>
              <div className={styles.messageSubject}>{message.subject}</div>
              <div className={styles.messageSnippet}>{message.snippet}</div>
              <div className={styles.messageTime}>{message.date}</div>
            </div>
          </div>
        ))}
            </section>
            <section className={styles.emailContentSection}>
                {selectedMessage && (
                    <div className={styles.messageDetails}>
                        <div className={styles.messageDetailHeader}>
                            <div className={styles.messageDetailSubject}>{selectedMessage.subject}</div>
                            <div className={styles.messageDetailInfo}>
                                <span className={styles.messageDetailFrom}>{selectedMessage.from}</span>
                                <span className={styles.messageDetailDate}>{selectedMessage.date}</span>
                            </div>
                        </div>
                        <div className={styles.messageBody}>{selectedMessage.body}</div>
                    </div>
                )}
            </section>
            
        </div>
    );
}

export default GmailDashboard;
