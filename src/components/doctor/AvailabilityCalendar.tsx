import React, { useState, useEffect } from 'react';
import { Clock, Save, Loader2, AlertCircle, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export default function AvailabilityCalendar() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availability, setAvailability] = useState<Record<string, string[]>>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('doctors')
        .select('availability')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data?.availability) {
        setAvailability(data.availability);
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError('Failed to load availability schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTimeSlot = (day: string, time: string) => {
    setAvailability(prev => {
      const daySlots = [...prev[day]];
      const index = daySlots.indexOf(time);
      
      if (index === -1) {
        daySlots.push(time);
        daySlots.sort();
      } else {
        daySlots.splice(index, 1);
      }

      return {
        ...prev,
        [day]: daySlots
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('doctors')
        .update({ availability })
        .eq('id', user.id);

      if (error) throw error;

      setSuccess('Availability schedule updated successfully');
    } catch (err) {
      console.error('Error saving schedule:', err);
      setError(err instanceof Error ? err.message : 'Failed to save schedule');
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
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Availability Schedule</h2>
          <p className="text-gray-600">Set your available time slots for consultations</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white
                   rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-xl
                   hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02]
                   active:scale-98 flex items-center gap-2 disabled:opacity-50"
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
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-emerald-50 text-emerald-600 p-4 rounded-lg flex items-start gap-2">
          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{success}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-32">
                Day
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Available Times
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {days.map((day) => (
              <tr key={day}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="font-medium text-gray-900 capitalize">{day}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => toggleTimeSlot(day, time)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                          ${availability[day].includes(time)
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        <Clock className="w-4 h-4 inline-block mr-1" />
                        {time}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}