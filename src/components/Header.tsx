import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Languages, ChevronDown, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useTranslation } from '../hooks/useTranslation';
import { supabase } from '../lib/supabase';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' }
];

export default function Header() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useTranslation();
  const [showLanguages, setShowLanguages] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const userAuth = localStorage.getItem('userAuth') === 'true';
      setIsAuthenticated(userAuth);
    };

    checkAuth();
    // Listen for storage changes (in case of login/logout in other tabs)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLanguageSelect = (code: string) => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.language = code;
    localStorage.setItem('userData', JSON.stringify(userData));
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('userAuth');
      localStorage.removeItem('userData');
      navigate('/');
      window.location.reload(); // Refresh to update all components
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const currentLanguageInfo = languages.find(lang => lang.code === currentLanguage);

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Logo />
            <span className="ml-2 text-xl font-semibold text-gray-900">{t('app.name')}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-emerald-500 transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/appointments"
                className="text-gray-700 hover:text-emerald-500 transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('nav.appointments')}
              </Link>
              <Link
                to="/doctors"
                className="text-gray-700 hover:text-emerald-500 transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                Doctors
              </Link>
              <Link
                to="/subscriptions"
                className="text-gray-700 hover:text-emerald-500 transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('nav.subscriptions')}
              </Link>
            </nav>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 
                         transition-colors text-sm font-medium text-gray-700"
              >
                <Languages className="w-5 h-5" />
                <span>{currentLanguageInfo?.flag}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showLanguages ? 'rotate-180' : ''}`} />
              </button>

              {showLanguages && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 
                             border border-gray-100 animate-fade-in">
                  {languages.map(({ code, name, flag }) => (
                    <button
                      key={code}
                      onClick={() => handleLanguageSelect(code)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 
                               transition-colors flex items-center gap-2"
                    >
                      <span className="text-lg">{flag}</span>
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg 
                         shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 
                         transition-all transform hover:scale-105 active:scale-95"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('settings.logout')}</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 
                         text-white px-4 py-2 rounded-lg shadow-lg shadow-emerald-500/20
                         hover:shadow-xl hover:shadow-emerald-500/30 transition-all transform 
                         hover:scale-105 active:scale-95"
              >
                <UserPlus className="w-5 h-5" />
                <span>{t('auth.login')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}