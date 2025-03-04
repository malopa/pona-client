import { useState, useEffect } from 'react';

export function useLanguage() {
  const [language, setLanguage] = useState(() => 
    localStorage.getItem('preferredLanguage') || 'en'
  );

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
    document.documentElement.lang = language;
  }, [language]);

  return { language, setLanguage };
}