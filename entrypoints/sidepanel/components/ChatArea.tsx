import React from 'react';
import { ChatMessage } from '../../../lib/aiService';
import { LoadingBubble } from './LoadingBubble';

interface ChatBubble extends ChatMessage {
  isLoading?: boolean;
}

interface ChatAreaProps {
  messages: ChatBubble[];
  videoTitle?: string;
  loading: boolean;
  onJump: (timestamp: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, videoTitle, loading, onJump, messagesEndRef }) => {
  // Render message content dengan timestamp detection - simple & reliable
  const renderMessageContent = (text: string) => {
    // Match format: [HH:MM:SS], HH:MM:SS, dan range [HH:MM:SS] - [HH:MM:SS]
    const timeRegex = /\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?(?:\s*-\s*\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?)?/g;

    let lastIndex = 0;
    const parts: (string | React.ReactElement)[] = [];
    let match;

    while ((match = timeRegex.exec(text)) !== null) {
      // Add text sebelum timestamp
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const firstTimestamp = match[1];
      const secondTimestamp = match[2];

      if (firstTimestamp) {
        // Button untuk first timestamp
        parts.push(
          <button
            key={`ts-${match.index}`}
            onClick={() => onJump(firstTimestamp)}
            className="inline-block text-blue-600 hover:text-blue-700 hover:underline font-semibold bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded transition-colors duration-200 mx-0.5 hover:cursor-pointer"
          >
            [{firstTimestamp}]
          </button>
        );

        if (secondTimestamp) {
          // Add " - " separator
          parts.push(' - ');

          // Button untuk second timestamp (range)
          parts.push(
            <button
              key={`ts-${match.index}-2`}
              onClick={() => onJump(secondTimestamp)}
              className="inline-block text-blue-600 hover:text-blue-700 hover:underline font-semibold bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded transition-colors duration-200 mx-0.5 hover:cursor-pointer"
            >
              [{secondTimestamp}]
            </button>
          );
        }
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Chat Messages */}
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
              // AI Message Bubble dengan timestamp button
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
    </div>
  );
};
