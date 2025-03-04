import { useCallback } from 'react';
import { translations, Language, TranslationKey } from '../i18n/translations';

export function useTranslation() {
  const getLanguage = useCallback((): Language => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return (userData.language || 'en') as Language;
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    const lang = getLanguage();
    return translations[lang][key] || translations.en[key] || key;
  }, [getLanguage]);

  return { t, currentLanguage: getLanguage() };
}