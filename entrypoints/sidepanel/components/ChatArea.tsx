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
  // Helper untuk render timestamp buttons inline dari string
  const renderTimestampsInline = (text: string): React.ReactNode[] => {
    const timeRegex = /\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?(?:\s*-\s*\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?)?/g;
    let lastIndex = 0;
    const parts: React.ReactNode[] = [];
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
            className="inline bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-0.5 rounded text-xs font-medium cursor-pointer transition-colors mx-0.5"
            type="button"
          >
            [{firstTimestamp}]
          </button>
        );

        if (secondTimestamp) {
          parts.push(' - ');
          parts.push(
            <button
              key={`ts-${match.index}-2`}
              onClick={() => onJump(secondTimestamp)}
              className="inline bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-0.5 rounded text-xs font-medium cursor-pointer transition-colors mx-0.5"
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

    return parts.length > 0 ? parts : [text];
  };

  // Recursive function untuk process children dan handle timestamps
  const processChildren = (children: React.ReactNode): React.ReactNode => {
    if (typeof children === 'string') {
      // Jika string, parse timestamps
      return <>{renderTimestampsInline(children)}</>;
    }

    if (Array.isArray(children)) {
      // Jika array, process each child
      return children.map((child, idx) => <React.Fragment key={idx}>{processChildren(child)}</React.Fragment>);
    }

    if (React.isValidElement(children)) {
      // Jika React element, clone dan process children-nya
      const element = children as React.ReactElement<any>;
      if (element.props.children) {
        return React.cloneElement(element, {
          ...element.props,
          children: processChildren(element.props.children),
        });
      }
      return children;
    }

    // Untuk tipe lain (number, null, undefined), return as-is
    return children;
  };

  // Custom markdown component untuk handle timestamps dan styling
  const markdownComponents = {
    p: ({ node, children, ...props }: any) => (
      <p className="mb-2 last:mb-0" {...props}>
        {processChildren(children)}
      </p>
    ),
    ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
    li: ({ node, children, ...props }: any) => (
      <li className="text-sm" {...props}>
        {processChildren(children)}
      </li>
    ),
    strong: ({ node, children, ...props }: any) => (
      <strong className="font-bold" {...props}>
        {processChildren(children)}
      </strong>
    ),
    em: ({ node, children, ...props }: any) => (
      <em className="italic" {...props}>
        {processChildren(children)}
      </em>
    ),
    code: ({ node, inline, ...props }: any) =>
      inline ? (
        <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
      ) : (
        <code className="block bg-muted p-2 rounded text-xs font-mono mb-2 overflow-x-auto" {...props} />
      ),
    blockquote: ({ node, children, ...props }: any) => (
      <blockquote className="border-l-4 border-secondary pl-3 italic mb-2" {...props}>
        {processChildren(children)}
      </blockquote>
    ),
    a: ({ node, ...props }: any) => (
      <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
    ),
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
                // AI Message Bubble dengan markdown + timestamp button inline
                <div className="bg-popover border border-border text-foreground rounded-3xl rounded-bl-sm px-4 py-3 max-w-xs lg:max-w-md shadow-md">
                  <div className="text-sm leading-relaxed">
                    <ReactMarkdown components={markdownComponents}>{msg.content}</ReactMarkdown>
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
