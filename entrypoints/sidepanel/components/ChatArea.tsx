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
    <div className="flex-1 overflow-y-auto p-4" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {messages.length === 0 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#999', fontSize: '14px' }}>Mulai percakapan dengan AI tentang video ini...</p>
        </div>
      ) : (
        messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'user' ? (
              // User Message Bubble
              <div
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '24px',
                  borderBottomRightRadius: '4px',
                  padding: '12px 16px',
                  maxWidth: '85%',
                  wordWrap: 'break-word',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  fontSize: '14px',
                }}
              >
                <p style={{ margin: 0, lineHeight: 1.5 }}>{msg.content}</p>
              </div>
            ) : (
              // AI Message Bubble
              <div
                style={{
                  backgroundColor: 'white',
                  color: '#111',
                  border: '1px solid #d1d5db',
                  borderRadius: '24px',
                  borderBottomLeftRadius: '4px',
                  padding: '12px 16px',
                  maxWidth: '85%',
                  wordWrap: 'break-word',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  fontSize: '14px',
                }}
              >
                <p style={{ margin: 0, lineHeight: 1.5 }}>{renderMessageContent(msg.content)}</p>
              </div>
            )}
          </div>
        ))
      )}

      {/* Loading Bubble */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <LoadingBubble speed="normal" />
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
