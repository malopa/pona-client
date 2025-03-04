import React, { useState } from 'react';
import { 
  User, Info, CreditCard, FileText, AlertCircle, LogOut,
  ChevronRight, Bell, Settings, HelpCircle, Globe2, Languages
} from 'lucide-react';
import { signOut } from '../../lib/supabase';
import { useTranslation } from '../../hooks/useTranslation';

interface MoreProps {
  onLogout: () => void;
}

const countries = [
  { code: 'South Africa', name: 'South Africa', flag: '🇿🇦' },
  { code: 'Tanzania', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'Kenya', name: 'Kenya', flag: '🇰🇪' },
  { code: 'Uganda', name: 'Uganda', flag: '🇺🇬' },
  { code: 'Rwanda', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'Burundi', name: 'Burundi', flag: '🇧🇮' }
];

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' }
];

export default function More({ onLogout }: MoreProps) {
  const { t } = useTranslation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      localStorage.removeItem('userAuth');
      localStorage.removeItem('userData');
      onLogout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
      setIsLoggingOut(false);
    }
  };

  const handleCountrySelect = (code: string) => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.country = code;
    localStorage.setItem('userData', JSON.stringify(userData));
    window.location.reload();
  };

  const handleLanguageSelect = (code: string) => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.language = code;
    localStorage.setItem('userData', JSON.stringify(userData));
    window.location.reload();
  };

  if (showCountrySelector) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => setShowCountrySelector(false)}
            className="bg-gray-100 p-2 rounded-lg"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            {t('settings.changeCountry')}
          </h2>
        </div>

        <div className="space-y-3">
          {countries.map(({ code, name, flag }) => (
            <button
              key={code}
              onClick={() => handleCountrySelect(code)}
              className="w-full bg-white rounded-xl p-4 flex items-center gap-3
                       shadow-sm hover:shadow-md transition-all transform hover:scale-[1.02]
                       active:scale-98 duration-200"
            >
              <span className="text-2xl">{flag}</span>
              <span className="font-medium text-gray-900">{name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showLanguageSelector) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => setShowLanguageSelector(false)}
            className="bg-gray-100 p-2 rounded-lg"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            {t('settings.changeLanguage')}
          </h2>
        </div>

        <div className="space-y-3">
          {languages.map(({ code, name, flag }) => (
            <button
              key={code}
              onClick={() => handleLanguageSelect(code)}
              className="w-full bg-white rounded-xl p-4 flex items-center gap-3
                       shadow-sm hover:shadow-md transition-all transform hover:scale-[1.02]
                       active:scale-98 duration-200"
            >
              <span className="text-2xl">{flag}</span>
              <span className="font-medium text-gray-900">{name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-500 text-white p-2 rounded-lg">
          <User className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
          {t('settings.title')}
        </h2>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setShowCountrySelector(true)}
          className="w-full bg-white rounded-xl p-4 flex items-center justify-between
                   shadow-sm hover:shadow-md transition-all transform hover:scale-[1.02]
                   active:scale-98 duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 p-2 rounded-lg text-amber-500">
              <Globe2 className="h-5 w-5" />
            </div>
            <span className="font-medium text-gray-900">{t('settings.changeCountry')}</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <button
          onClick={() => setShowLanguageSelector(true)}
          className="w-full bg-white rounded-xl p-4 flex items-center justify-between
                   shadow-sm hover:shadow-md transition-all transform hover:scale-[1.02]
                   active:scale-98 duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
              <Languages className="h-5 w-5" />
            </div>
            <span className="font-medium text-gray-900">{t('settings.changeLanguage')}</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full mt-6 bg-red-50 text-red-500 rounded-xl p-4 flex items-center gap-3
                   hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">
            {isLoggingOut ? t('settings.loggingOut') : t('settings.logout')}
          </span>
        </button>
      </div>
    </div>
  );
}