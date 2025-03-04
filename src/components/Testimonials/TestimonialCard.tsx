import React from 'react';
import { Quote } from 'lucide-react';

const countryFlags: Record<string, string> = {
  Tanzania: "🇹🇿",
  Kenya: "🇰🇪",
  Uganda: "🇺🇬",
  Rwanda: "🇷🇼",
  Burundi: "🇧🇮"
};

interface TestimonialCardProps {
  text: string;
  author: string;
  country: string;
}

export default function TestimonialCard({ text, author, country }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 relative">
      <Quote className="absolute top-4 left-4 text-emerald-500/20 w-8 h-8" />
      <div className="pl-8">
        <p className="text-gray-700 mb-4 italic">{text}</p>
        <div className="text-sm">
          <p className="font-semibold text-gray-900">
            {author} <span className="ml-1">{countryFlags[country]}</span>
          </p>
          <p className="text-emerald-600">{country}</p>
        </div>
      </div>
    </div>
  );
}