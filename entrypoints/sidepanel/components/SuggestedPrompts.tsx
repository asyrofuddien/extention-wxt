import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
      <Card className="border-green-200 bg-green-50/50 p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-green-900 text-sm">AI Ready!</p>
          <p className="text-xs text-green-700 mt-1">
            Transkrip sudah di-load. Pilih pertanyaan atau ketik sendiri untuk memulai.
          </p>
        </div>
      </Card>

      {/* Suggested Questions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <p className="font-semibold text-sm">Pertanyaan Saran:</p>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {suggestedQuestions.map((question, idx) => (
            <Button
              key={idx}
              onClick={() => onSelectPrompt(question)}
              variant="outline"
              className="text-left h-auto p-3 justify-start"
            >
              <p className="text-sm">{question}</p>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
