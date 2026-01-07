import React from 'react';
import { Play, Loader, Tv, AlertCircle, RotateCcw } from 'lucide-react';

interface WelcomeScreenProps {
  isYouTubeVideo: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ isYouTubeVideo, error, onRetry }) => {
  // Show error state
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-red-50 p-4">
        <div className="text-center max-w-sm">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500 rounded-full shadow-lg">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Error Title */}
          <h2 className="text-2xl font-bold text-red-900 mb-3">Transkrip Gagal Dimuat</h2>

          {/* Error Message */}
          <p className="text-red-700 mb-6 text-sm leading-relaxed">{error}</p>

          {/* Retry Button */}
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            Coba Lagi
          </button>

          {/* Help Text */}
          <p className="text-xs text-red-600 mt-6">
            Pastikan Anda sedang menonton video YouTube yang memiliki transkrip
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-linear-to-br from-red-50 via-white to-orange-50 p-4">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-red-500 to-orange-500 rounded-full shadow-lg">
            {isYouTubeVideo ? (
              <Loader className="w-12 h-12 text-white animate-spin" />
            ) : (
              <Play className="w-12 h-12 text-white fill-white" />
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-8 leading-relaxed text-base">
          {isYouTubeVideo ? (
            <>
              <span className="block mb-2 font-medium">AI sedang mempelajari transkrip video...</span>
              <span className="text-sm text-gray-500">Tunggu sebentar, jangan tutup panel ini</span>
            </>
          ) : (
            <>
              <span className="block mb-3 font-medium">YouTube AI Sidekick Anda</span>
              <span className="text-sm text-gray-600">Buka video YouTube untuk memulai percakapan dengan AI</span>
            </>
          )}
        </p>

        {/* Loading Animation */}
        {isYouTubeVideo && (
          <div className="flex gap-2 justify-center mb-4">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}

        {/* Illustration */}
        {!isYouTubeVideo && (
          <div className="mt-8 p-6 bg-white rounded-2xl border-2 border-dashed border-red-300 shadow-sm">
            <Tv className="w-20 h-20 text-red-600 mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
};
