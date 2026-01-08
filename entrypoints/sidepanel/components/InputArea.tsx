import React, { useRef, useEffect, useState } from 'react';
import { Send, RotateCcw, Eye, EyeOff, HelpCircle, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
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
  const [showPreview, setShowPreview] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Check if input contains markdown syntax
  const hasMarkdown = /(\*\*|__|`|\*|_|#{1,6}\s|>\s|\d+\.\s|-\s|\[.*\]\(.*\))/.test(input);

  // Helper to wrap selected text with markdown syntax
  const wrapSelection = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = input.substring(start, end);

    const newText = input.substring(0, start) + before + selectedText + after + input.substring(end);
    onInputChange(newText);

    // Set cursor position after update
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        // If text was selected, select the wrapped text
        textarea.setSelectionRange(start + before.length, end + before.length);
      } else {
        // If no selection, put cursor between the markers
        textarea.setSelectionRange(start + before.length, start + before.length);
      }
    }, 0);
  };

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

    // Markdown shortcuts (Ctrl/Cmd + key)
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b': // Bold
          e.preventDefault();
          wrapSelection('**', '**');
          break;
        case 'i': // Italic
          e.preventDefault();
          wrapSelection('*', '*');
          break;
        case 'k': // Link
          e.preventDefault();
          const textarea = textareaRef.current;
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = input.substring(start, end);
            if (selectedText) {
              // Wrap selected text as link text
              const newText = input.substring(0, start) + '[' + selectedText + '](url)' + input.substring(end);
              onInputChange(newText);
              setTimeout(() => {
                textarea.focus();
                // Select "url" part for easy replacement
                textarea.setSelectionRange(start + selectedText.length + 3, start + selectedText.length + 6);
              }, 0);
            } else {
              wrapSelection('[', '](url)');
            }
          }
          break;
        case 'e': // Inline code
          e.preventDefault();
          wrapSelection('`', '`');
          break;
        case 'u': // Strikethrough (like underline in word processors)
          e.preventDefault();
          wrapSelection('~~', '~~');
          break;
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Markdown Preview - shows when preview enabled and has content */}
      {showPreview && input.trim() && (
        <div className="bg-card/50 border border-input rounded-xl px-4 py-2 text-sm max-h-[100px] overflow-y-auto">
          <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Preview</p>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{input}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Input Section with Reset and Send Buttons */}
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled ? 'Buka video YouTube terlebih dahulu...' : 'Tanya tentang video... (supports **markdown**)'
          }
          disabled={disabled || loading}
          rows={1}
          className="flex-1 resize-none rounded-2xl bg-card border border-input px-4 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] max-h-[150px]"
        />
        {/* Preview Toggle Button - only show when markdown detected */}
        {hasMarkdown && !disabled && (
          <Button
            onClick={() => setShowPreview(!showPreview)}
            size="icon"
            variant={showPreview ? 'default' : 'outline'}
            className="rounded-full h-10 w-10 shrink-0"
            title={showPreview ? 'Sembunyikan preview' : 'Tampilkan preview markdown'}
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        )}
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
      <div className="flex justify-between items-center px-1 relative">
        {!disabled && !loading && (
          <p className="text-[10px] text-muted-foreground/70 flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">Enter</kbd> kirim •{' '}
            <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">Shift+Enter</kbd> baris baru
            {hasMarkdown && ' ✨'}
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className={`ml-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium transition-all cursor-pointer ${
                showShortcuts
                  ? 'bg-primary/80 text-primary-foreground ring-2 ring-primary/30'
                  : 'bg-primary text-primary-foreground'
              }`}
              title="Lihat semua shortcuts"
            >
              <HelpCircle size={10} />
              <span>Help !</span>
            </button>
          </p>
        )}
        {loading && (
          <p className="text-xs text-muted-foreground text-center animate-pulse flex-1">Menunggu respons AI...</p>
        )}

        {/* Shortcuts Popup */}
        {showShortcuts && (
          <div className="absolute bottom-full left-0 mb-2 bg-card border border-input rounded-xl shadow-lg p-3 w-64 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-semibold text-foreground">Keyboard Shortcuts</h4>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Kirim pesan</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Enter</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Baris baru</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Shift+Enter</kbd>
              </div>
              <div className="border-t border-input my-2"></div>
              <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide mb-1">Markdown Format</p>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  <strong>Bold</strong>
                </span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl+B</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  <em>Italic</em>
                </span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl+I</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  <code className="text-[10px] bg-muted px-1 rounded">Code</code>
                </span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl+E</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Link</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl+K</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  <s>Strikethrough</s>
                </span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl+U</kbd>
              </div>
              <div className="border-t border-input my-2"></div>
              <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide mb-1">Syntax Manual</p>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">• Bullet list</span>
                <code className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">- item</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">1. Numbered</span>
                <code className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">1. item</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-semibold">Heading</span>
                <code className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono"># text</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground border-l-2 border-muted-foreground/50 pl-1">Quote</span>
                <code className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">&gt; text</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">─── Line</span>
                <code className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">---</code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
