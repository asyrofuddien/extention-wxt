import { useState, useEffect } from 'react';
import { ChatMessage } from '../../../lib/aiService';

interface VideoSession {
  messages: ChatMessage[];
  title: string;
}

interface UseChatHistoryReturn {
  messages: ChatMessage[];
  title: string;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  clearHistory: () => void;
  setTitle: (title: string) => void;
}

export const useChatHistory = (videoId: string | null): UseChatHistoryReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [title, setTitle] = useState<string>('');

  // Load chat history saat videoId berubah
  useEffect(() => {
    if (!videoId) {
      setMessages([]);
      setTitle('');
      return;
    }

    // Load dari localStorage dengan key = videoId
    const storageKey = `chat_session_${videoId}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const session: VideoSession = JSON.parse(saved);
        setMessages(session.messages || []);
        setTitle(session.title || '');
      } else {
        setMessages([]);
        setTitle('');
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setMessages([]);
      setTitle('');
    }
  }, [videoId]);

  // Save chat history ke localStorage setiap kali messages atau title berubah
  useEffect(() => {
    if (!videoId) return;

    const storageKey = `chat_session_${videoId}`;
    try {
      const session: VideoSession = {
        messages,
        title,
      };
      if (messages.length > 0 || title) {
        localStorage.setItem(storageKey, JSON.stringify(session));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [messages, title, videoId]);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearHistory = () => {
    setMessages([]);
    setTitle('');
    if (videoId) {
      const storageKey = `chat_session_${videoId}`;
      localStorage.removeItem(storageKey);
    }
  };

  return {
    messages,
    title,
    setMessages,
    addMessage,
    clearHistory,
    setTitle,
  };
};
