const authorize = require('./services/googleApiAuthService');
const {listLabels, sendEmail, listMessages} = require('./services/gmailApiServices');

async function testing() {
    let auth = await authorize().then().catch(console.error);
    // await listLabels(auth).then().catch(console.error);
    // let message = 'TO: sufianaseem1@gmail.com\nSubject: Test Email\nContent-Type: text/html; charset-utf-8\n\nThis is a test email';
    // await sendEmail(auth, message).catch(console.error);
    await listMessages(auth).catch(console.error);
}

testing().catch(console.error);


