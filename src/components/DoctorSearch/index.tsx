import React, { useState } from 'react';
import { Search, Plus, Loader2, AlertCircle, Rocket, Globe2, Users, Stethoscope } from 'lucide-react';
import { doctorsData } from '../FeaturedDoctors/doctorsData';
import DoctorCard from '../FeaturedDoctors/DoctorCard';
import { getRelevantDoctors } from '../utils/doctorUtils';

const healthProblems = [
  { id: 'maternal', label: 'Maternal Health', icon: '👶' },
  { id: 'male', label: 'Male Reproduction', icon: '♂️' },
  { id: 'mental', label: 'Mental Health', icon: '🧠' },
  { id: 'head', label: 'Head Pain', icon: '🤕' },
  { id: 'stomach', label: 'Stomach Pain', icon: '🤢' },
  { id: 'heart', label: 'Heart Problems', icon: '❤️' },
  { id: 'cancer', label: 'Cancer', icon: '🎗️' },
  { id: 'diabetes', label: 'Diabetes', icon: '💉' },
  { id: 'skin', label: 'Skin Problems', icon: '🔬' },
  { id: 'bone', label: 'Bone & Joint', icon: '🦴' },
  { id: 'eye', label: 'Eye Problems', icon: '👁️' },
  { id: 'dental', label: 'Dental Care', icon: '🦷' },
  { id: 'pregnancy', label: 'Pregnancy', icon: '🤰' },
  { id: 'hiv', label: 'HIV/AIDS', icon: '🏥' },
  { id: 'child', label: 'Child Health', icon: '👶' },
  { id: 'respiratory', label: 'Respiratory', icon: '🫁' },
  { id: 'blood', label: 'Blood Pressure', icon: '🩸' },
  { id: 'kidney', label: 'Kidney Problems', icon: '🫘' },
  { id: 'thyroid', label: 'Thyroid Issues', icon: '🦒' },
  { id: 'liver', label: 'Liver Problems', icon: '🫀' },
  { id: 'joint', label: 'Joint Pain', icon: '🦿' },
  { id: 'ear', label: 'Ear Problems', icon: '👂' },
  { id: 'allergy', label: 'Allergies', icon: '🤧' },
  { id: 'sleep', label: 'Sleep Issues', icon: '😴' },
  { id: 'other', label: 'Other Problems', icon: '➕' }
];

const countryFlags: Record<string, string> = {
  'USA': '🇺🇸',
  'South Africa': '🇿🇦',
  'Tanzania': '🇹🇿',
  'Germany': '🇩🇪',
  'UAE': '🇦🇪',
  'UK': '🇬🇧',
  'Kenya': '🇰🇪',
  'Uganda': '🇺🇬',
  'Rwanda': '🇷🇼',
  'Burundi': '🇧🇮'
};

// Countries where service is coming soon
const comingSoonCountries = ['USA', 'Germany', 'UAE', 'UK'];

// Ordered countries array
const orderedCountries = [
  { name: 'South Africa', flag: countryFlags['South Africa'] },
  { name: 'Tanzania', flag: countryFlags['Tanzania'] },
  { name: 'Kenya', flag: countryFlags['Kenya'] },
  { name: 'Rwanda', flag: countryFlags['Rwanda'] },
  { name: 'Uganda', flag: countryFlags['Uganda'] },
  { name: 'Burundi', flag: countryFlags['Burundi'] },
  { name: 'USA', flag: countryFlags['USA'] },
  { name: 'Germany', flag: countryFlags['Germany'] },
  { name: 'UAE', flag: countryFlags['UAE'] },
  { name: 'UK', flag: countryFlags['UK'] }
];

export default function DoctorSearch() {
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchPass, setSearchPass] = useState(0);

  const isComingSoon = comingSoonCountries.includes(selectedCountry);

  const toggleProblem = (problemId: string) => {
    setSelectedProblems(prev => 
      prev.includes(problemId) 
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry || selectedProblems.length === 0) return;

    if (isComingSoon) {
      return;
    }

    setIsSearching(true);
    setSearchPass(1);
    setSearchResults([]);

    // First pass
    setTimeout(() => {
      setSearchPass(2);
      // Second pass
      setTimeout(() => {
        setSearchPass(3);
        // Third pass and results
        setTimeout(() => {
          const countryDoctors = doctorsData[selectedCountry] || [];
          const results = getRelevantDoctors(countryDoctors, selectedProblems);
          setSearchResults(results);
          setIsSearching(false);
          setSearchPass(0);
        }, 2000);
      }, 2000);
    }, 2000);
  };

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Find the Right Doctor for You
        </h2>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-3">Select Health Problems</h3>
            <div className="flex flex-wrap gap-1.5">
              {healthProblems.map(problem => (
                <button
                  key={problem.id}
                  onClick={() => toggleProblem(problem.id)}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-all duration-200 flex items-center gap-1.5
                    ${selectedProblems.includes(problem.id)
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-emerald-500 hover:bg-emerald-50'
                    }`}
                >
                  <span className="text-base">{problem.icon}</span>
                  <span>{problem.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-base font-semibold mb-3">Select Country</h3>
            <div className="flex flex-wrap gap-1.5">
              {orderedCountries.map(({ name, flag }) => (
                <button
                  key={name}
                  onClick={() => setSelectedCountry(name)}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-all duration-200 flex items-center gap-1.5
                    ${selectedCountry === name
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-emerald-500 hover:bg-emerald-50'
                    }`}
                >
                  <span>{flag}</span>
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={!selectedCountry || selectedProblems.length === 0 || isSearching}
            className="w-full bg-emerald-500 text-white py-2.5 px-4 rounded-lg
                     hover:bg-emerald-600 transition-colors disabled:bg-gray-300
                     disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {isSearching ? (
              <span>
                {searchPass === 1 && "Searching doctors..."}
                {searchPass === 2 && "Analyzing specialties..."}
                {searchPass === 3 && "Finding best matches..."}
              </span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search Doctors</span>
              </>
            )}
          </button>

          {isSearching && (
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full
                            animate-[search-progress_3s_ease-in-out_infinite] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
                              animate-[glow_2s_ease-in-out_infinite]" />
              </div>
            </div>
          )}
        </div>

        {/* Coming Soon Message */}
        {selectedCountry && isComingSoon && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 
                              rounded-full blur-xl opacity-20 animate-pulse" />
                <Rocket className="w-20 h-20 mx-auto text-emerald-500 relative animate-bounce" />
              </div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 
                           bg-clip-text text-transparent mb-4">
                Coming Soon to {selectedCountry}!
              </h2>
              
              <p className="text-gray-600 mb-8 text-lg">
                We're expanding our healthcare network to {selectedCountry}! Our team is working 
                diligently to bring you access to top-quality healthcare professionals in your region.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <Globe2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Global Network</h3>
                  <p className="text-sm text-gray-600">Connecting with international healthcare experts</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <Users className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Local Partners</h3>
                  <p className="text-sm text-gray-600">Building relationships with local providers</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <Stethoscope className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Quality Care</h3>
                  <p className="text-sm text-gray-600">Ensuring highest standards of healthcare</p>
                </div>
              </div>

              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 
                             rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-xl 
                             hover:shadow-emerald-500/30 transition-all transform hover:scale-105 
                             active:scale-95">
                Get Notified When We Launch
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {searchResults.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                {...doctor}
                country={selectedCountry}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}