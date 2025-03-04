import React from 'react';
import { X } from 'lucide-react';

interface LanguageSelectorProps {
  onSelect: (lang: string) => void;
  onClose: () => void;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
];

export default function LanguageSelector({ onSelect, onClose }: LanguageSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Select Language</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-2">
          {languages.map(({ code, name, flag }) => (
            <button
              key={code}
              onClick={() => onSelect(code)}
              className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-gray-50 
                       transition-colors border border-gray-200 hover:border-emerald-500"
            >
              <span className="text-2xl">{flag}</span>
              <span className="text-gray-700">{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}