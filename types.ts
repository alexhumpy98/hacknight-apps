// FIX: To resolve the 'Cannot find namespace 'JSX'' error, 'React' must be imported to provide the necessary JSX type definitions.
import React from 'react';

export interface DriveFile {
  id: string;
  name: string;
  content?: string; // Content is fetched on demand
  webViewLink: string;
  mimeType: string;
  icon: JSX.Element;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: DriveFile[];
}
