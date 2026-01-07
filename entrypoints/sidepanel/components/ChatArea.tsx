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
            onClick={() => {
              console.log('Jump to:', firstTimestamp);
              onJump(firstTimestamp);
            }}
            className="inline-block bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded text-xs font-medium cursor-pointer transition-colors flex-shrink-0"
            type="button"
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
              onClick={() => {
                console.log('Jump to:', secondTimestamp);
                onJump(secondTimestamp);
              }}
              className="inline-block bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded text-xs font-medium cursor-pointer transition-colors flex-shrink-0"
              type="button"
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

    // Map parts to ensure proper rendering with keys
    return parts.map((part, idx) => (typeof part === 'string' ? <span key={`text-${idx}`}>{part}</span> : part));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-muted-foreground text-sm">Mulai percakapan dengan AI tentang video ini...</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                // User Message Bubble
                <div className="bg-primary text-primary-foreground rounded-3xl rounded-tr-sm px-4 py-3 max-w-xs lg:max-w-md wrap-break-word shadow-md">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              ) : (
                // AI Message Bubble dengan timestamp button
                <div className="bg-popover border border-border text-foreground rounded-3xl rounded-bl-sm px-4 py-3 max-w-xs lg:max-w-md shadow-md">
                  <div className="text-sm leading-relaxed flex flex-wrap items-start gap-1">
                    {renderMessageContent(msg.content)}
                  </div>
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
