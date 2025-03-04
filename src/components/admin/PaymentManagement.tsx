import React, { useState } from 'react';
import { DollarSign, Calendar, Search, Filter, Download, Check, X, ArrowUpRight } from 'lucide-react';

// Mock data for payment requests
const paymentRequests = [
  {
    id: 1,
    doctor: 'Dr. John Mbwambo',
    country: 'Tanzania',
    amount: 1200,
    earnings: 3500,
    calls: 45,
    requestDate: '2024-03-15',
    status: 'pending'
  },
  {
    id: 2,
    doctor: 'Dr. Sarah Mirembe',
    country: 'Uganda',
    amount: 850,
    earnings: 2800,
    calls: 32,
    requestDate: '2024-03-14',
    status: 'pending'
  }
];

export default function PaymentManagement() {
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [dateRange, setDateRange] = useState('This Month');

  const handleApprove = (id: number) => {
    // Handle payment approval
    console.log('Approved payment:', id);
  };

  const handleReject = (id: number) => {
    // Handle payment rejection
    console.log('Rejected payment:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Payment Management</h2>
          <p className="text-gray-600">Process withdrawal requests and manage payments</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctor..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64
                     focus:outline-none focus:ring-2 focus:ring-emerald-500
                     focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border
                         border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filter
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border
                         border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Download className="w-5 h-5" />
            Export
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500
                         text-white rounded-lg hover:bg-emerald-600">
            <Calendar className="w-5 h-5" />
            {dateRange}
          </button>
        </div>
      </div>

      {/* Payment Requests */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900">Withdrawal Requests</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Calls
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paymentRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{request.doctor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {request.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-emerald-600 font-medium">
                      ${request.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        ${request.earnings}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {request.calls} calls
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(request.requestDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="p-2 bg-emerald-100 text-emerald-600 rounded-lg
                               hover:bg-emerald-200 transition-colors"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg
                               hover:bg-red-200 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}