
import React from 'react';
import { ChatMessage } from '../types';
import SourceDoc from './SourceDoc';
import { UserIcon, SparklesIcon } from './Icons';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { role, text, sources } = message;
  const isModel = role === 'model';

  if (message.id === 'loading') {
    return (
       <div className="flex items-start space-x-4 max-w-full">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <SparklesIcon />
            </div>
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-300"></div>
            </div>
        </div>
    );
  }

  return (
    <div className={`flex items-start gap-4 ${isModel ? '' : 'justify-end'}`}>
      {isModel && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <SparklesIcon />
        </div>
      )}

      <div className={`max-w-xl ${isModel ? '' : 'text-right'}`}>
        <div className={`px-4 py-3 rounded-2xl ${isModel ? 'bg-white dark:bg-gray-800 rounded-tl-none' : 'bg-blue-500 text-white rounded-br-none'}`}>
          <p className="whitespace-pre-wrap">{text}</p>
        </div>
        
        {sources && sources.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 text-left">Sources:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sources.map(source => (
                <SourceDoc key={source.id} file={source} />
              ))}
            </div>
          </div>
        )}
      </div>

      {!isModel && (
         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <UserIcon />
        </div>
      )}
    </div>
  );
};

export default Message;
