interface CachedTranscript {
  videoId: string;
  transcript: string;
  timestamp: number;
}

const MAX_CACHED_TRANSCRIPTS = 5;
const CACHE_PREFIX = 'transcript_cache_';
const CACHE_INDEX_KEY = 'transcript_cache_index';

export const getTranscriptCache = (videoId: string): string | null => {
  try {
    const key = `${CACHE_PREFIX}${videoId}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      const data = JSON.parse(cached) as CachedTranscript;
      return data.transcript;
    }
  } catch (error) {
    console.error('Error reading transcript cache:', error);
  }
  return null;
};

export const saveTranscriptCache = (videoId: string, transcript: string) => {
  try {
    const key = `${CACHE_PREFIX}${videoId}`;
    const data: CachedTranscript = {
      videoId,
      transcript,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(data));

    // Update index
    updateCacheIndex(videoId);
  } catch (error) {
    console.error('Error saving transcript cache:', error);
  }
};

const updateCacheIndex = (videoId: string) => {
  try {
    let index: string[] = [];
    const cached = localStorage.getItem(CACHE_INDEX_KEY);
    if (cached) {
      index = JSON.parse(cached);
    }

    // Hapus videoId kalo sudah ada (untuk update position)
    index = index.filter((id) => id !== videoId);

    // Tambah videoId di awal (most recent)
    index.unshift(videoId);

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
      index.forEach((videoId) => {
        const key = `${CACHE_PREFIX}${videoId}`;
        localStorage.removeItem(key);
      });
    }
    localStorage.removeItem(CACHE_INDEX_KEY);
  } catch (error) {
    console.error('Error clearing transcript cache:', error);
  }
};
