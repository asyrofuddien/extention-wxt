import { useState, useEffect } from 'react';
import { getVideoTranscript } from '../../../lib/aiService';

interface UseTranscriptReturn {
  transcript: string;
  loading: boolean;
  error: string | null;
  videoUrl: string;
  videoId: string | null;
  reset: () => void;
  retry: () => void;
}

export const useTranscript = (): UseTranscriptReturn => {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [lastProcessedUrl, setLastProcessedUrl] = useState('');

  const loadTranscript = async (forceLoad = false) => {
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const url = tabs[0]?.url;

      if (!url) {
        setTranscript('');
        setVideoUrl('');
        setVideoId(null);
        return;
      }

      setVideoUrl(url);

      // Hanya load jika URL berubah atau force retry
      if (url !== lastProcessedUrl || forceLoad) {
        setLastProcessedUrl(url);

        if (url.includes('youtube.com/watch')) {
          const urlObj = new URL(url);
          const id = urlObj.searchParams.get('v') || 'unknown';
          setVideoId(id);
          setLoading(true);
          setError(null);

          try {
            const text = await getVideoTranscript(id);
            setTranscript(text);
            setError(null);
          } catch (err) {
            setError('Gagal memuat transkrip. Klik "Coba Lagi" untuk mencoba kembali.');
            setTranscript('');
          } finally {
            setLoading(false);
          }
        } else {
          setTranscript('');
          setVideoId(null);
          setError(null);
        }
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memproses URL');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load hanya sekali saat URL berubah
    loadTranscript(false);
  }, [videoUrl]);

  useEffect(() => {
    // Deteksi perubahan URL tab
    const checkUrl = async () => {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const currentUrl = tabs[0]?.url || '';
      if (currentUrl && currentUrl !== videoUrl) {
        setVideoUrl(currentUrl);
      }
    };

    const interval = setInterval(checkUrl, 1500);
    return () => clearInterval(interval);
  }, [videoUrl]);

  const reset = () => {
    setTranscript('');
    setVideoUrl('');
    setVideoId(null);
    setError(null);
    setLoading(false);
  };

  const retry = () => {
    setError(null);
    setLoading(true);
    loadTranscript(true); // forceLoad = true untuk retry
  };

  return {
    transcript,
    loading,
    error,
    videoUrl,
    videoId,
    reset,
    retry,
  };
};
