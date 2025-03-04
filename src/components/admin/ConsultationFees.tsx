import React, { useState, useEffect } from 'react';
import { DollarSign, Save, Loader2, AlertCircle, Globe } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ConsultationFee {
  id: string;
  country: string;
  general_video_fee: number;
  general_phone_fee: number;
  specialist_video_fee: number;
  specialist_phone_fee: number;
  currency: string;
  currency_symbol: string;
}

export default function ConsultationFees() {
  const [fees, setFees] = useState<ConsultationFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_fees')
        .select('*')
        .order('country');

      if (error) throw error;
      setFees(data || []);
    } catch (err) {
      console.error('Error fetching fees:', err);
      setError('Failed to load consultation fees');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeeChange = (countryId: string, field: keyof ConsultationFee, value: string) => {
    setFees(prevFees => prevFees.map(fee => {
      if (fee.id === countryId) {
        return {
          ...fee,
          [field]: field.includes('fee') ? parseFloat(value) || 0 : value
        };
      }
      return fee;
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      for (const fee of fees) {
        const { error } = await supabase
          .from('consultation_fees')
          .update({
            general_video_fee: fee.general_video_fee,
            general_phone_fee: fee.general_phone_fee,
            specialist_video_fee: fee.specialist_video_fee,
            specialist_phone_fee: fee.specialist_phone_fee,
            currency: fee.currency,
            currency_symbol: fee.currency_symbol
          })
          .eq('id', fee.id);

        if (error) throw error;
      }

      setSuccess('Consultation fees updated successfully');
    } catch (err) {
      console.error('Error updating fees:', err);
      setError('Failed to update consultation fees');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consultation Fees</h2>
          <p className="text-gray-600">Manage consultation fees for different countries</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white rounded-lg
                   hover:bg-emerald-600 transition-colors disabled:bg-emerald-300
                   disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-lg flex items-start gap-2">
          <Save className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{success}</p>
        </div>
      )}

      <div className="grid gap-6">
        {fees.map((fee) => (
          <div
            key={fee.id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Globe className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{fee.country}</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* General Doctor Fees */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">General Doctor Fees</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video Consultation Fee
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={fee.general_video_fee}
                      onChange={(e) => handleFeeChange(fee.id, 'general_video_fee', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Consultation Fee
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={fee.general_phone_fee}
                      onChange={(e) => handleFeeChange(fee.id, 'general_phone_fee', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Specialist Fees */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Specialist Fees</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video Consultation Fee
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={fee.specialist_video_fee}
                      onChange={(e) => handleFeeChange(fee.id, 'specialist_video_fee', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Consultation Fee
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={fee.specialist_phone_fee}
                      onChange={(e) => handleFeeChange(fee.id, 'specialist_phone_fee', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Currency Settings */}
              <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={fee.currency}
                    onChange={(e) => handleFeeChange(fee.id, 'currency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={fee.currency_symbol}
                    onChange={(e) => handleFeeChange(fee.id, 'currency_symbol', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}