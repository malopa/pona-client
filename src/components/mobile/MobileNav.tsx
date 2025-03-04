import React from 'react';
import { Home, Stethoscope, Calendar, Menu } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center ${
            activeTab === 'home' ? 'text-emerald-500' : 'text-gray-500'
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">{t('nav.home')}</span>
        </button>

        <button
          onClick={() => onTabChange('diagnosis')}
          className={`flex flex-col items-center ${
            activeTab === 'diagnosis' ? 'text-emerald-500' : 'text-gray-500'
          }`}
        >
          <Stethoscope className="h-6 w-6" />
          <span className="text-xs mt-1">{t('nav.diagnosis')}</span>
        </button>

        <button
          onClick={() => onTabChange('appointments')}
          className={`flex flex-col items-center ${
            activeTab === 'appointments' ? 'text-emerald-500' : 'text-gray-500'
          }`}
        >
          <Calendar className="h-6 w-6" />
          <span className="text-xs mt-1">{t('nav.appointments')}</span>
        </button>

        <button
          onClick={() => onTabChange('more')}
          className={`flex flex-col items-center ${
            activeTab === 'more' ? 'text-emerald-500' : 'text-gray-500'
          }`}
        >
          <Menu className="h-6 w-6" />
          <span className="text-xs mt-1">{t('nav.more')}</span>
        </button>
      </div>
    </nav>
  );
}