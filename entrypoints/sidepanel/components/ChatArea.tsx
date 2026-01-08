import React from 'react';
import ReactMarkdown from 'react-markdown';
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
  // Custom markdown component untuk handle timestamps dan styling
  const markdownComponents = {
    p: ({ node, ...props }: any) => <p className="mb-2 last:mb-0" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
    li: ({ node, ...props }: any) => <li className="text-sm" {...props} />,
    strong: ({ node, ...props }: any) => <strong className="font-bold" {...props} />,
    em: ({ node, ...props }: any) => <em className="italic" {...props} />,
    code: ({ node, inline, ...props }: any) =>
      inline ? (
        <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
      ) : (
        <code className="block bg-muted p-2 rounded text-xs font-mono mb-2 overflow-x-auto" {...props} />
      ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="border-l-4 border-secondary pl-3 italic mb-2" {...props} />
    ),
    a: ({ node, ...props }: any) => (
      <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
    ),
  };

  // Render message content dengan timestamp detection dan markdown
  const renderMessageContent = (text: string) => {
    // Match format: [HH:MM:SS], HH:MM:SS, dan range [HH:MM:SS] - [HH:MM:SS]
    const timeRegex = /\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?(?:\s*-\s*\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?)?/g;

    let lastIndex = 0;
    const parts: (string | React.ReactElement)[] = [];
    let match;

    while ((match = timeRegex.exec(text)) !== null) {
      // Add text sebelum timestamp (render sebagai markdown)
      if (match.index > lastIndex) {
        const textPart = text.substring(lastIndex, match.index);
        parts.push(
          <ReactMarkdown key={`md-${lastIndex}`} components={markdownComponents}>
            {textPart}
          </ReactMarkdown>
        );
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

    // Add remaining text (render sebagai markdown)
    if (lastIndex < text.length) {
      const textPart = text.substring(lastIndex);
      parts.push(
        <ReactMarkdown key={`md-${lastIndex}`} components={markdownComponents}>
          {textPart}
        </ReactMarkdown>
      );
    }

    return parts;
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
                // AI Message Bubble dengan markdown + timestamp button
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
