const { Client, Users, Account } = require('node-appwrite');

const appwriteClient = new Client();

appwriteClient
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID) // Your project ID
    .setKey(process.env.APPWRITE_API_KEY);     // Your secret API key

const appwriteUsers = new Users(appwriteClient);
const appwriteAccount = new Account(appwriteClient); // Though primarily for client-side, might be useful

module.exports = {
    appwriteClient,
    appwriteUsers,
    appwriteAccount,
};
