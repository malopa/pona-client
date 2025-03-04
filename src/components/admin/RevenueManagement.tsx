import React, { useState } from 'react';
import { Calendar, DollarSign, TrendingUp, Download, Filter, PieChart, Users, Phone, Video, Globe, ArrowUpRight } from 'lucide-react';

const activeCountries = [
  {
    name: 'South Africa',
    flag: '🇿🇦',
    total: 58000,
    platform: 26100,
    doctors: 31900,
    growth: 28,
    calls: {
      phone: 1850,
      video: 1200
    },
    subscriptions: 680,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    name: 'Tanzania',
    flag: '🇹🇿',
    total: 45000,
    platform: 20250,
    doctors: 24750,
    growth: 23,
    calls: {
      phone: 1250,
      video: 850
    },
    subscriptions: 450,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    name: 'Kenya',
    flag: '🇰🇪',
    total: 35000,
    platform: 15750,
    doctors: 19250,
    growth: 19,
    calls: {
      phone: 980,
      video: 670
    },
    subscriptions: 380,
    color: 'from-red-500 to-rose-500'
  },
  {
    name: 'Uganda',
    flag: '🇺🇬',
    total: 28000,
    platform: 12600,
    doctors: 15400,
    growth: 15,
    calls: {
      phone: 820,
      video: 540
    },
    subscriptions: 290,
    color: 'from-amber-500 to-orange-500'
  },
  {
    name: 'Rwanda',
    flag: '🇷🇼',
    total: 22000,
    platform: 9900,
    doctors: 12100,
    growth: 12,
    calls: {
      phone: 650,
      video: 420
    },
    subscriptions: 230,
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Burundi',
    flag: '🇧🇮',
    total: 18000,
    platform: 8100,
    doctors: 9900,
    growth: 10,
    calls: {
      phone: 520,
      video: 340
    },
    subscriptions: 180,
    color: 'from-cyan-500 to-blue-500'
  }
];

export default function RevenueManagement() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Month');
  const totalRevenue = activeCountries.reduce((sum, country) => sum + country.total, 0);
  const totalPlatformShare = activeCountries.reduce((sum, country) => sum + country.platform, 0);
  const totalDoctorsShare = activeCountries.reduce((sum, country) => sum + country.doctors, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Revenue Overview</h2>
          <p className="text-gray-600">Track and analyze revenue across all active countries</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border
                         border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50
                         transition-all duration-300">
            <Filter className="w-5 h-5" />
            Filter
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border
                         border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50
                         transition-all duration-300">
            <Download className="w-5 h-5" />
            Export Report
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r
                         from-emerald-500 to-teal-600 text-white rounded-lg
                         hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
            <Calendar className="w-5 h-5" />
            {selectedTimeframe}
          </button>
        </div>
      </div>

      {/* Total Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white
                     shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30
                     transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-emerald-100">
              <ArrowUpRight className="w-4 h-4" />
              <span>+21%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">
            ${totalRevenue.toLocaleString()}
          </h3>
          <p className="text-emerald-100">Total Revenue</p>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-emerald-100">Platform (45%)</p>
                <p className="text-xl font-semibold">
                  ${totalPlatformShare.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-emerald-100">Doctors (55%)</p>
                <p className="text-xl font-semibold">
                  ${totalDoctorsShare.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl
                     transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
              <span>+15%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {activeCountries.reduce((sum, country) => 
              sum + country.calls.phone + country.calls.video, 0
            ).toLocaleString()}
          </h3>
          <p className="text-gray-600">Total Calls</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Phone Calls</p>
                <p className="text-xl font-semibold text-gray-900">
                  {activeCountries.reduce((sum, country) => 
                    sum + country.calls.phone, 0
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Video Calls</p>
                <p className="text-xl font-semibold text-gray-900">
                  {activeCountries.reduce((sum, country) => 
                    sum + country.calls.video, 0
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl
                     transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
              <span>+12%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {activeCountries.reduce((sum, country) => 
              sum + country.subscriptions, 0
            ).toLocaleString()}
          </h3>
          <p className="text-gray-600">Active Subscriptions</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Renewal Rate</span>
              <span className="font-medium text-emerald-600">85%</span>
            </div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Country Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCountries.map((country) => (
          <div
            key={country.name}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all
                     duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${country.color} p-6 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h3 className="text-xl font-bold">{country.name}</h3>
                    <div className="flex items-center gap-1 text-white/90">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+{country.growth}% growth</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold">
                ${country.total.toLocaleString()}
              </div>
              <p className="text-white/90">Total Revenue</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Platform Share</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${country.platform.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Doctors Share</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${country.doctors.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>Phone Calls</span>
                  </div>
                  <span className="font-medium">{country.calls.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-gray-400" />
                    <span>Video Calls</span>
                  </div>
                  <span className="font-medium">{country.calls.video}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>Subscriptions</span>
                  </div>
                  <span className="font-medium">{country.subscriptions}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}