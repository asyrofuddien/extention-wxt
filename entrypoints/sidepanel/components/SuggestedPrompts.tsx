import React from 'react';
import { Lightbulb } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelectPrompt }) => {
  const suggestedQuestions = [
    'Apa ringkasan utama video ini?',
    'Siapa yang berbicara di video ini?',
    'Apa poin penting yang dijelaskan?',
    'Bisakah Anda membuat daftar topik yang dibahas?',
    'Apa kesimpulan dari video ini?',
  ];

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-4">
      {/* Ready Indicator */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full flex-shrink-0">
          <span className="text-white font-bold text-lg">✓</span>
        </div>
        <div>
          <p className="font-semibold text-green-900">AI Ready!</p>
          <p className="text-sm text-green-700 mt-1">
            Transkrip sudah di-load. Pilih pertanyaan atau ketik sendiri untuk memulai.
          </p>
        </div>
      </div>

      {/* Suggested Questions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <p className="font-semibold text-gray-900 text-sm">Pertanyaan Saran:</p>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {suggestedQuestions.map((question, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(question)}
              className="text-left p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 bg-white transition-all duration-200 hover:shadow-md group"
            >
              <p className="text-sm text-gray-700 group-hover:text-blue-600 font-medium">{question}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Klik pertanyaan di atas atau ketik pertanyaan Anda sendiri di input bawah
        </p>
      </div>
    </div>
  );
};
