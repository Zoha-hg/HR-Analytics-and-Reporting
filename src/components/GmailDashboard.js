import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './GmailDashboard.module.css';
import { ReactComponent as NewMailIcon } from './assets/newmail.svg';
import reply_icon from './assets/reply.svg';
import forward_icon from './assets/forward.svg';

function GmailDashboard() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [currentView, setCurrentView] = useState('inbox');

    useEffect(() => {
        fetchMessages();
    }, [currentView]);

    const handleReply = () => {
        console.log('Reply clicked');
        // Here, you would add the logic to handle the reply action
    };

    const handleForward = () => {
        console.log('Forward clicked');
        // Here, you would add the logic to handle the forward action
    };
    const handleNewMail = () => {   
        console.log('New Mail clicked');
        // Here, you would add the logic to handle the new mail action
    };
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

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric", hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };

    return (
        <div className={styles.dashboard}>
            <div className={styles.sidebar}>
            <button className={styles.newMailButton} onClick={handleNewMail}>
                    <NewMailIcon className={styles.newMailIcon} />
                    <span>New Mail</span>
                </button>
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
          <article className={styles.emailContent}>
            <header className={styles.emailHeader}>
              <h2 className={styles.emailSubject}>{selectedMessage.subject}</h2>
              <address className={styles.emailSenderInfo}>
                <div className={styles.senderDetails}>
                  <span className={styles.senderName}>{selectedMessage.senderName}</span>
                  <span className={styles.senderEmail}>{selectedMessage.sender}</span>
                </div>
                <time dateTime={selectedMessage.date}>{formatDate(selectedMessage.date)}</time>
              </address>
            </header>
            <div className={styles.emailBody} dangerouslySetInnerHTML={{ __html: selectedMessage.body }} />
            <div className={styles.emailActions}>
        <button className={styles.actionButton} onClick={handleReply}>
            <img src={reply_icon} alt="Reply" className={styles.actionIcon} />
            <span>Reply</span>
        </button>
        <button className={styles.actionButton} onClick={handleForward}>
            <img src={forward_icon} alt="Forward" className={styles.actionIcon} />
            <span>Forward</span>
        </button>
    </div>
          </article>
        )}
      </section>
            
        </div>
    );
}

export default GmailDashboard;
