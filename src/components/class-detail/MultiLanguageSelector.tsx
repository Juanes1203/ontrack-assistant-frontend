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
        <Globe className="w-5 h-5 text-blue-600" />
        <span className="text-base font-semibold text-gray-800">Idiomas de Reconocimiento</span>
      </div>
      
      {/* Selected Languages */}
      <div className="flex flex-wrap gap-2">
        {selectedLanguages.map(langCode => {
          const langInfo = getLanguageInfo(langCode);
          return (
            <Badge 
              key={langCode} 
              variant="secondary" 
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 border-2 border-blue-200 hover:bg-blue-200 transition-colors duration-200"
            >
              <span className="text-lg">{langInfo?.flag}</span>
              <span className="font-medium">{langInfo?.name}</span>
              {selectedLanguages.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(langCode)}
                  className="h-5 w-5 p-0 ml-2 hover:bg-blue-300 hover:text-blue-900 rounded-full transition-all duration-200"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </Badge>
          );
        })}
      </div>

      {/* Available Languages */}
      <div className="border-2 border-gray-300 rounded-lg p-4 bg-white shadow-sm">
        <p className="text-sm font-medium text-gray-800 mb-3">Agregar idioma:</p>
        <div className="flex flex-wrap gap-2">
          {availableLanguages
            .filter(lang => !selectedLanguages.includes(lang.code))
            .map(lang => (
              <Button
                key={lang.code}
                variant="outline"
                size="sm"
                onClick={() => addLanguage(lang.code)}
                className="h-8 px-3 text-sm border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-800 hover:text-blue-700 transition-all duration-200"
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </Button>
            ))}
        </div>
      </div>

      <p className="text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <span className="font-medium text-blue-800">ℹ️ Información:</span> El reconocimiento de voz funcionará simultáneamente en todos los idiomas seleccionados.
      </p>
    </div>
  );
}; 