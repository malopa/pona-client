import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, Video, Phone, Shield } from 'lucide-react';
import CallInterface from '../call/CallInterface';

interface Appointment {
  id: string;
  doctor: {
    name: string;
    specialty: string;
    image: string;
  };
  date: string;
  time: string;
  type: 'video' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showCall, setShowCall] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
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
      const updatedAppointments = appointments.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, status: 'completed' as const }
          : apt
      );
      setAppointments(updatedAppointments);
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-500 text-white p-2 rounded-lg">
            <Calendar className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            Your Appointments
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Appointments Yet
          </h3>
          <p className="text-gray-600 mb-6">
            You don't have any upcoming appointments scheduled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-500 text-white p-2 rounded-lg">
          <Calendar className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
          Your Appointments
        </h2>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all"
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
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      {appointment.doctor.name}
                      <Shield className="w-4 h-4 text-purple-500" />
                    </h3>
                    <p className="text-emerald-600 text-sm">{appointment.doctor.specialty}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
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

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(appointment.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {appointment.type === 'video' ? (
                      <Video className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Phone className="w-4 h-4 text-gray-400" />
                    )}
                    <span>{appointment.type === 'video' ? 'Video Call' : 'Phone Call'}</span>
                  </div>
                </div>

                {appointment.status === 'scheduled' && (
                  <button
                    onClick={() => handleStartCall(appointment)}
                    className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 
                           text-white py-2 rounded-lg shadow-lg shadow-emerald-500/20 
                           hover:shadow-xl hover:shadow-emerald-500/30 transition-all 
                           transform hover:scale-[1.02] active:scale-98 flex items-center 
                           justify-center gap-2 text-sm"
                  >
                    {appointment.type === 'video' ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <Phone className="w-4 h-4" />
                    )}
                    Join Call
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

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