import React, { useState, useEffect } from 'react';
import CountryTabs from './CountryTabs';
import DoctorCard from './DoctorCard';
import { Rocket, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { doctorsData } from './doctorsData';

const countries = [
  { code: 'South Africa', name: 'South Africa', flag: '🇿🇦' },
  { code: 'Tanzania', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'Kenya', name: 'Kenya', flag: '🇰🇪' },
  { code: 'Rwanda', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'Uganda', name: 'Uganda', flag: '🇺🇬' },
  { code: 'Burundi', name: 'Burundi', flag: '🇧🇮' }
];

// Coming soon countries
const comingSoonCountries = ['USA', 'UK', 'UAE', 'Germany'];

export default function FeaturedDoctors() {
  const [activeCountry, setActiveCountry] = useState('South Africa');
  const [featuredDoctors, setFeaturedDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const isComingSoon = comingSoonCountries.includes(activeCountry);

  useEffect(() => {
    if (!isComingSoon) {
      fetchFeaturedDoctors(activeCountry);
    }
  }, [activeCountry, isComingSoon]);

  const fetchFeaturedDoctors = async (country: string) => {
    try {
      setIsLoading(true);
      setError('');

      // First try to get doctors from Supabase
      const { data: dbDoctors, error } = await supabase
        .from('doctors')
        .select(`
          id,
          specialty,
          experience_years,
          bio,
          is_verified,
          is_featured,
          rating,
          profile:profiles (
            full_name,
            email,
            phone,
            country,
            avatar_url
          )
        `)
        .eq('is_featured', true)
        .eq('is_verified', true)
        .eq('profiles.country', country);

      if (error) throw error;

      // If no doctors in database, use mock data
      if (!dbDoctors || dbDoctors.length === 0) {
        const mockDoctors = doctorsData[country] || [];
        setFeaturedDoctors(mockDoctors);
      } else {
        // Transform database doctors to match DoctorCard props
        const transformedDoctors = dbDoctors.map(doc => ({
          id: doc.id,
          name: doc.profile.full_name,
          specialty: doc.specialty,
          rating: doc.rating,
          image: doc.profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.profile.full_name)}&background=random`
        }));
        setFeaturedDoctors(transformedDoctors);
      }
    } catch (err) {
      console.error('Error fetching featured doctors:', err);
      // Fallback to mock data on error
      const mockDoctors = doctorsData[country] || [];
      setFeaturedDoctors(mockDoctors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Featured Doctors
        </h2>
        
        <CountryTabs
          countries={countries}
          activeCountry={activeCountry}
          onSelect={setActiveCountry}
        />

        {isComingSoon ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 
                              rounded-full blur-xl opacity-20 animate-pulse" />
                <Rocket className="w-20 h-20 mx-auto text-emerald-500 relative animate-bounce" />
              </div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 
                           bg-clip-text text-transparent mb-4">
                Coming Soon to {activeCountry}!
              </h2>
              
              <p className="text-gray-600 mb-8 text-lg">
                We're expanding our healthcare network to {activeCountry}! Our team is working 
                diligently to bring you access to top-quality healthcare professionals in your region.
              </p>

              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 
                             rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-xl 
                             hover:shadow-emerald-500/30 transition-all transform hover:scale-105 
                             active:scale-95">
                Get Notified When We Launch
              </button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : featuredDoctors.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {featuredDoctors.map((doctor) => (
              <DoctorCard 
                key={doctor.id} 
                {...doctor} 
                country={activeCountry}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Featured Doctors
            </h3>
            <p className="text-gray-600">
              There are currently no featured doctors in {activeCountry}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}