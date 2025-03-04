import React, { useState, useEffect, useRef } from 'react';
import { Send, Heart, AlertCircle, Loader2 } from 'lucide-react';

interface Message {
  text: string;
  sender: 'bot';
  timestamp: Date;
  type?: 'suggestion' | 'warning' | 'info';
  liked?: boolean;
}

// Sarufi API configuration
const BOT_ID = 1700;
const API_URL = "https://api.sarufi.io";

export default function SymptomChecker() {
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

  const formatResponse = (text: string) => {
    if (!text) return '';

    // Bold important medical terms
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

    // Format bullet points and numbers
    formattedText = formattedText.replace(/•\s/g, '<span class="text-emerald-500 mr-2">•</span>');
    formattedText = formattedText.replace(/(\d+\.\s)/g, '<span class="font-bold mr-2">$1</span>');
    
    // Highlight measurements and values
    formattedText = formattedText.replace(
      /\b(\d+(\.\d+)?)\s*(mg|g|ml|°C|°F|bpm|mmHg)\b/g,
      '<span class="font-mono text-emerald-600">$&</span>'
    );

    // Add paragraph spacing and preserve emojis
    formattedText = formattedText.replace(/\n/g, '</p><p class="mb-2">');
    
    return `<p class="mb-2">${formattedText}</p>`;
  };

  // Add typing animation effect with faster speed
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
      }, 1); // Super fast 1ms typing delay

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
      
      // If symptoms are vague, ask probing questions
      if (message.length < 20 || !message.includes(' ')) {
        return "Could you please provide more details about your symptoms? For example:\n" +
               "• When did they start?\n" +
               "• How severe are they?\n" +
               "• Are there any other symptoms you're experiencing?\n" +
               "• What makes them better or worse?";
      }

      // Check for common vague terms
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    const userMessage = symptoms.trim();
    setSymptoms('');
    setIsLoading(true);

    try {
      // Reduced loading time to 200ms
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Update conversation context
      setConversationContext(prev => [...prev, userMessage]);
      
      // Get bot response
      const botResponse = await sendMessageToSarufi(userMessage);
      
      setCurrentMessage({
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'info',
        liked: false
      });
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

  const handleLike = () => {
    setCurrentMessage(prev => ({ ...prev, liked: !prev.liked }));
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pona Health Assistant
          </h2>
          <p className="text-gray-600">
            Describe your symptoms and get instant AI-powered health guidance
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Response Area */}
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
                        {currentMessage.liked ? 'Helpful!' : 'Mark as helpful'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms..."
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         bg-gray-50"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !symptoms.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r 
                         from-emerald-500 to-teal-600 text-white rounded-lg
                         hover:shadow-lg transition-all disabled:opacity-50
                         disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}