import React, { useRef, useEffect } from 'react';
import { Send, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InputAreaProps {
  input: string;
  loading: boolean;
  disabled: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onReset: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ input, loading, disabled, onInputChange, onSend, onReset }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 150;

      // Set height to scrollHeight (min 40px, max 150px)
      const newHeight = Math.min(Math.max(scrollHeight, 40), maxHeight);
      textarea.style.height = `${newHeight}px`;

      // Only show scrollbar when content exceeds max height
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift+Enter = new line, Enter = send
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Input Section with Reset and Send Buttons */}
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Buka video YouTube terlebih dahulu...' : 'Tanya tentang video...'}
          disabled={disabled || loading}
          rows={1}
          className="flex-1 resize-none rounded-2xl bg-card border border-input px-4 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] max-h-[150px]"
        />
        {!disabled && (
          <Button
            onClick={onReset}
            size="icon"
            className="rounded-full h-10 w-10 shrink-0"
            title="Reset percakapan dan mulai dari awal"
          >
            <RotateCcw size={20} />
          </Button>
        )}
        <Button
          onClick={onSend}
          disabled={loading || disabled}
          size="icon"
          className="rounded-full h-10 w-10 shrink-0"
          title="Kirim pesan (atau tekan Enter)"
        >
          <Send size={20} />
        </Button>
      </div>

      {/* Hint & Loading Status */}
      <div className="flex justify-between items-center px-1">
        {!disabled && !loading && (
          <p className="text-[10px] text-muted-foreground/70">
            <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">Enter</kbd> kirim •{' '}
            <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">Shift+Enter</kbd> baris baru
          </p>
        )}
        {loading && (
          <p className="text-xs text-muted-foreground text-center animate-pulse flex-1">Menunggu respons AI...</p>
        )}
      </div>
    </div>
  );
};
