import { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { askAi, parseTimestamp, ChatMessage } from '../../lib/aiService';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';
import { SuggestedPrompts } from './components/SuggestedPrompts';
import { LanguageSelector } from './components/LanguageSelector';
import { useTranscript } from './hooks/useTranscript';
import { useChatHistory } from './hooks/useChatHistory';

type Message = ChatMessage;

function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  // Hook untuk handle transcript loading
  const {
    transcript,
    title,
    loading: transcriptLoading,
    videoUrl,
    videoId,
    language,
    error: transcriptError,
    reset: resetTranscript,
    retry: retryTranscript,
    setLanguage,
  } = useTranscript();

  // Hook untuk manage per-video chat history
  const { messages, setMessages, addMessage, clearHistory, setTitle: setChatTitle } = useChatHistory(videoId);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Update chat title when transcript title changes
  useEffect(() => {
    if (title && videoId) {
      setChatTitle(title);
    }
  }, [title, videoId, setChatTitle]);

  // Hapus: Reset ketika video berubah - sudah di-handle di useChatHistory

  // 2. Kirim Pesan ke AI
  const handleSend = async () => {
    if (!input.trim() || loading || !transcript) return;

    const userMsg = input;
    addMessage({ role: 'user', content: userMsg });
    setInput('');
    setLoading(true);

    try {
      const response = await askAi(userMsg, transcript, messages);
      addMessage({ role: 'system', content: response });
    } catch (error) {
      addMessage({ role: 'system', content: 'Maaf, terjadi kesalahan. Coba lagi nanti.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle suggested prompt selection
  const handleSelectPrompt = (prompt: string) => {
    setInput(prompt);
  };

  // 3. Fungsi Jump to Timestamp
  const handleJump = async (timeStr: string) => {
    const seconds = parseTimestamp(timeStr);

    // Kirim pesan ke Content Script
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      browser.tabs.sendMessage(tab.id, {
        action: 'JUMP_TO_TIMESTAMP',
        seconds,
      });
    }
  };

  // 4. Reset chat history saja
  const handleReset = () => {
    clearHistory();
    setInput('');
  };

  // Determine state
  const isYouTubeVideo = videoUrl.includes('youtube.com/watch');
  const isLoadingTranscript = transcriptLoading;
  const hasTranscript = transcript.length > 0;
  const canChat = hasTranscript && !isLoadingTranscript;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-linear-to-r from-red-600 to-orange-600 px-4 py-3.5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Play className="w-5 h-5" /> Aforsy - YouTube AI Sidekick
          </h1>
          <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
        </div>
        <p className="text-red-100 text-xs mt-1">Your smart video companion</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Welcome Screen jika error ada */}
        {transcriptError ? (
          <WelcomeScreen isYouTubeVideo={true} error={transcriptError} onRetry={retryTranscript} />
        ) : !isYouTubeVideo || isLoadingTranscript ? (
          <WelcomeScreen isYouTubeVideo={isLoadingTranscript} />
        ) : (
          <>
            {/* Video Title Header - Sticky/Floating */}
            {title && (
              <div className="sticky top-0 z-10 bg-linear-to-r from-red-50 to-orange-50 border-b-2 border-red-200 px-4 py-3 shadow-sm">
                <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">Title</p>
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{title}</p>
              </div>
            )}

            {/* Show Suggested Prompts if no messages yet, otherwise show Chat Area */}
            {messages.length === 0 ? (
              <SuggestedPrompts onSelectPrompt={handleSelectPrompt} />
            ) : (
              <ChatArea
                messages={messages}
                videoTitle={title}
                loading={loading}
                onJump={handleJump}
                messagesEndRef={messagesEndRef}
              />
            )}

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white p-4">
              <InputArea
                input={input}
                loading={loading}
                disabled={!canChat}
                onInputChange={setInput}
                onSend={handleSend}
                onReset={handleReset}
              />
            </div>
          </>
        )}
      </div>

      {/* Credit Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-center">
        <p className="text-xs text-gray-500">Created by Muhammad Asyrofuddien</p>
      </div>
    </div>
  );
}

export default App;
