import React from 'react';
import { Send, RotateCcw } from 'lucide-react';

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
    <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
      {/* Reset Button - subtle */}
      {!disabled && (
        <div className="flex justify-end">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2.5 py-1.5 rounded-md transition-all"
            title="Reset percakapan dan mulai dari awal"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      )}

      {/* Input Section */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Buka video YouTube terlebih dahulu...' : 'Tanya tentang video...'}
          disabled={disabled || loading}
          className="flex-1 border rounded-2xl px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-200 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          onClick={onSend}
          disabled={loading || disabled}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-3 py-2.5 rounded-2xl flex items-center justify-center transition-all disabled:cursor-not-allowed"
          title="Kirim pesan (atau tekan Enter)"
        >
          <Send size={20} />
        </button>
      </div>

      {/* Loading Status */}
      {loading && <p className="text-xs text-gray-400 text-center animate-pulse">Menunggu respons AI...</p>}
    </div>
  );
};
