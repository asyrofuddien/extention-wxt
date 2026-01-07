import React from 'react';
import { ChatMessage } from '../../../lib/aiService';
import { LoadingBubble } from './LoadingBubble';

interface ChatBubble extends ChatMessage {
  isLoading?: boolean;
}

interface ChatAreaProps {
  messages: ChatBubble[];
  loading: boolean;
  onJump: (timestamp: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, loading, onJump, messagesEndRef }) => {
  // Regex untuk mendeteksi timestamp
  const renderMessageContent = (text: string) => {
    const timeRegex = /(\d{1,2}:\d{2}(?::\d{2})?)/g;
    const parts = text.split(timeRegex);

    return parts.map((part, index) => {
      if (timeRegex.test(part)) {
        return (
          <button
            key={index}
            onClick={() => onJump(part)}
            className="inline-block text-blue-600 hover:text-blue-700 hover:underline font-semibold bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded transition-colors duration-200 mx-0.5"
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center">
          <p className="text-gray-500 text-sm">Mulai percakapan dengan AI tentang video ini...</p>
        </div>
      ) : (
        messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'user' ? (
              // User Message Bubble
              <div className="bg-blue-600 text-white rounded-3xl rounded-tr-sm px-4 py-3 max-w-xs lg:max-w-md break-words shadow-md">
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            ) : (
              // AI Message Bubble
              <div className="bg-white border border-gray-300 text-gray-900 rounded-3xl rounded-bl-sm px-4 py-3 max-w-xs lg:max-w-md break-words shadow-md">
                <p className="text-sm leading-relaxed">{renderMessageContent(msg.content)}</p>
              </div>
            )}
          </div>
        ))
      )}

      {/* Loading Bubble */}
      {loading && (
        <div className="flex justify-start">
          <LoadingBubble speed="normal" />
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
