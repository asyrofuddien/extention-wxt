import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  const editorRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isRichMode, setIsRichMode] = useState(false); // Toggle between plain/rich mode

  // Close shortcuts popup with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showShortcuts) {
        setShowShortcuts(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showShortcuts]);

  // Check if input contains markdown syntax
  const hasMarkdown = /(\*\*|__|`|\*|_|#{1,6}\s|>\s|\d+\.\s|-\s|\[.*\]\(.*\))/.test(input);

  // Convert markdown to simple HTML for rich mode display
  const markdownToHtml = useCallback((text: string): string => {
    if (!text) return '';
    
    let html = text
      // Escape HTML first
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Bold **text** or __text__
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      // Italic *text* or _text_
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
      .replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '<em>$1</em>')
      // Strikethrough ~~text~~
      .replace(/~~(.+?)~~/g, '<s>$1</s>')
      // Inline code `text`
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 rounded text-xs">$1</code>')
      // Links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="text-primary underline">$1</span>')
      // Preserve line breaks
      .replace(/\n/g, '<br>');
    
    return html;
  }, []);

  // Handle rich editor input
  const handleEditorInput = useCallback(() => {
    if (editorRef.current) {
      // Get plain text from contenteditable
      const text = editorRef.current.innerText || '';
      onInputChange(text);
    }
  }, [onInputChange]);

  // Handle paste in rich editor - paste as plain text
  const handleEditorPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // Handle keydown in rich editor
  const handleEditorKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Enter without shift = send
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      onSend();
      return;
    }

    // Markdown shortcuts (Ctrl/Cmd + key)
    if (e.ctrlKey || e.metaKey) {
      const selection = window.getSelection();
      const selectedText = selection?.toString() || '';
      
      const wrapText = (before: string, after: string) => {
        e.preventDefault();
        document.execCommand('insertText', false, before + selectedText + after);
      };

      switch (e.key.toLowerCase()) {
        case 'b':
          wrapText('**', '**');
          break;
        case 'i':
          wrapText('*', '*');
          break;
        case 'e':
          wrapText('`', '`');
          break;
        case 'u':
          wrapText('~~', '~~');
          break;
        case 'k':
          e.preventDefault();
          if (selectedText) {
            document.execCommand('insertText', false, '[' + selectedText + '](url)');
          } else {
            document.execCommand('insertText', false, '[](url)');
          }
          break;
      }
    }
  }, [loading, onSend]);

  // Sync editor content when input changes externally or mode changes
  useEffect(() => {
    if (isRichMode && editorRef.current) {
      const currentText = editorRef.current.innerText || '';
      if (currentText !== input) {
        editorRef.current.innerHTML = markdownToHtml(input);
      }
    }
  }, [input, isRichMode, markdownToHtml]);

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

      {/* Input Section with Reset and Send Buttons */}
      <div className="flex gap-2 items-end">
        {/* Plain Text Mode - Textarea */}
        {!isRichMode && (
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
        )}

        {/* Rich Mode - Contenteditable with live markdown rendering */}
        {isRichMode && (
          <div
            ref={editorRef}
            contentEditable={!disabled && !loading}
            onInput={handleEditorInput}
            onKeyDown={handleEditorKeyDown}
            onPaste={handleEditorPaste}
            data-placeholder={disabled ? 'Buka video YouTube terlebih dahulu...' : 'Tanya tentang video...'}
            className={`flex-1 rounded-2xl bg-card border border-input px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[40px] max-h-[150px] overflow-y-auto whitespace-pre-wrap break-words ${
              disabled || loading ? 'cursor-not-allowed opacity-50' : ''
            } ${!input ? 'empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground' : ''}`}
            dangerouslySetInnerHTML={{ __html: markdownToHtml(input) }}
          />
        )}

        {/* Rich Mode Toggle Button */}
        {!disabled && (
          <Button
            onClick={() => setIsRichMode(!isRichMode)}
            size="icon"
            variant={isRichMode ? 'default' : 'outline'}
            className="rounded-full h-10 w-10 shrink-0"
            title={isRichMode ? 'Mode plain text' : 'Mode rich text (live preview)'}
          >
            {isRichMode ? <EyeOff size={18} /> : <Eye size={18} />}
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
