import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CreditCard, Shield, Loader2, AlertCircle } from 'lucide-react';
import { countryPricing } from '../booking/pricingData';

interface PaymentModalProps {
  country: string;
  packageType: string;
  doctorType: string;
  amount: string;
  isEmergency?: boolean;
  onClose: () => void;
  appointmentDetails?: {
    date: Date;
    time: string;
    doctor: {
      id: string;
      name: string;
      specialty: string;
      image: string;
    };
  };
}

export default function PaymentModal({ 
  country, 
  packageType, 
  doctorType, 
  amount, 
  isEmergency = false,
  appointmentDetails,
  onClose 
}: PaymentModalProps) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const pricing = countryPricing[country];
  const isMobile = window.innerWidth <= 768;

  const handlePayment = async (method: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store appointment data in localStorage
      if (appointmentDetails) {
        const appointmentData = {
          id: Date.now().toString(),
          doctor: appointmentDetails.doctor,
          date: appointmentDetails.date.toISOString().split('T')[0],
          time: appointmentDetails.time,
          type: 'video',
          status: 'scheduled'
        };

        // Get existing appointments or initialize empty array
        const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Add new appointment at the beginning
        const updatedAppointments = [appointmentData, ...existingAppointments];
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

        // Set active tab to appointments for mobile
        if (isMobile) {
          localStorage.setItem('activeTab', 'appointments');
        }
      }
      
      // Close modal
      onClose();

      // Redirect based on platform
      if (isMobile) {
        // For mobile, we'll let the tab system handle the navigation
        window.location.reload(); // This will show the appointments tab since we set it above
      } else {
        // For desktop, navigate to the appointments page
        navigate('/appointments', { 
          state: { 
            newAppointment: true
          }
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Consultation Type</span>
                <span className="font-medium">
                  {isEmergency ? 'Emergency Consultation' : 'Video Call'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor Type</span>
                <span className="font-medium capitalize">{doctorType}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-900 font-medium">Total Amount</span>
                <span className="text-lg font-bold text-emerald-600">{pricing.symbol}{amount}</span>
              </div>
            </div>
          </div>

          {isEmergency && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Emergency Consultation</p>
                <p className="text-red-600 text-sm mt-1">
                  You will be connected to the doctor immediately after payment.
                </p>
              </div>
            </div>
          )}

          {isProcessing ? (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 mx-auto text-emerald-500 animate-spin mb-4" />
              <p className="text-gray-600">Processing your payment...</p>
            </div>
          ) : (
            <>
              {/* Payment Methods */}
              <h3 className="font-medium text-gray-900 mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                {pricing.paymentMethods.map((method) => (
                  <button
                    key={method.name}
                    onClick={() => handlePayment(method.name)}
                    className="p-4 border rounded-lg flex flex-col items-center gap-2 hover:border-emerald-500 
                             hover:bg-emerald-50 transition-all transform hover:scale-[1.02] active:scale-98"
                  >
                    {method.logo ? (
                      <img src={method.logo} alt={method.name} className="h-8 object-contain" />
                    ) : (
                      <span className="text-lg font-medium">{method.name}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Security Note */}
              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <p>
                  Your payment information is secure. We use industry-standard encryption 
                  to protect your personal data.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}