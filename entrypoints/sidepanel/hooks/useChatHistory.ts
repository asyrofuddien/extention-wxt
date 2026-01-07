import { useState, useEffect } from 'react';
import { ChatMessage } from '../../../lib/aiService';

interface UseChatHistoryReturn {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  clearHistory: () => void;
}

export const useChatHistory = (videoId: string | null): UseChatHistoryReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load chat history saat videoId berubah
  useEffect(() => {
    if (!videoId) {
      setMessages([]);
      return;
    }

    // Load dari localStorage dengan key = videoId
    const storageKey = `chat_history_${videoId}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setMessages([]);
    }
  }, [videoId]);

  // Save chat history ke localStorage setiap kali messages berubah
  useEffect(() => {
    if (!videoId) return;

    const storageKey = `chat_history_${videoId}`;
    try {
      if (messages.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [messages, videoId]);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearHistory = () => {
    setMessages([]);
    if (videoId) {
      const storageKey = `chat_history_${videoId}`;
      localStorage.removeItem(storageKey);
    }
  };

  return {
    messages,
    setMessages,
    addMessage,
    clearHistory,
  };
};
