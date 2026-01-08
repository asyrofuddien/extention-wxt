interface CachedTranscript {
  videoId: string;
  language: string;
  transcript: string;
  title?: string;
  durationMinutes?: number;
  timestamp: number;
}

const MAX_CACHED_TRANSCRIPTS = 5;
const CACHE_PREFIX = 'transcript_cache_';
const CACHE_INDEX_KEY = 'transcript_cache_index';

export const getTranscriptCache = (
  videoId: string,
  language: string = 'id'
): { transcript: string; title?: string; durationMinutes?: number } | null => {
  try {
    const key = `${CACHE_PREFIX}${videoId}_${language}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      const data = JSON.parse(cached) as CachedTranscript;
      return { transcript: data.transcript, title: data.title, durationMinutes: data.durationMinutes };
    }
  } catch (error) {
    console.error('Error reading transcript cache:', error);
  }
  return null;
};

export const saveTranscriptCache = (
  videoId: string,
  transcript: string,
  language: string = 'id',
  title: string = '',
  durationMinutes: number = 0
) => {
  try {
    const key = `${CACHE_PREFIX}${videoId}_${language}`;
    const data: CachedTranscript = {
      videoId,
      language,
      transcript,
      title: title || '',
      durationMinutes,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(data));

    // Update index
    updateCacheIndex(`${videoId}_${language}`);
  } catch (error) {
    console.error('Error saving transcript cache:', error);
  }
};

const updateCacheIndex = (cacheKey: string) => {
  try {
    let index: string[] = [];
    const cached = localStorage.getItem(CACHE_INDEX_KEY);
    if (cached) {
      index = JSON.parse(cached);
    }

    // Hapus cacheKey kalo sudah ada (untuk update position)
    index = index.filter((id) => id !== cacheKey);

    // Tambah cacheKey di awal (most recent)
    index.unshift(cacheKey);

    // Jika lebih dari 5, hapus yang paling lama
    if (index.length > MAX_CACHED_TRANSCRIPTS) {
      const toRemove = index.pop();
      if (toRemove) {
        const removeKey = `${CACHE_PREFIX}${toRemove}`;
        localStorage.removeItem(removeKey);
      }
    }

    localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
  } catch (error) {
    console.error('Error updating cache index:', error);
  }
};

export const clearTranscriptCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_INDEX_KEY);
    if (cached) {
      const index = JSON.parse(cached) as string[];
      index.forEach((cacheKey) => {
        const key = `${CACHE_PREFIX}${cacheKey}`;
        localStorage.removeItem(key);
      });
    }
    localStorage.removeItem(CACHE_INDEX_KEY);
  } catch (error) {
    console.error('Error clearing transcript cache:', error);
  }
};
