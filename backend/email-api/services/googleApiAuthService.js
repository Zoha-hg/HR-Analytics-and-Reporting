const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const Token = require('../../models/tokenModel');
// const {content} = require('googleapis/build/src/apis/content');

// Define scopes
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];

// Fetch and store token from files
// const TOKEN_PATH = path.join(process.cwd(), './creds/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './creds/creds.json');

// Read previously authorized credentials from saved file
// async function LoadSavedCredentialsIfExists() {
//   try {
//     const content = await fs.readFile(TOKEN_PATH);
//     const credentials = JSON.parse(content);
//     return google.auth.fromJSON(credentials);
//   } catch (error) {
//     return null;
//   }
// }
// //
async function LoadSavedCredentialsIfExists(userId) {
  try {
    const token = await Token.findOne({ userId: userId });
    if (!token) {
      return null;
    }

    const { client_id, client_secret, redirect_uris } = JSON.parse(await fs.readFile(CREDENTIALS_PATH)).web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    oAuth2Client.setCredentials({
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
      scope: token.scope,
      token_type: token.tokenType,
      expiry_date: token.expiryDate
    });

    return oAuth2Client;
  } catch (error) {
    console.error('Error loading credentials:', error);
    return null;
  }
}

// async function SaveCredentials(client) {
//   const content = await fs.readFile(CREDENTIALS_PATH);
//   const keys = JSON.parse(content);
//   const key = keys.web || keys.installed;
//   const payload = JSON.stringify({
//     type: 'authorized_user',
//     client_id: key.client_id,
//     client_secret: key.client_secret,
//     refresh_token: client.credentials.refresh_token,
//   });
//   await fs.writeFile(TOKEN_PATH, payload);
// }

async function SaveCredentials(userId, client) {
  const tokenData = {
    userId: userId,
    accessToken: client.credentials.access_token,
    refreshToken: client.credentials.refresh_token,
    scope: client.credentials.scope.join(' '), // Join array into space-delimited string
    tokenType: client.credentials.token_type,
    expiryDate: client.credentials.expiry_date
  };

  await Token.findOneAndUpdate({ userId: userId }, tokenData, { upsert: true, new: true });
}


// async function authorize() {
//   let client = await LoadSavedCredentialsIfExists();
//   if (client) {
//     return client;
//   }
//   client = await authenticate({
//       scopes: SCOPES,
//       keyfilePath: CREDENTIALS_PATH,
//   });
//   if (client.credentials){
//     await SaveCredentials(client);
//   }
//   return client;
// }
async function authorize(userId) {
  let client = await LoadSavedCredentialsIfExists(userId);
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await SaveCredentials(userId, client);
  }
  return client;
}


module.exports = authorize;
