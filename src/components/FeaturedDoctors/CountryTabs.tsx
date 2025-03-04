import React from 'react';

interface CountryTabsProps {
  countries: Array<{
    code: string;
    name: string;
    flag: string;
  }>;
  activeCountry: string;
  onSelect: (country: string) => void;
}

export default function CountryTabs({ countries, activeCountry, onSelect }: CountryTabsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {countries.map(({ code, name, flag }) => (
        <button
          key={code}
          onClick={() => onSelect(code)}
          className={`px-6 py-2 rounded-full transition-colors flex items-center gap-2 ${
            activeCountry === code
              ? 'bg-emerald-500 text-white'
              : 'bg-white text-gray-700 hover:bg-emerald-50'
          }`}
        >
          <span className="text-base">{flag}</span>
          <span className="text-sm font-medium">{name}</span>
        </button>
      ))}
    </div>
  );
}