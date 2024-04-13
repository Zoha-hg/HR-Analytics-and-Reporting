const {google} = require('googleapis');
const authorize = require('../services/googleApiAuthService');
const sanitizeHtml = require('sanitize-html');

function sanitizeText(html) {
    // Define options for sanitization
    const options = {
        allowedTags: [], // No HTML tags allowed
        allowedAttributes: {}, // No HTML attributes allowed
        nonTextTags: ['style'], // Allow only <style> tags for CSS
        textFilter: function (text) {
            // Remove any HTML entities
            return text.replace(/&[^;]+;/g, '');
        }
    };

    // Sanitize the HTML content
    const sanitizedHtml = sanitizeHtml(html, options);

    return sanitizedHtml;
}

/**
 * Lists the messages in the user's inbox.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @returns {Array} Array of message objects
 */
async function listMessages(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10, // Adjusted to retrieve the first ten messages
      q: 'in:inbox', // Query to filter messages in the inbox
  });

  if (!res.data.messages || res.data.messages.length === 0) {
      console.log('No messages found in the inbox.');
      return [];
  }

  let messagesInfo = [];

  for (let i = 0; i < res.data.messages.length; i++) {
      const messageId = res.data.messages[i].id;
      console.log(`Message ID: ${messageId}`);

      const message = await gmail.users.messages.get({
          userId: 'me',
          id: messageId,
          format: 'full' // Ensure you get the full message format including headers and parts
      });

      const headers = message.data.payload.headers;
      const subjectHeader = headers.find(header => header.name === 'Subject');
      const fromHeader = headers.find(header => header.name === 'From');
      const dateHeader = headers.find(header => header.name === 'Date');

      const subject = subjectHeader ? subjectHeader.value : 'No Subject';
      const from = fromHeader ? fromHeader.value : 'Unknown Sender';
      const date = dateHeader ? new Date(dateHeader.value).toLocaleString() : 'Unknown Date';

      let bodyData = '';
      // Check if parts exist, if not, get the body data directly
      if (message.data.payload.parts) {
          const part = message.data.payload.parts.find(part => part.mimeType === 'text/html');
          if (part && part.body.data) {
              bodyData = part.body.data;
          }
      } else if (message.data.payload.body && message.data.payload.body.data) {
          bodyData = message.data.payload.body.data;
      }

      // Decode the HTML body data
      const decodedBodyData = Buffer.from(bodyData, 'base64').toString('utf-8');

      // Sanitize the HTML and CSS text
      const body = sanitizeText(decodedBodyData);

      console.log(`Subject: ${subject}`);
      console.log(`From: ${from}`);
      console.log(`Date: ${date}`);
      console.log(`Message Body: ${body}`);

      messagesInfo.push({
          subject: subject,
          from: from,
          date: date,
          body: body
      });
  }

  return messagesInfo;
}
async function listSentMessages(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 10, // Adjusted to retrieve the first ten messages
        q: 'in:sent', // Query to filter messages in the inbox
    });
  
    if (!res.data.messages || res.data.messages.length === 0) {
        console.log('No messages found in the inbox.');
        return [];
    }
  
    let messagesInfo = [];
  
    for (let i = 0; i < res.data.messages.length; i++) {
        const messageId = res.data.messages[i].id;
        console.log(`Message ID: ${messageId}`);
  
        const message = await gmail.users.messages.get({
            userId: 'me',
            id: messageId,
            format: 'full' // Ensure you get the full message format including headers and parts
        });
  
        // Extract necessary headers (Subject, From, Date)
        const headers = message.data.payload.headers;
        const subjectHeader = headers.find(header => header.name === 'Subject');
        const toHeader = headers.find(header => header.name === 'To');
        const dateHeader = headers.find(header => header.name === 'Date');

        // Extract the values, providing defaults if not found
        const subject = subjectHeader ? subjectHeader.value : 'No Subject';
        const to = toHeader ? toHeader.value : 'Unknown Recipient';
        const date = dateHeader ? new Date(dateHeader.value).toLocaleString() : 'Unknown Date';
   
        let bodyData = '';
        // Check if parts exist, if not, get the body data directly
        if (message.data.payload.parts) {
            const part = message.data.payload.parts.find(part => part.mimeType === 'text/html');
            if (part && part.body.data) {
                bodyData = part.body.data;
            }
        } else if (message.data.payload.body && message.data.payload.body.data) {
            bodyData = message.data.payload.body.data;
        }
  
        // Decode the HTML body data
        const decodedBodyData = Buffer.from(bodyData, 'base64').toString('utf-8');
  
        // Sanitize the HTML and CSS text
        const body = sanitizeText(decodedBodyData);
  
        console.log(`Subject: ${subject}`);
        console.log(`From: ${to}`);
        console.log(`Date: ${date}`);
        console.log(`Message Body: ${body}`);
  
        messagesInfo.push({
            subject: subject,
            from: to,
            date: date,
            body: body
        });
    }
  
    return messagesInfo;
  }
  



  async function sendEmail(auth, content){
      const gmail = google.gmail({version: 'v1', auth});
      const encodedMessage = Buffer.from(content).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const res = await gmail.users.messages.send({
      userId: 'me',
        requestBody: {
            raw: encodedMessage
        }
  });
  console.log(res.data);
  return res.data;
  }
