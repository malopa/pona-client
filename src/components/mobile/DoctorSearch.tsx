import React, { useState, useEffect } from 'react';
import { Search, Loader2, Stethoscope } from 'lucide-react';
import { doctorsData } from '../FeaturedDoctors/doctorsData';
import DoctorCard from './DoctorCard';
import { getRelevantDoctors } from '../utils/doctorUtils';
import { useTranslation } from '../../hooks/useTranslation';

const healthProblems = [
  { id: 'maternal', label: 'health.maternal', icon: '👶' },
  { id: 'male', label: 'health.male', icon: '♂️' },
  { id: 'mental', label: 'health.mental', icon: '🧠' },
  { id: 'head', label: 'health.head', icon: '🤕' },
  { id: 'stomach', label: 'health.stomach', icon: '🤢' },
  { id: 'heart', label: 'health.heart', icon: '❤️' },
  { id: 'cancer', label: 'health.cancer', icon: '🎗️' },
  { id: 'diabetes', label: 'health.diabetes', icon: '💉' },
  { id: 'skin', label: 'health.skin', icon: '🔬' },
  { id: 'bone', label: 'health.bone', icon: '🦴' },
  { id: 'eye', label: 'health.eye', icon: '👁️' },
  { id: 'dental', label: 'health.dental', icon: '🦷' },
  { id: 'pregnancy', label: 'health.pregnancy', icon: '🤰' },
  { id: 'hiv', label: 'health.hiv', icon: '🏥' },
  { id: 'child', label: 'health.child', icon: '👶' },
  { id: 'respiratory', label: 'health.respiratory', icon: '🫁' },
  { id: 'blood', label: 'health.blood', icon: '🩸' },
  { id: 'kidney', label: 'health.kidney', icon: '🫘' },
  { id: 'thyroid', label: 'health.thyroid', icon: '🦒' },
  { id: 'liver', label: 'health.liver', icon: '🫀' },
  { id: 'joint', label: 'health.joint', icon: '🦿' },
  { id: 'ear', label: 'health.ear', icon: '👂' },
  { id: 'allergy', label: 'health.allergy', icon: '🤧' },
  { id: 'sleep', label: 'health.sleep', icon: '😴' },
  { id: 'other', label: 'health.other', icon: '➕' }
];

interface DoctorSearchProps {
  country: string;
}

export default function DoctorSearch({ country }: DoctorSearchProps) {
  const { t } = useTranslation();
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchPass, setSearchPass] = useState(0);

  const toggleProblem = (problemId: string) => {
    setSelectedProblems(prev => 
      prev.includes(problemId) 
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const handleSearch = async () => {
    if (selectedProblems.length === 0) return;

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
          const countryDoctors = doctorsData[country] || [];
          const results = getRelevantDoctors(countryDoctors, selectedProblems);
          setSearchResults(results);
          setIsSearching(false);
          setSearchPass(0);
        }, 2000);
      }, 2000);
    }, 2000);
  };

  // Clear results when problems change
  useEffect(() => {
    setSearchResults([]);
  }, [selectedProblems]);

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-emerald-500 text-white p-2 rounded-lg">
          <Stethoscope className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
          {t('search.title')}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
            {t('search.specialties')}
          </h3>
          <div className="flex flex-wrap gap-1.5 overflow-visible">
            {healthProblems.map(problem => (
              <button
                key={problem.id}
                onClick={() => toggleProblem(problem.id)}
                className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition-all
                  transform hover:scale-105 active:scale-95 duration-150
                  ${selectedProblems.includes(problem.id)
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-gray-50 border border-gray-200 hover:border-emerald-500'
                  }`}
              >
                <span>{problem.icon}</span>
                <span>{t(problem.label)}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={isSearching || selectedProblems.length === 0}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg
                   flex items-center justify-center gap-2 font-medium shadow-lg shadow-emerald-500/20
                   hover:shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02]
                   active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {searchPass === 1 && t('search.analyzing')}
              {searchPass === 2 && t('search.finding')}
              {searchPass === 3 && t('search.analyzing')}
            </span>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>{t('search.searchButton')}</span>
            </>
          )}
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
            {t('search.recommended')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {searchResults.map((doctor) => (
              <DoctorCard
                key={doctor.name}
                {...doctor}
                country={country}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}