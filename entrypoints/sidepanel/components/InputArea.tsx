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
    <div
      style={{
        borderTop: '1px solid #e5e7eb',
        paddingTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Reset Button - subtle */}
      {!disabled && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#666',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#333';
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#666';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Reset percakapan dan mulai dari awal"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      )}

      {/* Input Section */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Buka video YouTube terlebih dahulu...' : 'Tanya tentang video...'}
          disabled={disabled || loading}
          style={{
            flex: 1,
            border: disabled || loading ? '1px solid #e5e7eb' : '1px solid #d1d5db',
            borderRadius: '16px',
            padding: '10px 16px',
            fontSize: '14px',
            backgroundColor: disabled || loading ? '#f9fafb' : 'white',
            color: disabled || loading ? '#9ca3af' : '#111',
            outline: 'none',
            transition: 'all 0.2s',
          }}
          onFocus={(e) =>
            !disabled && !loading && (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(220, 38, 38, 0.1)')
          }
          onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
        />
        <button
          onClick={onSend}
          disabled={loading || disabled}
          style={{
            backgroundColor: loading || disabled ? '#d1d5db' : '#dc2626',
            color: 'white',
            border: 'none',
            padding: '10px 12px',
            borderRadius: '16px',
            cursor: loading || disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => !loading && !disabled && (e.currentTarget.style.backgroundColor = '#b91c1c')}
          onMouseLeave={(e) => !loading && !disabled && (e.currentTarget.style.backgroundColor = '#dc2626')}
          title="Kirim pesan (atau tekan Enter)"
        >
          <Send size={20} />
        </button>
      </div>

      {/* Loading Status */}
      {loading && (
        <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', animation: 'pulse 2s infinite' }}>
          Menunggu respons AI...
        </p>
      )}
    </div>
  );
};
