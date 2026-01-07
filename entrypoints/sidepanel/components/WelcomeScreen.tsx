import React from 'react';
import { Play, Loader, Tv, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  isYouTubeVideo: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ isYouTubeVideo, error, onRetry }) => {
  // Show error state
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-destructive/10 p-4">
        <div className="text-center max-w-sm">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-destructive rounded-full shadow-lg">
              <AlertCircle className="w-12 h-12 text-destructive-foreground" />
            </div>
          </div>

          {/* Error Title */}
          <h2 className="text-2xl font-bold text-destructive mb-3">Transkrip Gagal Dimuat</h2>

          {/* Error Message */}
          <p className="text-destructive/80 mb-6 text-sm leading-relaxed">{error}</p>

          {/* Retry Button */}
          <Button onClick={onRetry} className="inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Coba Lagi
          </Button>

          {/* Help Text */}
          <p className="text-xs text-destructive/70 mt-6">
            Pastikan Anda sedang menonton video YouTube yang memiliki transkrip
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary rounded-full shadow-lg">
            {isYouTubeVideo ? (
              <Loader className="w-12 h-12 text-primary-foreground animate-spin" />
            ) : (
              <Play className="w-12 h-12 text-primary-foreground fill-primary-foreground" />
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-foreground mb-8 leading-relaxed text-base">
          {isYouTubeVideo ? (
            <>
              <span className="block mb-2 font-medium">AI sedang mempelajari transkrip video...</span>
              <span className="text-sm text-muted-foreground">Tunggu sebentar, jangan tutup panel ini</span>
            </>
          ) : (
            <>
              <span className="block mb-3 font-medium">YouTube AI Sidekick Anda</span>
              <span className="text-sm text-muted-foreground">
                Buka video YouTube untuk memulai percakapan dengan AI
              </span>
            </>
          )}
        </p>

        {/* Loading Animation */}
        {isYouTubeVideo && (
          <div className="flex gap-2 justify-center mb-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}

        {/* Illustration */}
        {!isYouTubeVideo && (
          <div className="mt-8 p-6 bg-card rounded-2xl border-2 border-dashed border-border shadow-sm">
            <Tv className="w-20 h-20 text-primary mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
};
