import React from 'react';
import { Baby, Heart, Tooth, Stethoscope, Flower2 } from 'lucide-react';

const healthcareAreas = [
  {
    title: 'Reproductive Health',
    description: 'Comprehensive care for reproductive wellness and family planning',
    icon: Flower2,
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    title: 'Non-Communicable Diseases',
    description: 'Management and prevention of chronic conditions',
    icon: Heart,
    gradient: 'from-purple-500 to-indigo-500'
  },
  {
    title: 'Child Health',
    description: 'Specialized pediatric care for growing children',
    icon: Baby,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Maternal Health',
    description: 'Complete care through pregnancy and beyond',
    icon: Stethoscope,
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    title: 'Oral Health',
    description: 'Professional dental care and oral hygiene',
    icon: Tooth,
    gradient: 'from-orange-500 to-amber-500'
  }
];

export default function HealthcareProblems() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Making Healthcare Accessible
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthcareAreas.map(({ title, description, icon: Icon, gradient }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl p-1 hover:scale-105 transition-transform duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
              
              <div className="relative p-6 h-full flex flex-col items-center text-white">
                <div className="rounded-full bg-white/20 p-4 mb-4 backdrop-blur-sm">
                  <Icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2 text-center">
                  {title}
                </h3>
                
                <p className="text-white/90 text-center text-sm">
                  {description}
                </p>
                
                <div className="mt-4">
                  <button className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors text-sm">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}