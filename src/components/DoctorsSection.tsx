import React from 'react';

// Additional doctor images for the stack
const additionalDoctors = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&h=150',
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=150&h=150'
];

export default function DoctorsSection() {
  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Speak with Our Expert Doctors
        </h2>
        <p className="text-gray-600 mb-12">
          Connect with experienced healthcare professionals ready to help you
        </p>
        
        <div className="flex flex-col items-center">
          {/* Centered overlapping doctor images */}
          <div className="relative w-[280px] h-24 mx-auto mb-12">
            {additionalDoctors.map((img, i) => (
              <div
                key={i}
                className="absolute rounded-full border-4 border-white w-24 h-24 shadow-lg overflow-hidden transition-transform hover:scale-110"
                style={{ 
                  left: `${i * 40}px`,
                  zIndex: 3 - i
                }}
              >
                <img
                  src={img}
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div 
              className="absolute rounded-full bg-emerald-500 w-24 h-24 flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white"
              style={{ left: '120px' }}
            >
              100+
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="flex items-center px-6 py-3 bg-black text-white rounded-lg
                       hover:bg-gray-800 transition-colors group"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.06-.46-2.02-.45-3.12 0-1.37.62-2.095.53-2.97-.35-4.24-4.65-3.72-11.31.94-11.69.87.06 1.51.35 2.03.35.82 0 1.39-.35 2.35-.35.85 0 1.51.35 2.03.35.52 0 2.12-.87 3.12-.35-2.51 1.67-2.12 5.37.59 6.37-.52 1.67-1.24 3.32-1.89 4.99l.01.02zM12.03 6.3c-.02-2.15 1.66-3.87 3.57-3.92.26 2.12-1.57 3.95-3.57 3.95v-.03z"/>
              </svg>
              App Store
            </a>
            <a
              href="#"
              className="flex items-center px-6 py-3 bg-black text-white rounded-lg
                       hover:bg-gray-800 transition-colors group"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.184l2.71-2.712 4.267 2.717a.99.99 0 0 1 0 1.692l-4.267 2.717-2.71-2.712 2.71-2.702zM5.865 2.658L14 10.794 5.865 18.93 5.865 2.658z"/>
              </svg>
              Play Store
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}