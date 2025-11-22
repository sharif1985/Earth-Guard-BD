import React from 'react';
import { Phone, AlertCircle, Truck, ShieldCheck, Flame } from 'lucide-react';
import { EmergencyContact } from '../types';

const contacts: EmergencyContact[] = [
  {
    name: 'National Emergency Service',
    number: '999',
    description: 'Police, Ambulance, Fire Service',
    icon: AlertCircle,
    color: 'bg-red-600'
  },
  {
    name: 'Fire Service HQ',
    number: '16163',
    description: 'Central Control Room (Dhaka)',
    icon: Flame,
    color: 'bg-orange-500'
  },
  {
    name: 'Health Directorate',
    number: '16263',
    description: 'Health Emergency',
    icon: Truck,
    color: 'bg-green-600'
  },
  {
    name: 'Disaster Warning',
    number: '1090',
    description: 'Disaster Management Bureau',
    icon: ShieldCheck,
    color: 'bg-blue-600'
  },
];

const EmergencyContacts: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Emergency Contacts</h2>
            <p className="text-gray-500">Tap a card to call immediately</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact) => (
          <a
            key={contact.number}
            href={`tel:${contact.number}`}
            className="block group relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all transform hover:-translate-y-1"
          >
            <div className="p-6 flex items-center">
              <div className={`${contact.color} p-4 rounded-full text-white shadow-md mr-5`}>
                <contact.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {contact.name}
                </h3>
                <p className="text-sm text-gray-500 mb-1">{contact.description}</p>
                <div className="flex items-center text-2xl font-black text-gray-800">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {contact.number}
                </div>
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 h-1 w-full ${contact.color} opacity-50`}></div>
          </a>
        ))}
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mt-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              <strong className="font-bold">Important:</strong> If mobile networks are down, try to use data-based apps or SMS. Stay near windows for better signal but ensure you are safe from falling glass.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;