import { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { askAi, parseTimestamp, ChatMessage } from '../../lib/aiService';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';
import { useTranscript } from './hooks/useTranscript';

type Message = ChatMessage;

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  // Hook untuk handle transcript loading
  const { transcript, loading: transcriptLoading, videoUrl, videoId, reset: resetTranscript } = useTranscript();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Reset ketika video berubah
  useEffect(() => {
    setMessages([]);
  }, [videoId]);

  // 2. Kirim Pesan ke AI
  const handleSend = async () => {
    if (!input.trim() || loading || !transcript) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await askAi(userMsg, transcript, messages);
      setMessages((prev) => [...prev, { role: 'system', content: response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'system', content: 'Maaf, terjadi kesalahan. Coba lagi nanti.' }]);
    } finally {
      setLoading(false);
    }
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
    setMessages([]);
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
      <div className="border-b border-gray-200 bg-gradient-to-r from-red-600 to-orange-600 px-4 py-3.5 shadow-sm">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Play className="w-5 h-5" /> Aforsy - YouTube AI Sidekick
        </h1>
        <p className="text-red-100 text-xs mt-1">Your smart video companion</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Welcome Screen atau Chat Area */}
        {!isYouTubeVideo || isLoadingTranscript ? (
          <WelcomeScreen isYouTubeVideo={isLoadingTranscript} />
        ) : (
          <>
            {/* Chat Area */}
            <ChatArea messages={messages} loading={loading} onJump={handleJump} messagesEndRef={messagesEndRef} />

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
    </div>
  );
}

export default App;
