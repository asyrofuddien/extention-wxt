import React from 'react';
import { Send, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InputAreaProps {
  input: string;
  loading: boolean;
  disabled: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onReset: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ input, loading, disabled, onInputChange, onSend, onReset }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Input Section with Reset and Send Buttons */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Buka video YouTube terlebih dahulu...' : 'Tanya tentang video...'}
          disabled={disabled || loading}
          className="rounded-full bg-card"
        />
        {!disabled && (
          <Button
            onClick={onReset}
            size="icon"
            className="rounded-full h-10 w-10 shrink-0"
            title="Reset percakapan dan mulai dari awal"
          >
            <RotateCcw size={20} />
          </Button>
        )}
        <Button
          onClick={onSend}
          disabled={loading || disabled}
          size="icon"
          className="rounded-full h-10 w-10 shrink-0"
          title="Kirim pesan (atau tekan Enter)"
        >
          <Send size={20} />
        </Button>
      </div>

      {/* Loading Status */}
      {loading && <p className="text-xs text-muted-foreground text-center animate-pulse">Menunggu respons AI...</p>}
    </div>
  );
};
