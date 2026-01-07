import { useState, useEffect } from 'react';
import { getVideoTranscript } from '../../../lib/aiService';

interface UseTranscriptReturn {
  transcript: string;
  loading: boolean;
  error: string | null;
  videoUrl: string;
  videoId: string | null;
  reset: () => void;
}

export const useTranscript = (): UseTranscriptReturn => {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);

  const loadTranscript = async () => {
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const url = tabs[0]?.url;

      if (!url) {
        setTranscript('');
        setVideoUrl('');
        setVideoId(null);
        return;
      }

      // Cek apakah URL berubah
      if (url === videoUrl) return;

      setVideoUrl(url);

      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        const id = urlObj.searchParams.get('v') || 'unknown';
        setVideoId(id);
        setLoading(true);
        setError(null);

        try {
          const text = await getVideoTranscript(id);
          setTranscript(text);
        } catch (err) {
          setError('Gagal memuat transkrip. Coba lagi nanti.');
          setTranscript('');
        } finally {
          setLoading(false);
        }
      } else {
        setTranscript('');
        setVideoId(null);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memproses URL');
    }
  };

  useEffect(() => {
    // Load pertama kali
    loadTranscript();

    // Polling untuk deteksi perubahan URL
    const interval = setInterval(loadTranscript, 1500);

    return () => clearInterval(interval);
  }, [videoUrl]);

  const reset = () => {
    setTranscript('');
    setVideoUrl('');
    setVideoId(null);
    setError(null);
    setLoading(false);
  };

  return {
    transcript,
    loading,
    error,
    videoUrl,
    videoId,
    reset,
  };
};
