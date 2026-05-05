import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DroughtData } from '../types';
import { Info, Map as MapIcon, Layers, Filter } from 'lucide-react';

interface InteractiveMapProps {
  data: DroughtData[];
}

// Coordinates for Indian states (center) - simplified
const COORDINATES: Record<string, [number, number]> = {
  'Rajasthan': [27.0238, 74.2179],
  'Maharashtra': [19.7515, 75.7139],
  'Gujarat': [22.2587, 71.1924],
  'Karnataka': [15.3173, 75.7139],
  'Madhya Pradesh': [22.9734, 78.6569],
  'Tamil Nadu': [11.1271, 78.6569],
  'Uttar Pradesh': [26.8467, 80.9462],
  'West Bengal': [22.9868, 87.8550],
};

export default function InteractiveMap({ data }: InteractiveMapProps) {
  const [activeLayer, setActiveLayer] = useState<'severity' | 'rainfall' | 'soilMoisture'>('severity');

  const getColor = (d: DroughtData) => {
    if (activeLayer === 'severity') {
      switch (d.severity) {
        case 'alert': return '#ef4444'; // red-500
        case 'warning': return '#f59e0b'; // amber-500
        case 'watch': return '#eab308'; // yellow-500
        default: return '#10b981'; // emerald-500
      }
    }
    if (activeLayer === 'rainfall') {
      return d.rainfall < 10 ? '#ef4444' : d.rainfall < 30 ? '#f59e0b' : '#3b82f6';
    }
    // soil moisture
    return d.soilMoisture < 20 ? '#ef4444' : d.soilMoisture < 40 ? '#f59e0b' : '#059669';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col gap-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MapIcon className="w-6 h-6 mr-2 text-blue-600" />
            Vulnerability Heatmap
          </h1>
          <p className="text-gray-500">Live spatial visualization of drought indicators across India</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {(['severity', 'rainfall', 'soilMoisture'] as const).map(layer => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
                activeLayer === layer ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative">
        <MapContainer 
          center={[20.5937, 78.9629]} 
          zoom={5} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {data.map((d) => {
            const coords = COORDINATES[d.location] || [20.5937, 78.9629];
            return (
              <CircleMarker
                key={d.id}
                center={coords}
                radius={20}
                pathOptions={{
                  fillColor: getColor(d),
                  fillOpacity: 0.6,
                  color: 'white',
                  weight: 2
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-lg text-gray-900 border-b pb-2 mb-2">{d.location}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Condition:</span>
                        <span className="font-bold uppercase" style={{ color: getColor(d) }}>{d.severity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Rainfall:</span>
                        <span className="font-bold">{d.rainfall} mm</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Soil Moisture:</span>
                        <span className="font-bold">{d.soilMoisture}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">SPI Index:</span>
                        <span className={`font-bold ${d.spi < -1 ? 'text-red-500' : 'text-emerald-500'}`}>{d.spi}</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase transition hover:bg-blue-700">
                      View Local Trends
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-6 right-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/20 max-w-[200px]">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
            {activeLayer === 'severity' ? 'Severity Index' : activeLayer === 'rainfall' ? 'Rainfall Levels' : 'Soil Moisture'}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${activeLayer === 'rainfall' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
              <span className="text-xs font-medium text-gray-700">
                {activeLayer === 'severity' ? 'Normal / Healthy' : activeLayer === 'rainfall' ? '> 30mm (Good)' : '> 40% (Healthy)'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs font-medium text-gray-700">
                {activeLayer === 'severity' ? 'Watch / Warning' : activeLayer === 'rainfall' ? '10-30mm (Low)' : '20-40% (Stress)'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs font-medium text-gray-700">
                {activeLayer === 'severity' ? 'Critical Alert' : activeLayer === 'rainfall' ? '< 10mm (Deficit)' : '< 20% (Critical)'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 italic text-[10px] text-gray-400">
            Switch layers above to see different drought indicators.
          </div>
        </div>
      </div>
    </div>
  );
}
