
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import Message from './Message';
import { SendIcon } from './Icons';
import Header from './Header';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
        <Header />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <Message key={msg.id + '-' + index} message={msg} />
        ))}
        {isLoading && <Message key="loading" message={{ id: 'loading', role: 'model', text: 'Thinking...' }} />}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 md:p-6 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-1 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
