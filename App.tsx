import React, { useState, useEffect } from 'react';
import { ShieldAlert, MessageSquare, Menu, Phone, BookOpen, Bell } from 'lucide-react';
import ChatAgent from './components/ChatAgent';
import EmergencyContacts from './components/EmergencyContacts';
import SafetyGuide from './components/SafetyGuide';
import { checkRecentQuakes } from './services/geminiService';

enum Tab {
  HOME = 'home',
  CHAT = 'chat',
  GUIDE = 'guide',
  CONTACTS = 'contacts'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [recentStatus, setRecentStatus] = useState<string>('Checking seismic activity...');

  useEffect(() => {
      if (activeTab === Tab.HOME) {
          checkRecentQuakes().then(setRecentStatus);
      }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.CHAT:
        return <ChatAgent />;
      case Tab.CONTACTS:
        return <EmergencyContacts />;
      case Tab.GUIDE:
        return <SafetyGuide />;
      case Tab.HOME:
      default:
        return (
          <div className="flex flex-col items-center justify-center p-6 h-full space-y-8 max-w-md mx-auto">
            <div className="text-center space-y-2 mt-8">
                <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-4 animate-pulse">
                    <ShieldAlert className="w-12 h-12 text-red-600" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">EarthGuard BD</h1>
                <p className="text-gray-500">Your personal safety companion</p>
            </div>

            {/* Status Card */}
            <div className="w-full bg-white p-5 rounded-2xl shadow-md border-l-4 border-blue-500">
                <div className="flex items-center mb-2">
                    <Bell className="w-4 h-4 text-blue-500 mr-2" />
                    <h3 className="font-bold text-gray-800 text-sm uppercase">Current Status</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{recentStatus}</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 w-full gap-3">
                <button 
                    onClick={() => setActiveTab(Tab.CHAT)}
                    className="flex items-center justify-between p-4 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all transform hover:scale-[1.02]"
                >
                    <div className="flex items-center">
                        <MessageSquare className="w-6 h-6 mr-3" />
                        <div className="text-left">
                            <div className="font-bold">Ask AI Assistant</div>
                            <div className="text-xs opacity-80">"Where is the nearest shelter?"</div>
                        </div>
                    </div>
                    <div className="text-2xl">→</div>
                </button>

                <button 
                    onClick={() => setActiveTab(Tab.CONTACTS)}
                    className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    <Phone className="w-5 h-5 text-red-500 mr-3" />
                    <span className="font-semibold text-gray-700">Emergency Numbers</span>
                </button>
                
                <button 
                    onClick={() => setActiveTab(Tab.GUIDE)}
                    className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    <BookOpen className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="font-semibold text-gray-700">Safety Protocols</span>
                </button>
            </div>
            
            <div className="mt-auto text-center">
                 <p className="text-xs text-gray-400">Location data is processed locally or securely sent to Google Gemini for mapping services.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Mobile friendly topbar */}
      <header className="bg-white shadow-sm py-3 px-4 flex justify-between items-center z-20">
         <div className="flex items-center space-x-2" onClick={() => setActiveTab(Tab.HOME)}>
             <div className="bg-red-600 p-1 rounded text-white">
                 <ShieldAlert size={20} />
             </div>
             <span className="font-bold text-xl text-gray-800">EarthGuard</span>
         </div>
         <div className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-500">
             Bangladesh
         </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
          {renderContent()}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="bg-white border-t border-gray-200 pb-safe pt-1 px-2 flex justify-around items-center z-30 h-16">
        <button 
            onClick={() => setActiveTab(Tab.HOME)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === Tab.HOME ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
            <Menu size={20} strokeWidth={activeTab === Tab.HOME ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Home</span>
        </button>
        <button 
            onClick={() => setActiveTab(Tab.GUIDE)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === Tab.GUIDE ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
            <BookOpen size={20} strokeWidth={activeTab === Tab.GUIDE ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Guides</span>
        </button>
        
        {/* Floating Chat Button Effect in Nav */}
        <div className="relative -top-5">
            <button 
                onClick={() => setActiveTab(Tab.CHAT)}
                className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg border-4 border-gray-50 transition-transform transform ${activeTab === Tab.CHAT ? 'bg-emerald-600 scale-110' : 'bg-gray-800 hover:scale-105'} text-white`}
            >
                <MessageSquare size={24} fill="currentColor" />
            </button>
        </div>

        <button 
            onClick={() => setActiveTab(Tab.CONTACTS)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === Tab.CONTACTS ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
            <Phone size={20} strokeWidth={activeTab === Tab.CONTACTS ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Emergency</span>
        </button>
        <button 
             onClick={() => window.location.reload()} // Simple refresh as a placeholder setting
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 hover:text-gray-600`}
        >
            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
            <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default App;