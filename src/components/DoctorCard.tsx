import React, { useState } from 'react';
import { Star, Phone, Shield } from 'lucide-react';
import BookingModal from './booking/BookingModal';
import { countryPricing } from './booking/pricingData';
import { isSpecialist } from './utils/doctorUtils';
import AuthModal from './auth/AuthModal';

interface DoctorCardProps {
  name: string;
  specialty: string;
  rating: number;
  image: string;
  country: string;
}

export default function DoctorCard({ name, specialty, rating, image, country }: DoctorCardProps) {
  const [showBooking, setShowBooking] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const specialist = isSpecialist(specialty);

  const normalizedCountry = Object.keys(countryPricing).find(key => 
    key.toLowerCase() === country.toLowerCase() ||
    (key === 'USA' && country === 'United States') ||
    (key === 'UK' && country === 'United Kingdom') ||
    (key === 'UAE' && country === 'United Arab Emirates')
  ) || country;

  const handleBookClick = () => {
    const isAuthenticated = localStorage.getItem('userAuth') === 'true';
    if (!isAuthenticated) {
      setShowAuth(true);
    } else {
      setShowBooking(true);
    }
  };

  const handleAuthComplete = () => {
    setShowAuth(false);
    setShowBooking(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-28 object-cover"
        />
        <div className="p-2">
          <div className="flex items-start justify-between mb-1.5">
            <div>
              <h3 className="font-medium text-sm text-gray-900 truncate">{name}</h3>
              <p className="text-gray-600 text-xs truncate">{specialty}</p>
            </div>
            {specialist && (
              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                Specialist
              </span>
            )}
          </div>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <button 
            onClick={handleBookClick}
            className="w-full bg-emerald-500 text-white py-1.5 px-2 rounded text-xs font-medium
                     hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"
          >
            <Phone className="w-3 h-3" />
            Book a Call
          </button>
        </div>
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onComplete={handleAuthComplete}
          redirectPath={null}
        />
      )}

      {showBooking && (
        <BookingModal
          doctor={{ name, specialty, image }}
          country={normalizedCountry}
          onClose={() => setShowBooking(false)}
        />
      )}
    </>
  );
}