async function listJunkMessages(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 10, // Adjusted to retrieve the first ten messages
        q: 'in:spam', // Query to filter messages in the inbox
    });
  
    if (!res.data.messages || res.data.messages.length === 0) {
        console.log('No messages found in the inbox.');
        return [];
    }
  
    let messagesInfo = [];
  
    for (let i = 0; i < res.data.messages.length; i++) {
        const messageId = res.data.messages[i].id;
        console.log(`Message ID: ${messageId}`);
  
        const message = await gmail.users.messages.get({
            userId: 'me',
            id: messageId,
            format: 'full' // Ensure you get the full message format including headers and parts
        });
  
        const headers = message.data.payload.headers;
        const subjectHeader = headers.find(header => header.name === 'Subject');
        const fromHeader = headers.find(header => header.name === 'From');
        const dateHeader = headers.find(header => header.name === 'Date');
  
        const subject = subjectHeader ? subjectHeader.value : 'No Subject';
        const from = fromHeader ? fromHeader.value : 'Unknown Sender';
        const date = dateHeader ? new Date(dateHeader.value).toLocaleString() : 'Unknown Date';
  
        let bodyData = '';
        // Check if parts exist, if not, get the body data directly
        if (message.data.payload.parts) {
            const part = message.data.payload.parts.find(part => part.mimeType === 'text/html');
            if (part && part.body.data) {
                bodyData = part.body.data;
            }
        } else if (message.data.payload.body && message.data.payload.body.data) {
            bodyData = message.data.payload.body.data;
        }
  
        // Decode the HTML body data
        const decodedBodyData = Buffer.from(bodyData, 'base64').toString('utf-8');
  
        // Sanitize the HTML and CSS text
        const body = sanitizeText(decodedBodyData);
  
        console.log(`Subject: ${subject}`);
        console.log(`From: ${from}`);
        console.log(`Date: ${date}`);
        console.log(`Message Body: ${body}`);
  
        messagesInfo.push({
            subject: subject,
            from: from,
            date: date,
            body: body
        });
    }
  
    return messagesInfo;
  }

  async function listTrashMessages(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 10, // Adjusted to retrieve the first ten messages
        q: 'in:trash', // Query to filter messages in the inbox
    });
  
    if (!res.data.messages || res.data.messages.length === 0) {
        console.log('No messages found in the inbox.');
        return [];
    }
  
    let messagesInfo = [];
  
    for (let i = 0; i < res.data.messages.length; i++) {
        const messageId = res.data.messages[i].id;
        console.log(`Message ID: ${messageId}`);
  
        const message = await gmail.users.messages.get({
            userId: 'me',
            id: messageId,
            format: 'full' // Ensure you get the full message format including headers and parts
        });
  
        const headers = message.data.payload.headers;
        const subjectHeader = headers.find(header => header.name === 'Subject');
        const fromHeader = headers.find(header => header.name === 'From');
        const dateHeader = headers.find(header => header.name === 'Date');
  
        const subject = subjectHeader ? subjectHeader.value : 'No Subject';
        const from = fromHeader ? fromHeader.value : 'Unknown Sender';
        const date = dateHeader ? new Date(dateHeader.value).toLocaleString() : 'Unknown Date';
  
        let bodyData = '';
        // Check if parts exist, if not, get the body data directly
        if (message.data.payload.parts) {
            const part = message.data.payload.parts.find(part => part.mimeType === 'text/html');
            if (part && part.body.data) {
                bodyData = part.body.data;
            }
        } else if (message.data.payload.body && message.data.payload.body.data) {
            bodyData = message.data.payload.body.data;
        }
  
        // Decode the HTML body data
        const decodedBodyData = Buffer.from(bodyData, 'base64').toString('utf-8');
  
        // Sanitize the HTML and CSS text
        const body = sanitizeText(decodedBodyData);
  
        console.log(`Subject: ${subject}`);
        console.log(`From: ${from}`);
        console.log(`Date: ${date}`);
        console.log(`Message Body: ${body}`);
  
        messagesInfo.push({
            subject: subject,
            from: from,
            date: date,
            body: body
        });
    }
  
    return messagesInfo;
  }
  /**
 * Lists the 5 most recent unread messages in the user's inbox.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @returns {Array} Array of message objects representing unread messages.
 */
