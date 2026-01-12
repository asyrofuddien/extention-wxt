import { useState, useEffect } from 'react';
import { getVideoTranscript } from '../../../lib/aiService';
import { getTranscriptCache, saveTranscriptCache } from '../lib/transcriptCache';

interface UseTranscriptReturn {
  transcript: string;
  title: string;
  durationMinutes: number;
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
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(0);
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
          const cachedData = getTranscriptCache(id, language);
          if (cachedData && !forceLoad) {
            // Gunakan transcript dan title dari cache dengan loading animation brief
            setTranscript(cachedData.transcript);
            setTitle(cachedData.title || '');
            setDurationMinutes(cachedData.durationMinutes || 0);
            setError(null);
            // Show loading state briefly even for cached transcripts (better UX)
            setTimeout(() => setLoading(false), 300);
            return;
          }

          // Jika tidak ada di cache atau forceLoad, load dari backend dengan lang parameter
          try {
            const response = await getVideoTranscript(id, language);
            setTranscript(response.transcript);
            setTitle(response.title || '');
            setDurationMinutes(response.durationMinutes || 0);
            setError(null);
            // Save ke cache setelah berhasil load dari backend (include title & durationMinutes)
            saveTranscriptCache(id, response.transcript, language, response.title || '', response.durationMinutes || 0);
          } catch (err) {
            // Parse error to get specific error code and message
            let errorMessage = 'Gagal memuat transkrip. Klik "Coba Lagi" untuk mencoba kembali.';

            if (err instanceof Error) {
              const errorCode = (err as any).errorCode;

              // Map error codes to user-friendly messages
              switch (errorCode) {
                case 'NO_SUBTITLE':
                  errorMessage =
                    'Video ini tidak memiliki transcript. Silahkan pilih video lain yang memiliki transcript.';
                  break;
                case 'NO_SUBTITLE_URL':
                  errorMessage = 'Gagal mengakses transcript video. Silahkan coba lagi atau pilih video lain.';
                  break;
                case 'SUBTITLE_FETCH_FAILED':
                  errorMessage = 'Gagal mengunduh transcript. Silahkan coba lagi nanti.';
                  break;
                case 'METADATA_TOO_LARGE':
                  errorMessage = 'Video ini terlalu kompleks untuk diproses. Silahkan coba video lain.';
                  break;
                case 'NO_TRANSCRIPT':
                  errorMessage = 'Transcript tidak ditemukan untuk video ini. Silahkan coba video lain.';
                  break;
                default:
                  errorMessage = err.message || 'Gagal memuat transcript. Klik "Coba Lagi" untuk mencoba kembali.';
              }
            }

            setError(errorMessage);
            setTranscript('');
          } finally {
            setLoading(false);
          }
        } else {
          setTranscript('');
          setTitle('');
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
    // Deteksi perubahan URL tab dengan listener
    const handleTabUpdate = (tabId: number, changeInfo: any, tab: any) => {
      if (changeInfo.url && tab.active) {
        setVideoUrl(changeInfo.url);
      }
    };

    const handleTabActivated = async () => {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const currentUrl = tabs[0]?.url || '';
      if (currentUrl && currentUrl !== videoUrl) {
        setVideoUrl(currentUrl);
      }
    };

    // Listen untuk update URL
    browser.tabs.onUpdated.addListener(handleTabUpdate);
    // Listen untuk perubahan tab aktif
    browser.tabs.onActivated.addListener(handleTabActivated);

    // Fallback polling jika listener tidak cukup
    const checkUrl = async () => {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const currentUrl = tabs[0]?.url || '';
      if (currentUrl && currentUrl !== videoUrl) {
        setVideoUrl(currentUrl);
      }
    };

    const interval = setInterval(checkUrl, 800);

    return () => {
      browser.tabs.onUpdated.removeListener(handleTabUpdate);
      browser.tabs.onActivated.removeListener(handleTabActivated);
      clearInterval(interval);
    };
  }, [videoUrl]);

  const reset = () => {
    setTranscript('');
    setTitle('');
    setDurationMinutes(0);
    setVideoUrl('');
    setVideoId(null);
    setError(null);
    setLoading(false);
  };

  const retry = () => {
    setError(null);
    setLoading(true);
    loadTranscript(true);
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
    title,
    durationMinutes,
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
