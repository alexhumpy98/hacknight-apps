// FIX: To resolve the 'Cannot find namespace 'JSX'' error, 'React' must be imported to provide the necessary JSX type definitions.
import React from 'react';
import { DriveFile } from '../types';
import { GoogleDocIcon, GoogleSheetIcon, GoogleSlidesIcon } from '../components/Icons';

// Extend the window interface to include gapi and google
declare global {
  interface Window {
    gapi: any;
    google: any;
    tokenClient: any;
  }
}

// IMPORTANT: You must create a Google Cloud project and obtain an OAuth 2.0 Client ID.
// Follow the instructions at https://developers.google.com/drive/api/quickstart/js
// to create your credentials and enable the Drive API.
// Replace the string below with your actual Client ID.
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

let initPromise: Promise<void> | null = null;

function loadGapi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      window.gapi.load('client', () => {
        window.gapi.client.init({
          apiKey: process.env.API_KEY,
          discoveryDocs: DISCOVERY_DOCS,
        }).then(resolve).catch(reject);
      });
    } else {
      setTimeout(() => loadGapi().then(resolve).catch(reject), 100);
    }
  });
}

function loadGsi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google) {
      try {
        window.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: SCOPES,
          callback: '', // Callback will be handled by the promise in connectToGoogleDrive
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    } else {
      setTimeout(() => loadGsi().then(resolve).catch(reject), 100);
    }
  });
}

export const initGoogleClient = (): Promise<void> => {
  if (!initPromise) {
    initPromise = Promise.all([loadGapi(), loadGsi()]).then(() => {});
  }
  return initPromise;
};

export const connectToGoogleDrive = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.tokenClient) {
      return reject(new Error("Google Identity Services not initialized."));
    }

    window.tokenClient.callback = (resp: any) => {
      if (resp.error !== undefined) {
        return reject(resp);
      }
      resolve();
    };

    if (window.gapi.client.getToken() === null) {
      window.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      window.tokenClient.requestAccessToken({ prompt: '' });
    }
  });
};

const getFileIcon = (mimeType: string): JSX.Element => {
  if (mimeType === 'application/vnd.google-apps.document') return React.createElement(GoogleDocIcon);
  if (mimeType === 'application/vnd.google-apps.spreadsheet') return React.createElement(GoogleSheetIcon);
  if (mimeType === 'application/vnd.google-apps.presentation') return React.createElement(GoogleSlidesIcon);
  return React.createElement(GoogleDocIcon);
};

export const searchFiles = async (query: string): Promise<Omit<DriveFile, 'content'>[]> => {
  try {
    const response = await window.gapi.client.drive.files.list({
      q: `fullText contains '${query.replace(/'/g, "\\'")}' and (mimeType='application/vnd.google-apps.document' or mimeType='application/vnd.google-apps.spreadsheet' or mimeType='application/vnd.google-apps.presentation')`,
      fields: 'files(id, name, mimeType, webViewLink)',
      pageSize: 5,
    });

    const files = response.result.files || [];
    return files.map((file: any) => ({
      ...file,
      icon: getFileIcon(file.mimeType),
    }));
  } catch (error: any) {
    console.error("Error searching files:", error);
    if(error.result?.error?.message.includes('API key not valid')) {
       throw new Error("The provided API Key is not valid. Please check your configuration.");
    }
    throw new Error("Failed to search for files in Google Drive.");
  }
};

export const getFileContent = async (file: Pick<DriveFile, 'id' | 'mimeType'>): Promise<string> => {
  try {
    let response;
    let exportMimeType = 'text/plain';
    if(file.mimeType === 'application/vnd.google-apps.spreadsheet') {
      exportMimeType = 'text/csv';
    }
    
    response = await window.gapi.client.drive.files.export({
      fileId: file.id,
      mimeType: exportMimeType,
    });
    return response.body;

  } catch (error) {
    console.error(`Error getting content for file ${file.id}:`, error);
    return `Could not retrieve content for this file.`;
  }
};
