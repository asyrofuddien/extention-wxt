import { useState, useEffect } from 'react';
import { getVideoTranscript } from '../../../lib/aiService';
import { getTranscriptCache, saveTranscriptCache } from '../lib/transcriptCache';

interface UseTranscriptReturn {
  transcript: string;
  loading: boolean;
  error: string | null;
  videoUrl: string;
  videoId: string | null;
  language: string;
  reset: () => void;
  retry: () => void;
  setLanguage: (lang: string) => void;
}

export const useTranscript = (): UseTranscriptReturn => {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [lastProcessedUrl, setLastProcessedUrl] = useState('');
  const [language, setLanguageState] = useState<string>(() => {
    // Load language preference dari localStorage, default: 'id'
    try {
      return localStorage.getItem('transcript_language') || 'id';
    } catch {
      return 'id';
    }
  });

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

          // Cek cache terlebih dahulu
          const cachedTranscript = getTranscriptCache(id, language);
          if (cachedTranscript && !forceLoad) {
            // Gunakan transcript dari cache dengan loading animation brief
            setTranscript(cachedTranscript);
            setError(null);
            // Show loading state briefly even for cached transcripts (better UX)
            setTimeout(() => setLoading(false), 300);
            return;
          }

          // Jika tidak ada di cache atau forceLoad, load dari backend dengan lang parameter
          try {
            const text = await getVideoTranscript(id, language);
            setTranscript(text);
            setError(null);
            // Save ke cache setelah berhasil load dari backend
            saveTranscriptCache(id, text, language);
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
  }, [videoUrl, language]); // Re-load saat language berubah

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

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('transcript_language', lang);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  return {
    transcript,
    loading,
    error,
    videoUrl,
    videoId,
    language,
    reset,
    retry,
    setLanguage,
  };
};
