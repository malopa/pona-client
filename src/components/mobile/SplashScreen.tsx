import React, { useEffect } from 'react';
import Logo from '../Logo';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-emerald-500 to-emerald-600 flex items-center justify-center">
      <div className="flex flex-col items-center animate-fade-in">
        <Logo className="h-24 w-24 text-white" />
        <h1 className="mt-4 text-2xl font-bold text-white">Pona Health</h1>
        <p className="mt-2 text-emerald-100">Your Health, Our Priority</p>
      </div>
    </div>
  );
}