
import React from 'react';
import { GoogleDriveLogo } from './Icons';

interface ConnectScreenProps {
  onConnect: () => void;
  isApiReady: boolean;
  error?: string | null;
}

const ConnectScreen: React.FC<ConnectScreenProps> = ({ onConnect, isApiReady, error }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="max-w-md">
        <div className="flex justify-center mb-8">
            <GoogleDriveLogo />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Chat with your Google Drive
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
          Securely connect your Google Drive account to get instant answers from your documents, spreadsheets, and presentations.
        </p>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            <p className="font-bold">Initialization Error</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-2">Check the browser console (F12) for more details.</p>
          </div>
        )}

        <button
          onClick={onConnect}
          disabled={!isApiReady}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 ease-in-out shadow-lg disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isApiReady ? 'Connect to Google Drive' : 'Initializing...'}
        </button>
         <p className="text-xs text-gray-500 dark:text-gray-400 mt-8">
          This is a demonstration. You will be prompted to grant read-only access to your Drive files.
        </p>
      </div>
    </div>
  );
};

export default ConnectScreen;
