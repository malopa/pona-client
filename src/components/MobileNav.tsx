import React from 'react';
import { Home, Search, Phone, User, Share2 } from 'lucide-react';

export default function MobileNav() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pona Health',
          text: 'Find and connect with healthcare professionals',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <nav className="flex justify-around items-center h-16">
        <a href="#" className="flex flex-col items-center text-gray-600 hover:text-emerald-500">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </a>
        <a href="#" className="flex flex-col items-center text-gray-600 hover:text-emerald-500">
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Search</span>
        </a>
        <a href="tel:+1234567890" className="flex flex-col items-center text-gray-600 hover:text-emerald-500">
          <Phone className="h-6 w-6" />
          <span className="text-xs mt-1">Call</span>
        </a>
        <button 
          onClick={handleShare}
          className="flex flex-col items-center text-gray-600 hover:text-emerald-500"
        >
          <Share2 className="h-6 w-6" />
          <span className="text-xs mt-1">Share</span>
        </button>
        <a href="#" className="flex flex-col items-center text-gray-600 hover:text-emerald-500">
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </a>
      </nav>
    </div>
  );
}