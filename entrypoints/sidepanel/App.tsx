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
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from './components/mode-toggle';

type Message = ChatMessage;

function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const mainContentRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  // Hook untuk handle transcript loading
  const {
    transcript,
    title,
    durationMinutes,
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

  // Handle scroll to show/hide header
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const element = e.target as HTMLDivElement;
      const currentScrollY = element.scrollTop;

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShowHeader(false);
      } else {
        // Scrolling up
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

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
      const response = await askAi(userMsg, transcript, messages, durationMinutes);
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
    console.log('handleJump called with:', timeStr);
    const seconds = parseTimestamp(timeStr);
    console.log('Parsed seconds:', seconds);

    try {
      // Kirim pesan ke Content Script
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      console.log('Active tabs:', tabs);

      const [tab] = tabs;
      if (tab?.id) {
        console.log('Sending message to tab:', tab.id);
        try {
          await browser.tabs.sendMessage(tab.id, {
            action: 'JUMP_TO_TIMESTAMP',
            seconds,
          });
          console.log('Message sent successfully');
        } catch (sendError: any) {
          console.error('Send message error:', sendError.message);
          // Fallback: Try using scripting API to execute code directly
          console.log('Attempting fallback with executeScript...');
          try {
            await (browser.scripting as any).executeScript({
              target: { tabId: tab.id },
              function: (seconds: number) => {
                const video = document.querySelector('video');
                if (video) {
                  video.currentTime = seconds;
                  video.play();
                  console.log('Script executed - jumped to:', seconds);
                }
              },
              args: [seconds],
            });
          } catch (scriptError) {
            console.error('Scripting API error:', scriptError);
          }
        }
      } else {
        console.error('No active tab found');
      }
    } catch (error) {
      console.error('Error in handleJump:', error);
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
    <div className="flex flex-col h-screen bg-background">
      {/* Header - Hide on scroll */}
      <div className={`transition-all duration-300 overflow-hidden ${showHeader ? 'h-auto' : 'h-0'}`}>
        <Card className="border-0 rounded-none bg-primary px-4 py-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-2">
              <img src="/icon/16.png" alt="Aforsy" className="w-6 h-6" />
              <h1 className="text-sm font-bold text-primary-foreground">Aforsy - YouTube AI Sidekick</h1>
            </div>
            {/* Right: Theme Toggle & Language Selector */}
            <div className="flex items-center gap-2">
              <ModeToggle />
              <LanguageSelector currentLang={language} onLanguageChange={setLanguage} videoId={videoId} />
            </div>
          </div>
        </Card>
        <Separator className="h-0.5" />
      </div>

      {/* Main Content */}
      <div ref={mainContentRef} className="flex-1 flex flex-col overflow-hidden">
        {/* Welcome Screen jika error ada */}
        {transcriptError ? (
          <WelcomeScreen isYouTubeVideo={true} error={transcriptError} onRetry={retryTranscript} />
        ) : !isYouTubeVideo || isLoadingTranscript ? (
          <WelcomeScreen isYouTubeVideo={isLoadingTranscript} />
        ) : (
          <>
            {/* Video Title Header - Sticky/Floating */}
            {title && (
              <>
                <Card className="sticky top-0 z-10 rounded-none border-0 px-4 py-3 shadow-sm bg-secondary/20">
                  <p className="text-xs font-medium text-secondary-foreground uppercase tracking-wide mb-1">Title</p>
                  <p className="text-sm font-semibold text-foreground line-clamp-2">{title}</p>
                </Card>
                <Separator className="h-0.5" />
              </>
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
            <Separator className="h-0.5" />
            <Card className="rounded-none border-0 bg-secondary p-4 shadow-sm">
              <InputArea
                input={input}
                loading={loading}
                disabled={!canChat}
                onInputChange={setInput}
                onSend={handleSend}
                onReset={handleReset}
              />
            </Card>
          </>
        )}
      </div>

      {/* Credit Footer */}
      <Separator className="h-0.5" />
      <Card className="rounded-none border-0 bg-secondary/30 px-4 py-2 text-center shadow-sm">
        <p className="text-xs text-muted-foreground">Created by Muhammad Asyrofuddien</p>
      </Card>
    </div>
  );
}

export default App;
