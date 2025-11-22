import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, AlertTriangle, Shield } from 'lucide-react';
import { Message, Sender, GeoLocationState } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const ChatAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hello! I am EarthGuard. I can help you with earthquake preparedness, safety guidelines, and finding nearby emergency services in Bangladesh. How can I help you today?",
      sender: Sender.AI,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<GeoLocationState>({ latitude: null, longitude: null, error: null });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null
          });
        },
        (error) => {
          setLocation(prev => ({ ...prev, error: error.message }));
        }
      );
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: Sender.USER,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await sendMessageToGemini(userMsg.text, location);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      sender: Sender.AI,
      timestamp: new Date(),
      groundingMetadata: response.groundingMetadata
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper to render map chunks if available
  const renderGroundingSource = (metadata: any) => {
    if (!metadata || !metadata.groundingChunks) return null;

    const mapChunks = metadata.groundingChunks.filter((c: any) => c.maps);
    const webChunks = metadata.groundingChunks.filter((c: any) => c.web);

    return (
      <div className="mt-3 space-y-2">
        {mapChunks.length > 0 && (
          <div className="flex flex-col gap-2">
             <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Locations Found</div>
             {mapChunks.map((chunk: any, idx: number) => (
               <a 
                key={idx}
                href={chunk.maps.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
               >
                 <MapPin className="w-5 h-5 text-red-500 mr-3" />
                 <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{chunk.maps.title}</div>
                    <div className="text-xs text-gray-500">Open in Maps</div>
                 </div>
               </a>
             ))}
          </div>
        )}
        
        {webChunks.length > 0 && (
           <div className="text-xs text-gray-400 mt-2">
             Sources: {webChunks.map((c: any, i: number) => (
               <a key={i} href={c.web?.uri} target="_blank" className="underline mr-2 hover:text-blue-600">
                 {c.web?.title || 'Source'}
               </a>
             ))}
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white p-4 shadow-sm z-10 flex items-center justify-between">
        <div className="flex items-center">
            <Shield className="w-6 h-6 text-emerald-600 mr-2" />
            <h2 className="font-semibold text-gray-800">Safety Assistant</h2>
        </div>
        {!location.latitude && (
             <div className="text-xs text-amber-600 flex items-center bg-amber-50 px-2 py-1 rounded">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Enable location for local aid
             </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm ${
                msg.sender === Sender.USER
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              }`}
            >
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>
                  {msg.text}
                </ReactMarkdown>
              </div>
              {msg.sender === Sender.AI && renderGroundingSource(msg.groundingMetadata)}
              <div className={`text-[10px] mt-2 ${msg.sender === Sender.USER ? 'text-emerald-100' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start w-full">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask 'Where is the nearest hospital?' or 'Safety tips'..."
            className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`absolute right-2 p-2 rounded-full ${
                loading || !input.trim() ? 'bg-gray-200 text-gray-400' : 'bg-emerald-600 text-white hover:bg-emerald-700'
            } transition-colors`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 flex justify-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['Nearest Hospital', 'Earthquake Tips', 'Emergency Contacts', 'Report Incident'].map(s => (
                <button 
                    key={s} 
                    onClick={() => setInput(s)} 
                    className="whitespace-nowrap px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-600 rounded-full transition-colors"
                >
                    {s}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChatAgent;