import React, { useState, useEffect } from 'react';
import { Search, Rocket, Globe2, Users, Stethoscope, BellRing, Heart, Shield, Clock, Star } from 'lucide-react';
import Logo from '../Logo';
import DoctorSearch from './DoctorSearch';
import FeaturedDoctors from './FeaturedDoctors';
import CarePlans from './CarePlans';

// Default banner images focused on African healthcare
const defaultBanners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&h=300',
    title: 'Quality Healthcare for All',
    description: 'Connect with top doctors anytime, anywhere',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1584516150909-c43483ee7932?auto=format&fit=crop&w=800&h=300',
    title: 'Early Detection of Diseases',
    description: 'Get expert medical advice early',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&h=300',
    title: 'Affordable Healthcare',
    description: 'Quality care within your reach',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&h=300',
    title: 'Quality Healthcare Everywhere',
    description: 'Breaking barriers in healthcare access',
    gradient: 'from-amber-500 to-orange-600'
  }
];

// Value proposition banners
const valuePropositions = [
  {
    id: 1,
    icon: Heart,
    title: 'Expert Care',
    description: 'Top doctors at your service',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 2,
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Verified professionals',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 3,
    icon: Clock,
    title: '24/7 Access',
    description: 'Healthcare anytime',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 4,
    icon: Star,
    title: 'Quality First',
    description: 'Best-in-class service',
    gradient: 'from-emerald-500 to-teal-600'
  }
];

// Countries where service is coming soon
const comingSoonCountries = ['USA', 'Germany', 'UAE', 'UK'];

interface MobileHomeProps {
  country: string;
  language: string;
}

export default function MobileHome({ country = 'Tanzania', language }: MobileHomeProps) {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const isComingSoon = comingSoonCountries.includes(country);

  // Get banners from localStorage or use defaults
  const banners = JSON.parse(localStorage.getItem('mobileBanners') || JSON.stringify(defaultBanners));

  useEffect(() => {
    // Banner rotation
    const bannerTimer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    // Value proposition rotation
    const valueTimer = setInterval(() => {
      setCurrentValue((prev) => (prev + 1) % valuePropositions.length);
    }, 3000);

    return () => {
      clearInterval(bannerTimer);
      clearInterval(valueTimer);
    };
  }, [banners.length]);

  const handleCountrySelect = (newCountry: string) => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.country = newCountry;
    localStorage.setItem('userData', JSON.stringify(userData));
    window.location.reload();
  };

  if (isComingSoon) {
    return (
      <div className="min-h-screen bg-gray-50 pt-14 px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in">
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur-xl opacity-20 animate-pulse" />
              <Rocket className="w-20 h-20 mx-auto text-emerald-500 relative animate-bounce" />
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-4">
              Coming Soon to {country}!
            </h2>
            
            <p className="text-gray-600 mb-8 text-lg">
              We're expanding our healthcare network to {country}! Our team is working 
              diligently to bring you access to top-quality healthcare professionals in your region.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <Globe2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Global Network</h3>
                <p className="text-sm text-gray-600">Connecting with experts</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <Users className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Local Partners</h3>
                <p className="text-sm text-gray-600">Building relationships</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <Stethoscope className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Quality Care</h3>
                <p className="text-sm text-gray-600">Highest standards</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowCountrySelector(true)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Globe2 className="w-5 h-5" />
                Change Country
              </button>

              <button
                className="w-full bg-white border border-emerald-500 text-emerald-600 px-6 py-3 rounded-lg hover:bg-emerald-50 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <BellRing className="w-5 h-5" />
                Notify Me When Available
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-50">
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
              className="w-full pl-9 pr-4 py-1.5 text-sm rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/80 backdrop-blur-sm"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="mt-14">
        {/* Banner Slider */}
        <div className="px-4 pt-4">
          <div className="relative h-36 rounded-2xl overflow-hidden shadow-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {banners.map((banner) => (
                <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${banner.gradient} opacity-60`} />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-lg font-bold mb-1">{banner.title}</h3>
                    <p className="text-white/90 text-sm">{banner.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {banners.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    currentBanner === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Doctor Search Section */}
        <DoctorSearch country={country} />

        {/* Value Proposition Banners */}
        <div className="px-4 py-6">
          <div className="relative h-24 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out absolute inset-0"
              style={{ transform: `translateX(-${currentValue * 100}%)` }}
            >
              {valuePropositions.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.id}
                    className="w-full flex-shrink-0 px-2"
                  >
                    <div className={`bg-gradient-to-r ${value.gradient} rounded-xl p-4 h-full shadow-lg transform transition-transform hover:scale-[1.02]`}>
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm">{value.title}</h3>
                          <p className="text-white/90 text-xs">{value.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center mt-3 gap-1">
            {valuePropositions.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  currentValue === index ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Featured Doctors */}
        <FeaturedDoctors country={country} />

        {/* Care Plans */}
        <CarePlans country={country} />
      </div>
    </div>
  );
}