// utils/aiService.ts

// Fungsi Helper untuk konversi waktu (MM:SS ke Detik)
export const parseTimestamp = (timeStr: string): number => {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1]; // MM:SS
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
  return 0;
};

// 1. Mock Transkrip
export const getVideoTranscript = async (videoId: string): Promise<string> => {
  // Simulasi delay network
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return `Ini adalah transkrip simulasi untuk video ID ${videoId}. 
  Pada 00:30 pembicara menjelaskan tentang WXT Framework.
  Kemudian pada 02:45 mereka membahas tentang Side Panel API.
  Di akhir video pada 10:00 ada kesimpulan menarik.`;
};

// 2. Gemini API Placeholder
export const askGemini = async (question: string, context: string): Promise<string> => {
  console.log('Mengirim ke Gemini...', { question, context });

  // Simulasi delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulasi jawaban AI yang cerdas mengenali konteks
  if (question.toLowerCase().includes('side panel')) {
    return 'Berdasarkan video, Side Panel API dibahas mulai menit 02:45. Fitur ini memungkinkan ekstensi muncul di sisi browser tanpa menutupi konten utama.';
  }

  return 'Saya menganalisa video ini. Menurut transkrip (mock), ini adalah video tutorial coding. Coba lompat ke 00:30 untuk intro.';
};
