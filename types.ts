export type UserRole = 'researcher' | 'farmer' | 'admin';

export interface User {
  id: string;
  email?: string;
  mobile?: string;
  role: UserRole;
  name: string;
  location?: {
    village: string;
    district: string;
    state: string;
  };
  cropType?: string;
}

export interface DroughtData {
  id: string;
  date: string;
  location: string;
  rainfall: number; // in mm
  spi: number; // Standardized Precipitation Index
  smi: number; // Soil Moisture Index
  temperature: number;
  humidity: number;
  soilMoisture: number;
  severity: 'normal' | 'watch' | 'warning' | 'alert' | 'emergency';
}

export interface Alert {
  id: string;
  type: 'drought' | 'heat' | 'rainfall';
  severity: 'low' | 'medium' | 'high';
  message: string;
  date: string;
  location: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
