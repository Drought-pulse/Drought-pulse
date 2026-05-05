import { DroughtData } from './types';

export const MOCK_DROUGHT_DATA: DroughtData[] = [
  {
    id: '1',
    date: '2026-04-01',
    location: 'Rajasthan',
    rainfall: 10,
    spi: -1.5,
    smi: 0.2,
    temperature: 38,
    humidity: 20,
    soilMoisture: 15,
    severity: 'warning'
  },
  {
    id: '2',
    date: '2026-04-15',
    location: 'Rajasthan',
    rainfall: 5,
    spi: -2.0,
    smi: 0.1,
    temperature: 42,
    humidity: 15,
    soilMoisture: 10,
    severity: 'alert'
  },
  {
    id: '3',
    date: '2026-04-01',
    location: 'Maharashtra',
    rainfall: 25,
    spi: -0.5,
    smi: 0.4,
    temperature: 35,
    humidity: 45,
    soilMoisture: 30,
    severity: 'watch'
  },
  {
    id: '4',
    date: '2026-04-15',
    location: 'Maharashtra',
    rainfall: 15,
    spi: -1.0,
    smi: 0.3,
    temperature: 37,
    humidity: 40,
    soilMoisture: 25,
    severity: 'warning'
  },
  {
    id: '5',
    date: '2026-04-25',
    location: 'Gujarat',
    rainfall: 40,
    spi: 0.2,
    smi: 0.6,
    temperature: 33,
    humidity: 50,
    soilMoisture: 45,
    severity: 'normal'
  }
];

export const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const DISTRICTS: Record<string, string[]> = {
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Bikaner', 'Ajmer'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
};
