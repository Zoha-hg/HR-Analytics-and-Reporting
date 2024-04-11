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
  

  async function listDraftMessages(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    // Fetch messages labeled as drafts
    const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 10, // Adjust this value as needed
        q: 'in:drafts', // Query to filter for draft messages
    });
  
    if (!res.data.messages || res.data.messages.length === 0) {
        console.log('No draft messages found.');
        return [];
    }
  
    let messagesInfo = [];

    // Iterate over each message in the drafts
    for (let i = 0; i < res.data.messages.length; i++) {
        const messageId = res.data.messages[i].id;

        // Retrieve the full details of each message
        const message = await gmail.users.messages.get({
            userId: 'me',
            id: messageId,
            format: 'full'
        });

        // Extract necessary headers (Subject, From, Date)
        const headers = message.data.payload.headers;
        const subjectHeader = headers.find(header => header.name === 'Subject');
        const fromHeader = headers.find(header => header.name === 'From');
        const dateHeader = headers.find(header => header.name === 'Date');

        // Extract the values, providing defaults if not found
        const subject = subjectHeader ? subjectHeader.value : 'No Subject';
        const from = fromHeader ? fromHeader.value : 'Unknown Sender';
        const date = dateHeader ? new Date(dateHeader.value).toLocaleString() : 'Unknown Date';
  
        // Initialize body data and decode if present
        let bodyData = '';
        if (message.data.payload.parts) {
            const part = message.data.payload.parts.find(part => part.mimeType === 'text/html');
            bodyData = part && part.body.data ? part.body.data : '';
        } else if (message.data.payload.body && message.data.payload.body.data) {
            bodyData = message.data.payload.body.data;
        }

        // Decode and sanitize the body content
        const decodedBodyData = Buffer.from(bodyData, 'base64').toString('utf-8');
        const body = sanitizeText(decodedBodyData);

        // Log and push each message's details to the array
        console.log(`Draft ID: ${messageId}, Subject: ${subject}, From: ${from}, Date: ${date}`);
        messagesInfo.push({
            id: messageId,
            subject: subject,
            from: from,
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
  
  module.exports = {
    // listLabels : listLabels,
    listDraftMessages : listDraftMessages,
    listSentMessages : listSentMessages,
    listMessages : listMessages,
    sendEmail : sendEmail,
    listJunkMessages : listJunkMessages,
    listTrashMessages: listTrashMessages
}