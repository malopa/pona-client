import React from 'react';
import { X } from 'lucide-react';

interface AppDownloadProps {
  onClose: () => void;
}

export default function AppDownload({ onClose }: AppDownloadProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Download Our App Now!</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Get instant access to healthcare professionals and manage your health on the go.
        </p>

        <div className="space-y-3">
          <a
            href="https://play.google.com/store/apps/details?id=com.ponahealth.mobile"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.184l2.71-2.712 4.267 2.717a.99.99 0 0 1 0 1.692l-4.267 2.717-2.71-2.712 2.71-2.702zM5.865 2.658L14 10.794 5.865 18.93 5.865 2.658z"/>
            </svg>
            Play Store
          </a>
          
          <a
            href="#"
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.06-.46-2.02-.45-3.12 0-1.37.62-2.095.53-2.97-.35-4.24-4.65-3.72-11.31.94-11.69.87.06 1.51.35 2.03.35.82 0 1.39-.35 2.35-.35.85 0 1.51.35 2.03.35.52 0 2.12-.87 3.12-.35-2.51 1.67-2.12 5.37.59 6.37-.52 1.67-1.24 3.32-1.89 4.99l.01.02zM12.03 6.3c-.02-2.15 1.66-3.87 3.57-3.92.26 2.12-1.57 3.95-3.57 3.95v-.03z"/>
            </svg>
            App Store
          </a>
        </div>
      </div>
    </div>
  );
}