import React from 'react';
import { Play, Loader, Tv } from 'lucide-react';

interface WelcomeScreenProps {
  isYouTubeVideo: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ isYouTubeVideo }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-lg">
            {isYouTubeVideo ? (
              <Loader className="w-12 h-12 text-white animate-spin" />
            ) : (
              <Play className="w-12 h-12 text-white fill-white" />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-bold text-gray-900 mb-4">{isYouTubeVideo ? 'Sedang Loading...' : 'Aforsy'}</h2>

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
