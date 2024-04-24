import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './GmailDashboard.module.css';
import { ReactComponent as NewMailIcon } from './assets/newmail.svg';
import {ReactComponent as ReplyIcon} from './assets/reply.svg';
import {ReactComponent as ForwardIcon} from './assets/forward.svg';
import {ReactComponent as InboxIcon} from './assets/inbox.svg';
import {ReactComponent as SentIcon} from './assets/sent.svg';
import {ReactComponent as DeleteIcon} from './assets/deleted.svg';
import { ReactComponent as JunkIcon } from './assets/junk.svg';

function GmailDashboard() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [currentView, setCurrentView] = useState('inbox');
    const [showNewEmailForm, setShowNewEmailForm] = useState(false);
    const [newEmailContent, setNewEmailContent] = useState({ to: '', subject: '', body: '' });


    useEffect(() => {
        fetchMessages();
    }, [currentView]);

    const handleReply = () => {
        if (selectedMessage) {
            // Prepopulate the 'to' field with the sender of the selected message
            // and prefix the subject with 'Re:'
            const replyEmailContent = {
                to: selectedMessage.from, 
                subject: `Re: ${selectedMessage.subject}`,
                body: `\n\n\n------\nReplying to:\n${selectedMessage.body}`, // Add the original message below
            };
    
            setNewEmailContent(replyEmailContent);
            setShowNewEmailForm(true); // Show the new email form
            setSelectedMessage(null); // Optionally clear the selected message
        }
    };
    

    const handleForward = () => {
        if (selectedMessage) {
            // Prepopulate the subject with 'Fwd:' prefix and the body of the email
            // Leave the 'to' field empty for the user to enter the recipient's address
            const forwardEmailContent = {
                to: '',
                subject: `Fwd: ${selectedMessage.subject}`,
                body: `------\nForwarded message:\n${selectedMessage.body}`, // Add the original message below
            };
    
            setNewEmailContent(forwardEmailContent);
            setShowNewEmailForm(true); // Show the new email form
            setSelectedMessage(null); // Optionally clear the selected message
        }
    };
    const handleNewMailToggle = () => {
        setNewEmailContent({ to: '', subject: '', body: '' }); // Reset new email content
        setShowNewEmailForm(!showNewEmailForm); // Toggle visibility of the form
        if (showNewEmailForm) {
            setSelectedMessage(null); // Optionally clear the selected message
        }
    };

    const handleSendMail = async () => {
        try {
            const { to, subject, body } = newEmailContent; // Destructure the newEmailContent object
            const emailContent = `TO: ${to}\nSubject: ${subject}\nContent-Type: text/html; charset=utf-8\n\n${body}`;
            const token = localStorage.getItem('token'); // Or however you're storing the token
            const headers = {
                Authorization: `Bearer ${token}`
            };
    
            const response = await axios.post('https://hr-analytics-and-reporting-production.up.railway.app/api/gmail/send', { message: emailContent }, { headers });
    
            console.log('Email sent successfully:', response.data);
            setShowNewEmailForm(false); // Hide form after sending the email
            setNewEmailContent({ to: '', subject: '', body: '' }); // Reset form
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };
    
    
    

    const handleInputChange = (e) => {
        setNewEmailContent({ ...newEmailContent, [e.target.name]: e.target.value });
    };

    const fetchMessages = async () => {
        // Construct the URL based on the current view
        let url = `https://hr-analytics-and-reporting-production.up.railway.app/api/gmail/${currentView}`;

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
        if (showNewEmailForm) {
            setShowNewEmailForm(false); // Close the new email form if it's open
        }
        setSelectedMessage(message);
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric", hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };

    return (
        <div className={styles.dashboard}>
            <div className={styles.sidebar}>
                <button className={styles.newMailButton} onClick={handleNewMailToggle}>
                    <NewMailIcon className={styles.newMailIcon} />
                    <span>New Mail</span>
                </button>
                <div className={styles.sidebarSection}>
                    <div className={styles.sidebarTitle}>Folders</div>
                    <button onClick={() => setCurrentView('inbox')} 
                            className={`${currentView === 'inbox' ? styles.active : ''} ${styles.buttonWithIcon}`}>
                            <InboxIcon className={styles.icon}/>
                        Inbox
                    </button>
                    <button onClick={() => setCurrentView('sent')} 
                            className={`${currentView === 'sent' ? styles.active : ''} ${styles.buttonWithIcon}`}>
                            <SentIcon className={styles.icon}/>
                        Sent Items
                    </button>
                    <button onClick={() => setCurrentView('deleted')} 
                            className={`${currentView === 'deleted' ? styles.active : ''} ${styles.buttonWithIcon}`}>
                            <DeleteIcon className={styles.icon}/>
                        Deleted Items
                    </button>
                    <button onClick={() => setCurrentView('junk')} 
                            className={`${currentView === 'junk' ? styles.active : ''} ${styles.buttonWithIcon}`}>
                            <JunkIcon className={styles.icon}/>
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
                {showNewEmailForm && (
                        <div className={styles.newEmailForm}>
                            <input type="text" name="to" placeholder="To" value={newEmailContent.to} onChange={handleInputChange} />
                            <input type="text" name="subject" placeholder="Subject" value={newEmailContent.subject} onChange={handleInputChange} />
                            <textarea
                                name="body"
                                placeholder="Body"
                                value={newEmailContent.body}
                                onChange={handleInputChange}
                                rows="10" // This will set the initial height of the textarea
                                ></textarea>
                            <button onClick={handleSendMail}>Send Email</button>
                        </div>
                    )}
                {!showNewEmailForm && selectedMessage && (
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
                        <ReplyIcon className={styles.actionIcon} />
                        <span>Reply</span>
                    </button>
                    <button className={styles.actionButton} onClick={handleForward}>
                        <ForwardIcon className={styles.actionIcon} />
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
