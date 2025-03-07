import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Phone } from 'lucide-react';
import { isSpecialist } from '../utils/doctorUtils';
import { useTranslation } from '../../hooks/useTranslation';



interface specialistProps{
  id:number;
  name:string;
}
interface DoctorCardProps {
  id: string;
  name: string;
  specialist: specialistProps;
  rating: number;
  profile_url: string;
  country: string;
}

export default function DoctorCard({ id, name, specialist, rating, profile_url, country }: DoctorCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const _specialist = isSpecialist(specialist?.name || "General Practitioner");

  const handleBookClick = () => {
    let specialty = specialist.name
    navigate(`/book/${id}`, { 
      state: { 
        doctor: { id, name, specialty, profile_url },
        country 
      } 
    });
  };

  // Format specialty key by removing spaces and converting to lowercase
  const getSpecialtyKey = (specialty: string) => {
    return `specialty.${specialist?.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all transform hover:scale-[1.02] active:scale-98 duration-200">
      <div className="relative">
        <img 
          src={profile_url} 
          alt={name}
          className="w-full h-24 object-cover rounded-t-xl"
        />
        {_specialist && (
          <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-purple-500 text-white text-[10px] font-medium rounded-full shadow-lg">
            {t('booking.specialist')}
          </span>
        )}
      </div>
      <div className="p-2">
        <div className="mb-1">
          <h3 className="font-medium text-xs text-gray-900 truncate">{name}</h3>
          <p className="text-gray-600 text-xs truncate">{t(getSpecialtyKey(specialist?.name))}</p>
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
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-1.5 px-2 
                   rounded-lg text-xs font-medium shadow-md shadow-emerald-500/20
                   hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-95
                   flex items-center justify-center gap-1"
        >
          <Phone className="w-3 h-3" />
          {t('booking.bookCall')}
        </button>
      </div>
    </div>
  );
}