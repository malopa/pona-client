import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, DollarSign, FileText, Settings, LogOut,
  Clock, TrendingUp, Activity, Phone, Video, Users, Shield, Star,
  ChevronRight, AlertCircle, Heart, Stethoscope, ArrowUpRight, Bell
} from 'lucide-react';
import DoctorAppointments from '../doctor/DoctorAppointments';
import DoctorEarnings from '../doctor/DoctorEarnings';
import DoctorProfile from '../doctor/DoctorProfile';
import DoctorApplicationStatus from '../doctor/DoctorApplicationStatus';
import DoctorNotifications from '../doctor/DoctorNotifications';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'earnings', label: 'Earnings', icon: DollarSign },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'application', label: 'Application', icon: FileText },
  { id: 'profile', label: 'Profile', icon: Settings }
];

export default function MobileDoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Hide welcome message after 2 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('doctorAuth');
    window.location.href = '/';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DoctorOverview />;
      case 'appointments':
        return <DoctorAppointments />;
      case 'earnings':
        return <DoctorEarnings />;
      case 'notifications':
        return <DoctorNotifications />;
      case 'application':
        return <DoctorApplicationStatus />;
      case 'profile':
        return <DoctorProfile />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Message */}
      <div className={`fixed inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 z-[100] flex items-center justify-center
                    transition-all duration-500 ${showWelcome ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="text-white text-center animate-fade-in">
          <Stethoscope className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Welcome, Doctor</h1>
          <p className="text-emerald-100">Your patients are waiting</p>
        </div>
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Doctor Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 transform hover:scale-110 transition-transform"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t z-50">
        <div className="flex justify-around items-center h-16">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-all duration-300
                ${activeTab === id
                  ? 'text-emerald-500 transform scale-110'
                  : 'text-gray-500 hover:text-emerald-400'
                }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${
                activeTab === id ? 'animate-bounce' : ''
              }`} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DoctorOverview() {
  const stats = [
    {
      label: "Today's Appointments",
      value: '8',
      icon: Clock,
      color: 'emerald',
      trend: '+12%'
    },
    {
      label: 'Total Patients',
      value: '245',
      icon: Users,
      color: 'blue',
      trend: '+8%'
    },
    {
      label: 'Total Earnings',
      value: '$3,580',
      icon: DollarSign,
      color: 'purple',
      trend: '+15%'
    },
    {
      label: 'Rating',
      value: '4.8',
      icon: Star,
      color: 'amber',
      trend: '+0.2'
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      time: '10:00 AM',
      type: 'Video Call',
      status: 'Confirmed',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=50&h=50'
    },
    {
      id: 2,
      patient: 'Michael Brown',
      time: '11:30 AM',
      type: 'Phone Call',
      status: 'Pending',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=50&h=50'
    }
  ];

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ label, value, icon: Icon, color, trend }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow
                     transform hover:scale-[1.02] duration-300"
          >
            <div className={`text-${color}-500 bg-${color}-50 w-10 h-10 rounded-lg
                         flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-gray-600 text-sm mb-1">{label}</p>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{value}</h3>
              <div className="flex items-center text-emerald-500 text-xs">
                <ArrowUpRight className="w-3 h-3" />
                {trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Application Status */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white
                    transform hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-emerald-500/20">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Application Status: Under Review</h3>
            <p className="text-emerald-100 text-sm mb-3">
              Your application is being reviewed by our team. We'll notify you once the verification
              process is complete.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-white rounded-full animate-pulse" />
              </div>
              <span className="text-sm">75%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Upcoming Appointments</h2>
          <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {upcomingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100
                       transition-colors transform hover:scale-[1.02] duration-300"
            >
              <img
                src={appointment.avatar}
                alt={appointment.patient}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{appointment.patient}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {appointment.time}
                  </div>
                  <div className="flex items-center gap-1">
                    {appointment.type === 'Video Call' ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <Phone className="w-4 h-4" />
                    )}
                    {appointment.type}
                  </div>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium
                  ${appointment.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                  }`}
              >
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex gap-3 transform hover:translate-x-2 transition-transform duration-300">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Video className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-gray-900 text-sm">Video consultation completed</p>
              <p className="text-xs text-gray-600">with John Doe • 2 hours ago</p>
            </div>
          </div>
          <div className="flex gap-3 transform hover:translate-x-2 transition-transform duration-300">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-900 text-sm">New 5-star review received</p>
              <p className="text-xs text-gray-600">from Sarah M. • 4 hours ago</p>
            </div>
          </div>
          <div className="flex gap-3 transform hover:translate-x-2 transition-transform duration-300">
            <div className="bg-blue-100 p-2 rounded-lg">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900 text-sm">Payment received</p>
              <p className="text-xs text-gray-600">$150.00 • 5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}