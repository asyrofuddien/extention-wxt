import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAvailableLangs } from '@/lib/aiService';

interface LanguageSelectorProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  videoId: string | null;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onLanguageChange, videoId }) => {
  const [availableLangs, setAvailableLangs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const languages = [
    { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' }, // Added for example
  ];

  useEffect(() => {
    const fetchAvailableLangs = async () => {
      const data = await getAvailableLangs(videoId, currentLang);
      if (data.status) {
        setAvailableLangs(data.availableLangs);

        // Apply language selection rule
        let defaultLang = '';
        if (data.availableLangs.includes('id')) {
          defaultLang = 'id';
        } else if (data.availableLangs.includes('en')) {
          defaultLang = 'en';
        } else if (data.availableLangs.length > 0) {
          defaultLang = [...data.availableLangs].sort()[0];
        }
        // Only change if not already set
        if (defaultLang && defaultLang !== currentLang) {
          onLanguageChange(defaultLang);
        }
      }
      setLoading(false);
    };
    fetchAvailableLangs();
  }, [videoId]);

  const availableLanguages = languages.filter((lang) => availableLangs.includes(lang.code));

  const currentLanguage = availableLanguages.find((lang) => lang.code === currentLang);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return (
    <Select value={currentLang} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-auto border-0 bg-secondary text-base p-4">
        <SelectValue>{currentLanguage?.flag}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableLanguages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
