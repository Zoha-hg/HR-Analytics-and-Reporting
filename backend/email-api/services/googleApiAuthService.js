const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
// const {content} = require('googleapis/build/src/apis/content');

// Define scopes
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];

// Fetch and store token from files
const TOKEN_PATH = path.join(process.cwd(), './creds/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './creds/creds.json');

// Read previously authorized credentials from saved file
async function LoadSavedCredentialsIfExists() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (error) {
    return null;
  }
}
//

async function SaveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.web || keys.installed;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await LoadSavedCredentialsIfExists();
  if (client) {
    return client;
  }
  client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials){
    await SaveCredentials(client);
  }
  return client;
}

module.exports = authorize;
