import React, { useState, useEffect } from 'react';
import { Send, Heart, AlertCircle, Loader2, Stethoscope } from 'lucide-react';
import DoctorCard from './DoctorCard';
import { doctorsData } from '../FeaturedDoctors/doctorsData';
import { isSpecialist } from '../utils/doctorUtils';
import { useTranslation } from '../../hooks/useTranslation';

// Sarufi API configuration
const BOT_ID = 1700;
const API_URL = "https://api.sarufi.io";

interface Message {
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  type: 'info' | 'warning';
  liked: boolean;
}

export default function SymptomChecker({ country }: { country: string }) {
  const { t } = useTranslation();
  const [currentMessage, setCurrentMessage] = useState<Message>({
    text: "Hello! I'm your Pona Health Assistant. Please describe your symptoms in detail. The more specific you are, the better I can help you.",
    sender: 'bot',
    timestamp: new Date(),
    type: 'info',
    liked: false
  });
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId] = useState(`${Date.now()}_${Math.floor((Math.random() * 1000) + 1)}`);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedDoctors, setRecommendedDoctors] = useState<any[]>([]);

  const getRandomGeneralPractitioners = () => {
    const countryDoctors = doctorsData[country] || [];
    const generalPractitioners = countryDoctors.filter(doc => !isSpecialist(doc.specialty));
    
    if (generalPractitioners.length >= 2) {
      const shuffled = [...generalPractitioners].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 2);
    }
    
    return generalPractitioners;
  };

  const formatResponse = (text: string) => {
    if (!text) return '';

    const medicalTerms = [
      /\b(symptoms?|diagnosis|treatment|medication|doctor|hospital)\b/gi,
      /\b(high|moderate|low|severe|mild)\s+(risk|fever|pain|pressure)\b/gi,
      /\b(immediately|urgent|emergency)\b/gi,
      /\b(Warning|Important|Note|Caution)\b/g
    ];

    let formattedText = text;
    medicalTerms.forEach(pattern => {
      formattedText = formattedText.replace(pattern, '<strong>$&</strong>');
    });

    formattedText = formattedText.replace(/•\s/g, '<span class="text-emerald-500 mr-2">•</span>');
    formattedText = formattedText.replace(/(\d+\.\s)/g, '<span class="font-bold mr-2">$1</span>');
    
    formattedText = formattedText.replace(
      /\b(\d+(\.\d+)?)\s*(mg|g|ml|°C|°F|bpm|mmHg)\b/g,
      '<span class="font-mono text-emerald-600">$&</span>'
    );

    formattedText = formattedText.replace(/\n/g, '</p><p class="mb-2">');
    
    return `<p class="mb-2">${formattedText}</p>`;
  };

  useEffect(() => {
    if (currentMessage.text && !isLoading) {
      setIsTyping(true);
      setDisplayedResponse('');
      let index = 0;
      
      const interval = setInterval(() => {
        if (index < currentMessage.text.length) {
          setDisplayedResponse(currentMessage.text.substring(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 1);

      return () => clearInterval(interval);
    }
  }, [currentMessage.text, isLoading]);

  const sendMessageToSarufi = async (message: string) => {
    try {
      const response = await fetch(`${API_URL}/plugin/conversation/${BOT_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          message: message,
          chat_id: chatId,
          context: conversationContext
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get bot response');
      }

      const data = await response.json();
      
      if (data && Array.isArray(data.actions) && data.actions.length > 0) {
        const action = data.actions[0];
        if (action.send_message && Array.isArray(action.send_message)) {
          return action.send_message.join(' ');
        }
        else if (action.send_message && typeof action.send_message === 'string') {
          return action.send_message;
        }
      }

      if (message.length < 20 || !message.includes(' ')) {
        return "Could you please provide more details about your symptoms? For example:\n" +
               "• When did they start?\n" +
               "• How severe are they?\n" +
               "• Are there any other symptoms you're experiencing?\n" +
               "• What makes them better or worse?";
      }

      const vagueTerms = ['pain', 'hurt', 'sick', 'bad', 'unwell', 'uncomfortable'];
      if (vagueTerms.some(term => message.toLowerCase().includes(term)) && message.split(' ').length < 5) {
        return "I notice you're experiencing discomfort. To better assist you, could you please specify:\n" +
               "• Where exactly is the pain/discomfort located?\n" +
               "• How would you describe the sensation?\n" +
               "• Is it constant or does it come and go?\n" +
               "• Are there any activities that affect it?";
      }

      return "I understand you're experiencing some health concerns. Could you provide more specific details about your symptoms to help me better assist you?";
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleLike = () => {
    setCurrentMessage(prev => ({
      ...prev,
      liked: !prev.liked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    const userMessage = symptoms.trim();
    setSymptoms('');
    setIsLoading(true);
    setRecommendedDoctors([]);

    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setConversationContext(prev => [...prev, userMessage]);
      
      const botResponse = await sendMessageToSarufi(userMessage);
      
      setCurrentMessage({
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'info',
        liked: false
      });

      setRecommendedDoctors(getRandomGeneralPractitioners());
    } catch (error) {
      setCurrentMessage({
        text: "I apologize, but I'm having trouble processing your request. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'warning',
        liked: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="bg-emerald-500 text-white p-2 rounded-lg">
            <Stethoscope className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            {t('symptoms.title')}
          </h2>
        </div>
      </div>

      <div className="pt-14 pb-40 px-4">
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="p-6 min-h-[300px] bg-gradient-to-b from-emerald-50/50">
            {isLoading ? (
              <div className="flex justify-center items-center py-16 animate-fade-in">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-75" />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Analyzing symptoms...</p>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div 
                    className="prose prose-emerald max-w-none mb-4"
                    dangerouslySetInnerHTML={{ __html: formatResponse(displayedResponse) }}
                  />
                  {isTyping && (
                    <span className="inline-block w-2 h-4 bg-emerald-500 animate-pulse" />
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {currentMessage.timestamp.toLocaleTimeString()}
                    </span>
                    
                    <button
                      onClick={handleLike}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 
                               hover:bg-gray-100 transition-colors"
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          currentMessage.liked 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-400'
                        }`} 
                      />
                      <span className={currentMessage.liked ? 'text-red-500' : 'text-gray-600'}>
                        {currentMessage.liked ? t('symptoms.helpful') : t('symptoms.markHelpful')}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder={t('symptoms.placeholder')}
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                       bg-gray-50 min-h-[120px] max-h-[200px] resize-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !symptoms.trim()}
                className="absolute right-3 bottom-3 p-2 bg-gradient-to-r from-emerald-500 to-teal-600 
                         text-white rounded-lg shadow-lg shadow-emerald-500/20
                         hover:shadow-xl transition-all disabled:opacity-50
                         disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {recommendedDoctors.length > 0 && (
          <div className="space-y-4 animate-fade-in mb-20">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              {t('search.recommended')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {recommendedDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  {...doctor}
                  country={country}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}