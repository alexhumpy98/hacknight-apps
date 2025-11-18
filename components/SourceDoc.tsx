
import React from 'react';
import { DriveFile } from '../types';

interface SourceDocProps {
  file: DriveFile;
}

const SourceDoc: React.FC<SourceDocProps> = ({ file }) => {
  return (
    <a
      href={file.webViewLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
    >
        <div className="flex-shrink-0 w-6 h-6 mr-2">
            {file.icon}
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-200 truncate" title={file.name}>
            {file.name}
        </span>
    </a>
  );
};

export default SourceDoc;
