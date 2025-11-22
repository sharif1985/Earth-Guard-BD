import React from 'react';

export enum Sender {
  USER = 'user',
  AI = 'ai'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  isError?: boolean;
  groundingMetadata?: any; 
}

export interface EmergencyContact {
  name: string;
  number: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

export interface SafetyStep {
  title: string;
  content: string;
  icon: React.ElementType;
}

export interface GeoLocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}