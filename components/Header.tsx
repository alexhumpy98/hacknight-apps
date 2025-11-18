
import React from 'react';
import { GoogleDriveSmallIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm sticky top-0">
      <div className="flex items-center space-x-3">
        <GoogleDriveSmallIcon />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Drive Chat Assistant</h1>
        <span className="text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 font-medium px-2.5 py-0.5 rounded-full">Connected</span>
      </div>
    </header>
  );
};

export default Header;
