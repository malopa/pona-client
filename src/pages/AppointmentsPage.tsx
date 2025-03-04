import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, ChevronRight, Video, Phone, Star, Shield, 
  AlertCircle, X, Check, Loader2 
} from 'lucide-react';
import CallInterface from '../components/call/CallInterface';

interface Appointment {
  id: string;
  doctor: {
    name: string;
    specialty: string;
    image: string;
    isSpecialist: boolean;
  };
  date: string;
  time: string;
  type: 'video' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCall, setShowCall] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Record<string, Appointment[]>>({
    upcoming: [],
    completed: [],
    cancelled: []
  });

  useEffect(() => {
    // Get last appointment from payment
    const lastAppointment = localStorage.getItem('lastAppointment');
    if (lastAppointment) {
      const appointmentData = JSON.parse(lastAppointment);
      
      // Create new appointment
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        doctor: {
          name: "Dr. Sarah Johnson", // This would come from the booking data
          specialty: "Cardiologist",
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150",
          isSpecialist: appointmentData.doctorType === 'specialist'
        },
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: appointmentData.packageType.includes('video') ? 'video' : 'phone',
        status: 'scheduled'
      };

      // Add to upcoming appointments
      setAppointments(prev => ({
        ...prev,
        upcoming: [newAppointment, ...prev.upcoming]
      }));

      // Clear the last appointment
      localStorage.removeItem('lastAppointment');
    }
  }, []);

  const handleStartCall = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCall(true);
  };

  const handleEndCall = () => {
    setShowCall(false);
    setSelectedAppointment(null);
    
    // Move appointment to completed
    if (selectedAppointment) {
      setAppointments(prev => ({
        ...prev,
        upcoming: prev.upcoming.filter(a => a.id !== selectedAppointment.id),
        completed: [...prev.completed, { ...selectedAppointment, status: 'completed' }]
      }));
    }
  };

  const handleCancel = (appointmentId: string) => {
    const appointment = appointments.upcoming.find(a => a.id === appointmentId);
    if (!appointment) return;

    setAppointments(prev => ({
      ...prev,
      upcoming: prev.upcoming.filter(a => a.id !== appointmentId),
      cancelled: [...prev.cancelled, { ...appointment, status: 'cancelled' }]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <button
            onClick={() => navigate('/#featured-doctors')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 
                     rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-xl 
                     hover:shadow-emerald-500/30 transition-all transform hover:scale-105 
                     active:scale-95 flex items-center gap-2"
          >
            Book Appointment
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-1">
          <div className="flex">
            {['upcoming', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all
                  ${activeTab === tab
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-emerald-600'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments[activeTab as keyof typeof appointments].map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all
                       transform hover:-translate-y-1 duration-300"
            >
              <div className="flex items-start gap-4">
                <img
                  src={appointment.doctor.image}
                  alt={appointment.doctor.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {appointment.doctor.name}
                        {appointment.doctor.isSpecialist && (
                          <Shield className="w-4 h-4 text-purple-500" />
                        )}
                      </h3>
                      <p className="text-emerald-600">{appointment.doctor.specialty}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                        ${appointment.status === 'scheduled' 
                          ? 'bg-emerald-100 text-emerald-700'
                          : appointment.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>{new Date(appointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      {appointment.type === 'video' ? (
                        <Video className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Phone className="w-5 h-5 text-gray-400" />
                      )}
                      <span>{appointment.type === 'video' ? 'Video Call' : 'Phone Call'}</span>
                    </div>
                  </div>

                  {activeTab === 'upcoming' && (
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => handleStartCall(appointment)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 
                               text-white py-2 rounded-lg shadow-lg shadow-emerald-500/20 
                               hover:shadow-xl hover:shadow-emerald-500/30 transition-all 
                               transform hover:scale-[1.02] active:scale-98 flex items-center 
                               justify-center gap-2"
                      >
                        {appointment.type === 'video' ? (
                          <Video className="w-5 h-5" />
                        ) : (
                          <Phone className="w-5 h-5" />
                        )}
                        Join Call
                      </button>
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg
                               hover:bg-red-50 transition-all transform hover:scale-[1.02] 
                               active:scale-98"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {appointments[activeTab as keyof typeof appointments].length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {activeTab} appointments
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'upcoming'
                  ? "You don't have any upcoming appointments. Would you like to book one?"
                  : `You don't have any ${activeTab} appointments.`}
              </p>
              {activeTab === 'upcoming' && (
                <button
                  onClick={() => navigate('/#featured-doctors')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 
                         py-2 rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-xl 
                         hover:shadow-emerald-500/30 transition-all transform hover:scale-105 
                         active:scale-95"
                >
                  Book an Appointment
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Call Interface */}
      {showCall && selectedAppointment && (
        <CallInterface
          sessionId={`session_${selectedAppointment.id}`}
          appointmentId={selectedAppointment.id}
          callType={selectedAppointment.type}
          onEnd={handleEndCall}
        />
      )}
    </div>
  );
}