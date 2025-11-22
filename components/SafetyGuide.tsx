import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Home, Activity, CheckCircle } from 'lucide-react';

const guides = [
  {
    id: 'before',
    title: 'Preparedness (Before)',
    color: 'bg-blue-500',
    icon: Home,
    items: [
      'Identify safe spots in every room (under sturdy tables).',
      'Practice "Drop, Cover, and Hold On" with family.',
      'Prepare an Emergency Kit: Water, non-perishable food, torch, whistle, first-aid kit.',
      'Secure heavy furniture (bookshelves, cupboards) to walls.',
      'Know how to turn off gas, water, and electricity mains.'
    ]
  },
  {
    id: 'during',
    title: 'Survival (During)',
    color: 'bg-red-500',
    icon: Activity,
    items: [
      'DROP to your hands and knees.',
      'COVER your head and neck with your arms. Crawl under a sturdy table if possible.',
      'HOLD ON to your shelter until shaking stops.',
      'Stay away from glass, windows, outside doors and walls.',
      'If in bed, stay there and cover your head with a pillow.',
      'Do NOT use elevators.'
    ]
  },
  {
    id: 'after',
    title: 'Response (After)',
    color: 'bg-green-500',
    icon: CheckCircle,
    items: [
      'Check yourself and others for injuries.',
      'Check for gas leaks. If you smell gas, open windows and leave immediately.',
      'Do NOT light matches or turn on electrical switches.',
      'Listen to battery-operated radio or check this app for updates.',
      'Expect aftershocks. Stay away from damaged buildings.'
    ]
  }
];

const SafetyGuide: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('during');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 pb-24">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Safety Protocols</h1>
        <p className="text-gray-500 text-sm mt-1">Standard procedures for Bangladesh</p>
      </div>

      <div className="space-y-4">
        {guides.map((guide) => (
          <div 
            key={guide.id} 
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200"
          >
            <button
              onClick={() => toggleSection(guide.id)}
              className="w-full flex items-center justify-between p-5 focus:outline-none hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${guide.color} text-white mr-4 shadow-sm`}>
                    <guide.icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-lg text-gray-800">{guide.title}</span>
              </div>
              {openSection === guide.id ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {openSection === guide.id && (
              <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 duration-200">
                <div className="h-px bg-gray-100 w-full mb-4"></div>
                <ul className="space-y-3">
                  {guide.items.map((item, index) => (
                    <li key={index} className="flex items-start text-gray-600">
                      <span className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${guide.color.replace('bg-', 'bg-opacity-50 bg-')}`}></span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Visual Aid for Drop Cover Hold */}
      <div className="bg-gray-800 rounded-2xl p-6 text-white text-center mt-8">
        <h3 className="text-xl font-bold mb-4 text-yellow-400">REMEMBER</h3>
        <div className="flex justify-around items-center text-sm md:text-base font-bold">
            <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center border-2 border-yellow-400">
                    DROP
                </div>
            </div>
            <div className="h-px bg-gray-600 flex-1 mx-4"></div>
            <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center border-2 border-yellow-400">
                    COVER
                </div>
            </div>
            <div className="h-px bg-gray-600 flex-1 mx-4"></div>
            <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center border-2 border-yellow-400">
                    HOLD ON
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyGuide;