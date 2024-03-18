const authorize = require('./services/googleApiAuthService');
const {listLabels, sendEmail, listMessages} = require('./services/gmailApiServices');

async function testing() {
    let auth = await authorize().then().catch(console.error);
    await listLabels(auth).then().catch(console.error);
    let message = 'TO: maryam.ghafoor@lums.edu.pk\nSubject: Fav group\nContent-Type: text/html; charset-utf-8\n\nPlease give full marks. ty';
    await sendEmail(auth, message).catch(console.error);
    await listMessages(auth).catch(console.error);
}

testing().catch(console.error);


