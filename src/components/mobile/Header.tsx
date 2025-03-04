import React from 'react';
import { Search } from 'lucide-react';
import Logo from '../Logo';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-50">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center">
          <Logo className="h-8 w-8 text-emerald-500" />
          <span className="ml-2 font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            Pona
          </span>
        </div>
        <div className="relative flex-1 max-w-xs ml-4">
          <input
            type="text"
            placeholder="Search doctor by name"
            className="w-full pl-9 pr-4 py-1.5 text-sm rounded-full border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     bg-gray-50/80 backdrop-blur-sm"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
}