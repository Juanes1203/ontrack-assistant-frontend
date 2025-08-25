import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import './LanguageSelector.css';

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Español (España)', flag: '🇪🇸' },
  { code: 'es-MX', name: 'Español (México)', flag: '🇲🇽' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'zh-CN', name: '中文 (简体)', flag: '🇨🇳' },
  { code: 'zh-TW', name: '中文 (繁體)', flag: '🇹🇼' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onLanguageChange
}) => {
  const selectedLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <Select value={language} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-[200px] bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          <SelectValue>
            {selectedLanguage && (
              <div className="flex items-center space-x-2">
                <span className="text-lg">{selectedLanguage.flag}</span>
                <span className="font-semibold text-gray-900">{selectedLanguage.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-200 shadow-lg">
          {languages.map((lang) => (
            <SelectItem 
              key={lang.code} 
              value={lang.code}
              className="!text-gray-900 hover:!bg-blue-50 hover:!text-blue-900 focus:!bg-blue-100 focus:!text-blue-900 data-[state=checked]:!bg-blue-100 data-[state=checked]:!text-blue-900 [&>span]:!text-gray-900 [&>span]:hover:!text-blue-900 [&>span]:focus:!text-blue-900 [&>span]:data-[state=checked]:!text-blue-900"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium !text-gray-900">{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}; 