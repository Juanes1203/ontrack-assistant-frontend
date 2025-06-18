import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, X } from 'lucide-react';

interface MultiLanguageSelectorProps {
  selectedLanguages: string[];
  onLanguagesChange: (languages: string[]) => void;
}

const availableLanguages = [
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

export const MultiLanguageSelector: React.FC<MultiLanguageSelectorProps> = ({
  selectedLanguages,
  onLanguagesChange
}) => {
  const addLanguage = (languageCode: string) => {
    if (!selectedLanguages.includes(languageCode)) {
      onLanguagesChange([...selectedLanguages, languageCode]);
    }
  };

  const removeLanguage = (languageCode: string) => {
    if (selectedLanguages.length > 1) {
      onLanguagesChange(selectedLanguages.filter(lang => lang !== languageCode));
    }
  };

  const getLanguageInfo = (code: string) => {
    return availableLanguages.find(lang => lang.code === code);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Idiomas de Reconocimiento</span>
      </div>
      
      {/* Selected Languages */}
      <div className="flex flex-wrap gap-2">
        {selectedLanguages.map(langCode => {
          const langInfo = getLanguageInfo(langCode);
          return (
            <Badge 
              key={langCode} 
              variant="secondary" 
              className="flex items-center space-x-1 px-3 py-1"
            >
              <span>{langInfo?.flag}</span>
              <span>{langInfo?.name}</span>
              {selectedLanguages.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(langCode)}
                  className="h-4 w-4 p-0 ml-1 hover:bg-gray-200"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </Badge>
          );
        })}
      </div>

      {/* Available Languages */}
      <div className="border rounded-lg p-3 bg-gray-50">
        <p className="text-xs text-gray-600 mb-2">Agregar idioma:</p>
        <div className="flex flex-wrap gap-1">
          {availableLanguages
            .filter(lang => !selectedLanguages.includes(lang.code))
            .map(lang => (
              <Button
                key={lang.code}
                variant="outline"
                size="sm"
                onClick={() => addLanguage(lang.code)}
                className="h-7 px-2 text-xs"
              >
                <span className="mr-1">{lang.flag}</span>
                {lang.name}
              </Button>
            ))}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        El reconocimiento de voz funcionará simultáneamente en todos los idiomas seleccionados.
      </p>
    </div>
  );
}; 