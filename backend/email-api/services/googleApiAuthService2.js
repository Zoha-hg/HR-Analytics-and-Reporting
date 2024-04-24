const fs = require('fs').promises;
const mongoose = require('mongoose');
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const user = require('../../models/users.model'); // Adjust the path to your user model
const User = mongoose.model("User", user);

// Define scopes
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];
const CREDENTIALS_PATH = path.join(process.cwd(), './email-api/creds/creds.json');

// Read previously authorized credentials from the database
async function loadSavedCredentialsIfExists(username) {
  try {
    console.log('yaar idomt get it')
    const user = await User.findOne({ username: username });
    console.log('User:', user);
    if (user && user.refreshToken) {
      // Create an OAuth2 client with the client ID and secret
      const oauth2Client = new google.auth.OAuth2(
        "545520503111-8q2ile0qc90kuh3iretlormau3uikiqe.apps.googleusercontent.com",
        "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",
        'https://hr-analytics-and-reportin.vercel.app/oauth2callback' // The redirect URI used in the initial OAuth flow, not used here but required for initialization
      );

      // Set the OAuth2 client's credentials with the user's refresh token
      oauth2Client.setCredentials({
        refresh_token: user.refreshToken,
      });

      console.log('Loaded credentials:', oauth2Client.credentials);

      return oauth2Client;
    }
    return null;
  } catch (error) {
    console.error('Error loading credentials from database:', error);
    return null;
  }
}

// Save the user's credentials in the database
async function saveCredentials(username, client) {
  if (!client.credentials.refresh_token) {
    console.log('No refresh token found. Existing tokens are assumed to still be valid.');
    return;
  }

  await User.findOneAndUpdate(
    { username: username },
    { 
      refreshToken: client.credentials.refresh_token
    },
    { new: true }
  );
}

// Authenticate the user and save credentials in the database
async function authorize2(username) {
    let client = await loadSavedCredentialsIfExists(username);
    if (client) {
        return client;
    }

    console.log('hhhh',client)
    console.log('Authorizing user:', username);

    try {
        client = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
    } catch (error) {
        console.error('Authentication error:', error);
        // Handle the error appropriately
    }
    

    console.log('Authorized:', client.credentials);

    console.log('Authorized:', client.credentials.refresh_token);

    if (client.credentials) {``
        await saveCredentials(username, client);
    }
  
    return client;
}

// module.exports = authorize2;
module.exports = {
  authorize2 : authorize2,
  loadSavedCredentialsIfExists : loadSavedCredentialsIfExists
};
