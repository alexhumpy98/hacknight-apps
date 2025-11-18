
import React, { useState, useCallback, useEffect } from 'react';
import { ChatMessage, DriveFile } from './types';
import { initGoogleClient, connectToGoogleDrive, searchFiles, getFileContent } from './services/driveService';
import { getAnswerFromDocuments } from './services/geminiService';
import ChatInterface from './components/ChatInterface';
import ConnectScreen from './components/ConnectScreen';

const App: React.FC = () => {
  const [isApiReady, setIsApiReady] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    initGoogleClient().then(() => {
      setIsApiReady(true);
    }).catch(error => {
        console.error("Failed to initialize Google Client:", error);
        // You could show an error message to the user here.
    });
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const foundFiles = await searchFiles(text);

      if (foundFiles.length === 0) {
        const noFilesMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: "I couldn't find any relevant documents in your Google Drive for that query.",
        };
        setMessages(prev => [...prev, noFilesMessage]);
        setIsLoading(false);
        return;
      }

      const sourcesMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `Found ${foundFiles.length} relevant document(s). Analyzing content to generate an answer...`,
        sources: foundFiles,
      };
      setMessages(prev => [...prev, sourcesMessage]);

      const filesWithContent: DriveFile[] = await Promise.all(
        foundFiles.map(file => 
          getFileContent(file).then(content => ({ ...file, content: content || '' }))
        )
      );

      const answer = await getAnswerFromDocuments(text, filesWithContent);

      setMessages(prev => prev.map(msg => 
        msg.id === sourcesMessage.id ? { ...msg, text: answer } : msg
      ));

    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Sorry, I encountered an error while processing your request. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConnect = async () => {
    try {
      await connectToGoogleDrive();
      setIsConnected(true);
      setMessages([
          {
              id: 'initial-message',
              role: 'model',
              text: "I'm connected to your Google Drive. How can I help you find information in your documents today?",
              sources: []
          }
      ]);
    } catch(err) {
        console.error("Authentication failed", err);
        // Optionally, show an error message to the user
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {!isConnected ? (
        <ConnectScreen onConnect={handleConnect} isApiReady={isApiReady} />
      ) : (
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default App;
