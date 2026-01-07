// const BACKEND_URL = 'http://146.190.107.186:3500';
const BACKEND_URL = 'http://localhost:8001';
// const BACKEND_URL = 'https://social-ghosts-know.loca.lt';

// Tipe untuk pesan chat
export type ChatMessage = {
  role: 'user' | 'system';
  content: string;
};

// Fungsi Helper untuk konversi waktu (MM:SS ke Detik)
export const parseTimestamp = (timeStr: string): number => {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1]; // MM:SS
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
  return 0;
};

export const getVideoTranscript = async (videoId: string, language: string = 'id'): Promise<string> => {
  const response = await fetch(`${BACKEND_URL}/api/youtube/transcript`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ videoId, lang: language }),
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.transcript) {
    throw new Error('Transkrip tidak ditemukan untuk video ini.');
  }

  return data.transcript;
};

// 2. Gemini API Placeholder
export const askAi = async (
  question: string,
  context: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> => {
  // Limit context ke 11500 characters
  const maxContextLength = 11500;
  const truncatedContext = context.length > maxContextLength ? context.substring(0, maxContextLength) + '...' : context;

  try {
    const response = await fetch(`${BACKEND_URL}/api/youtube/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        context: truncatedContext,
        conversationHistory: [],
      }),
    });

    const data = await response.json();
    return data.answer;
  } catch (error) {
    return 'Maaf, AI sedang tidak bisa menjawab saat ini.';
  }
};
