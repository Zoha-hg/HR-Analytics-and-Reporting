const {google} = require('googleapis');
const authorize = require('../services/googleApiAuthService');
const Token = require('../../models/tokenModel');
/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listLabels(auth) {
    const gmail = google.gmail({version: 'v1', auth});
    const res = await gmail.users.labels.list({
      userId: 'me',
    });
    const labels = res.data.labels;
    if (!labels || labels.length === 0) {
      console.log('No labels found.');
      return;
    }
    console.log('Labels:');
    labels.forEach((label) => {
      console.log(`- ${label.name}`);
    });

    return labels;
  }
  
// async function listMessages(auth) {
//     const gmail = google.gmail({ version: 'v1', auth });
//     const res = await gmail.users.messages.list({
//         userId: 'me',
//         maxResults: 3, // Retrieve the first three messages
//         q: 'in:inbox', // Query to filter messages in the inbox
//     });

//     if (!res.data.messages || res.data.messages.length === 0) {
//         console.log('No messages found in the inbox.');
//         return [];
//     }

//     let messagesInfo = [];

//     for (let i = 0; i < res.data.messages.length; i++) {
//         const messageId = res.data.messages[i].id;
//         console.log(`Message ID: ${messageId}`);

//         const message = await gmail.users.messages.get({
//             userId: 'me',
//             id: messageId,
//         });

//         const headers = message.data.payload.headers;
//         const subjectHeader = headers.find(header => header.name === 'Subject');
//         const fromHeader = headers.find(header => header.name === 'From');
//         const dateHeader = headers.find(header => header.name === 'Date');

//         const subject = subjectHeader ? subjectHeader.value : 'No Subject';
//         const from = fromHeader ? fromHeader.value : 'Unknown Sender';
//         const date = dateHeader ? new Date(dateHeader.value).toLocaleString() : 'Unknown Date';

//         const bodyData = message.data.payload.parts[0].body.data;
//         const body = bodyData ? Buffer.from(bodyData, 'base64').toString() : 'No Message Body';

//         console.log(`Subject: ${subject}`);
//         console.log(`From: ${from}`);
//         console.log(`Date: ${date}`);
//         console.log(`Message Body: ${body}`);

//         messagesInfo.push({
//             subject: subject,
//             from: from,
//             date: date,
//             body: body
//         });
//     }

//     return messagesInfo;
// }
async function listMessages(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 3,
      q: 'in:inbox',
  });

  if (!res.data.messages || res.data.messages.length === 0) {
      console.log('No messages found in the inbox.');
      return [];
  }

  let messagesInfo = [];

  for (const messageRef of res.data.messages) {
      const message = await gmail.users.messages.get({
          userId: 'me',
          id: messageRef.id,
          format: 'full',
      });

      const headers = message.data.payload.headers;
      const subject = headers.find(header => header.name === 'Subject')?.value || 'No Subject';
      const from = headers.find(header => header.name === 'From')?.value || 'Unknown Sender';
      const date = headers.find(header => header.name === 'Date')?.value ? new Date(headers.find(header => header.name === 'Date').value).toLocaleString() : 'Unknown Date';

      // Simplified approach: Just show snippet instead of parsing body parts
      const snippet = message.data.snippet || 'No Message Body';

      console.log(`Subject: ${subject}`);
      console.log(`From: ${from}`);
      console.log(`Date: ${date}`);
      console.log(`Snippet: ${snippet}`);

      messagesInfo.push({ subject, from, date, snippet });
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

  module.exports = {
    listLabels : listLabels,
    listMessages : listMessages,
    sendEmail : sendEmail
}