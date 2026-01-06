import { useState, useEffect, useRef } from 'react';
import { getVideoTranscript, askGemini, parseTimestamp } from '../../lib/aiService';

// Tipe untuk pesan chat
type Message = {
  role: 'user' | 'ai';
  content: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState('');

  // 1. Ambil URL saat Sidepanel dibuka
  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const url = tabs[0]?.url;
      console.log('Tab URL:', url);
      if (url && url.includes('youtube.com/watch')) {
        setVideoUrl(url);
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get('v') || 'unknown';

        // Auto-load transcript
        setLoading(true);
        getVideoTranscript(videoId).then((text) => {
          setTranscript(text);
          setMessages([
            { role: 'ai', content: 'Halo! Saya sudah membaca transkrip video ini. Ada yang ingin ditanyakan?' },
          ]);
          setLoading(false);
        });
      } else {
        setMessages([{ role: 'ai', content: 'Buka video YouTube untuk memulai percakapan.' }]);
      }
    });
  }, []);

  // 2. Kirim Pesan ke AI
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await askGemini(userMsg, transcript);
      setMessages((prev) => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', content: 'Maaf, terjadi kesalahan.' }]);
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

  // 4. Render Pesan dengan Deteksi Timestamp (Regex)
  const renderMessageContent = (text: string) => {
    // Regex untuk mendeteksi format MM:SS atau HH:MM:SS
    const timeRegex = /(\d{1,2}:\d{2}(?::\d{2})?)/g;
    const parts = text.split(timeRegex);

    return parts.map((part, index) => {
      if (timeRegex.test(part)) {
        return (
          <button
            key={index}
            onClick={() => handleJump(part)}
            className="text-blue-500 hover:underline font-bold bg-blue-100 px-1 rounded cursor-pointer mx-1"
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-4 font-sans text-sm">
      <h1 className="text-lg font-bold mb-4 text-red-600 flex items-center gap-2">Aforsy - YouTube AI Sidekick</h1>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[90%] ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white self-end ml-auto'
                : 'bg-white border border-gray-200 text-gray-800'
            }`}
          >
            {renderMessageContent(msg.content)}
          </div>
        ))}
        {loading && <div className="text-gray-400 italic text-xs">AI sedang mengetik...</div>}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Tanya tentang video..."
          disabled={!transcript}
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={handleSend}
          disabled={loading || !transcript}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}

export default App;
