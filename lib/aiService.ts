const BACKEND_URL = 'http://146.190.107.186:3500';

// Tipe untuk pesan chat
export type ChatMessage = {
  role: 'user' | 'ai';
  content: string;
};

// Fungsi Helper untuk konversi waktu (MM:SS ke Detik)
export const parseTimestamp = (timeStr: string): number => {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1]; // MM:SS
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
  return 0;
};

export const getVideoTranscript = async (videoId: string): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/youtube/transcript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Sesuaikan 'data.transcript' dengan format response JSON dari backend Anda
    // Misal backend return: { text: "..." } maka gunakan data.text
    return data.transcript || 'Transkrip tidak ditemukan.';
  } catch (error) {
    console.error('Gagal mengambil transkrip:', error);
    return 'Maaf, gagal mengambil transkrip dari server.';
  }
};

// 2. Gemini API Placeholder
export const askAi = async (
  question: string,
  context: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/youtube/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        context,
        conversationHistory,
      }),
    });

    const data = await response.json();
    return data.answer;
  } catch (error) {
    return 'Maaf, AI sedang tidak bisa menjawab saat ini.';
  }
};