async function listUnreadMessages(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 5, // Retrieve the first five unread messages
      q: 'in:inbox is:unread', // Query to filter unread messages in the inbox
    });
  
    if (!res.data.messages || res.data.messages.length === 0) {
      console.log('No unread messages found.');
      return [];
    }
  
    let messagesInfo = [];
  
    for (let message of res.data.messages) {
      const messageId = message.id;
      console.log(`Fetching details for Message ID: ${messageId}`);
  
      const messageDetails = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full', // Ensures you get the full message format including headers and parts
      });
  
      const headers = messageDetails.data.payload.headers;
      const subjectHeader = headers.find(header => header.name === 'Subject');
      const fromHeader = headers.find(header => header.name === 'From');
      const dateHeader = headers.find(header => header.name === 'Date');
  
      const subject = subjectHeader ? subjectHeader.value : 'No Subject';
      const from = fromHeader ? fromHeader.value : 'Unknown Sender';
      const date = dateHeader ? new Date(dateHeader.value).toLocaleString() : 'Unknown Date';
  
      let bodyData = '';
      if (messageDetails.data.payload.parts) {
        for (let part of messageDetails.data.payload.parts) {
          if (part.mimeType === 'text/html' && part.body.data) {
            bodyData = part.body.data;
            break; // Prefer HTML part
          } else if (part.mimeType === 'text/plain' && part.body.data) {
            bodyData = part.body.data; // Use plain text as fallback
          }
        }
      } else if (messageDetails.data.payload.body && messageDetails.data.payload.body.data) {
        bodyData = messageDetails.data.payload.body.data;
      }
  
      const decodedBodyData = Buffer.from(bodyData, 'base64').toString('utf-8');
      const body = sanitizeText(decodedBodyData);
  
      messagesInfo.push({
        id: messageId,
        subject: subject,
        from: from,
        date: date,
        snippet: messageDetails.data.snippet, // Show a snippet of the message content
        body: body, // The body will be sanitized HTML or plain text
      });
    }
  
    return messagesInfo;
  }
  async function countUnreadMessages(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
  
    try {
      const res = await gmail.users.messages.list({
        userId: 'me',
        // Using 'q' parameter to filter for unread messages in the inbox
        q: 'in:inbox is:unread'
      });
  
      // The number of unread messages is the length of the messages array
      const unreadCount = res.data.messages ? res.data.messages.length : 0;
  
      console.log(`Total unread messages: ${unreadCount}`);
      return unreadCount;
    } catch (error) {
      console.error('The API returned an error: ' + error);
      throw error; // Rethrow the error so the caller is aware an error occurred
    }
  }
  
  module.exports = {
    listSentMessages : listSentMessages,
    listMessages : listMessages,
    sendEmail : sendEmail,
    listJunkMessages : listJunkMessages,
    listTrashMessages: listTrashMessages,
    listUnreadMessages: listUnreadMessages,
    countUnreadMessages: countUnreadMessages
}