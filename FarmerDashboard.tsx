import React, { useState } from 'react';
import { 
  Bell, MapPin, Sprout, CloudRain, Thermometer, 
  Wind, Droplets, Info, ChevronRight, AlertTriangle, Download, X
} from 'lucide-react';
import { User, DroughtData, Alert } from '../types';
import { motion, AnimatePresence } from 'motion/react';

import { jsPDF } from 'jspdf';

interface FarmerDashboardProps {
  user: User;
  data: DroughtData[];
}

export default function FarmerDashboard({ user, data }: FarmerDashboardProps) {
  const [selectedAdvisory, setSelectedAdvisory] = useState<{title: string, desc: string, fullDesc: string, icon: any} | null>(null);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);

  // Find local data based on user location
  const localData = data.filter(d => 
    d.location.toLowerCase().includes(user.location?.state.toLowerCase() || '')
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] || data[0];

  const advisories = [
    { 
      title: 'Irrigation Strategy', 
      desc: 'Water during late evening to reduce evaporation loss.', 
      icon: Droplets,
      fullDesc: 'During drought, water conservation is key. Switch to drip irrigation if possible. Apply water only in early morning or late evening when evaporation rates are lowest. Use recycled water for non-edible crops if safe.'
    },
    { 
      title: 'Crop Protection', 
      desc: `Recommended for ${user.cropType || 'your area'}: Short-duration varieties.`, 
      icon: Sprout,
      fullDesc: 'Protect your crops from heat stress by using shade nets. Consider inter-cropping with drought-resistant legumes. Apply organic mulch (straw or dried leaves) to the soil surface to maintain moisture and lower soil temperature.'
    },
    { 
      title: 'Soil Health', 
      desc: 'Add organic matter to improve water holding capacity.', 
      icon: MapPin,
      fullDesc: 'Improve soil structure by adding compost or well-rotted manure. Avoid heavy plowing which increases moisture loss. Maintain permanent soil cover to prevent erosion and preserve the micro-ecosystem.'
    },
  ];

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // blue-600
    doc.text('Drought Pulse: Farmer Advisory', margin, y);
    y += 10;

    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139); // gray-500
    doc.text(`Monthly Report - ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`, margin, y);
    y += 15;

    // User Info
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39); // gray-900
    doc.text(`Name: ${user.name}`, margin, y);
    y += 7;
    doc.text(`Location: ${user.location?.village}, ${user.location?.district}, ${user.location?.state}`, margin, y);
    y += 7;
    doc.text(`Crop: ${user.cropType || 'Not specified'}`, margin, y);
    y += 15;

    // Current Status
    doc.setFontSize(16);
    doc.text('Local Conditions Assessment', margin, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Severity Status: ${localData.severity.toUpperCase()}`, margin, y);
    y += 7;
    doc.text(`Measured Rainfall: ${localData.rainfall} mm`, margin, y);
    y += 7;
    doc.text(`Soil Moisture: ${localData.soilMoisture}%`, margin, y);
    y += 15;

    // Expert Advisory
    doc.setFontSize(16);
    doc.text('Actionable Advisories', margin, y);
    y += 10;
    doc.setFontSize(11);
    advisories.forEach(adv => {
      doc.setFont(undefined, 'bold');
      doc.text(`${adv.title}:`, margin, y);
      y += 6;
      doc.setFont(undefined, 'normal');
      const lines = doc.splitTextToSize(adv.desc, 170);
      doc.text(lines, margin, y);
      y += (lines.length * 6) + 4;
    });

    // Save PDF
    doc.save(`DroughtPulse_Advisory_${user.name.replace(/\s+/g, '_')}.pdf`);
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'alert': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  const generatedAlerts: Alert[] = [
    ...(localData.severity === 'alert' || localData.severity === 'warning' ? [{
      id: '1',
      type: 'drought' as const,
      severity: localData.severity === 'alert' ? 'high' as const : 'medium' as const,
      message: `Critical drought conditions in ${localData.location}. Reduce excess water usage.`,
      date: new Date().toISOString(),
      location: localData.location
    }] : []),
    ...(localData.temperature > 40 ? [{
      id: '2',
      type: 'heat' as const,
      severity: 'high' as const,
      message: `Extreme heat advisory. Use mulch to protect soil moisture.`,
      date: new Date().toISOString(),
      location: localData.location
    }] : [])
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-blue-900 to-blue-800 p-8 rounded-[2.5rem] text-white shadow-2xl overflow-hidden relative"
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="text-blue-100 mt-2 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {user.location?.village}, {user.location?.district}, {user.location?.state}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm">
              🌾 Crop: {user.cropType || 'Variable'}
            </span>
            <button 
              onClick={() => setSelectedStat(`Measured Rainfall: ${localData.rainfall}mm. This is significantly below the seasonal average, indicating a precipitation deficit.`)}
              className="px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm hover:bg-white/20 transition cursor-pointer"
            >
              💧 Local Rainfall: {localData.rainfall}mm
            </button>
          </div>
        </div>
        <button 
          onClick={() => setSelectedStat(`Severity: ${localData.severity.toUpperCase()}. This index is calculated based on rainfall deficit, soil moisture, and temperature anomalies.`)}
          className={`relative z-10 px-6 py-4 rounded-3xl backdrop-blur-md border hover:scale-105 transition active:scale-95 cursor-pointer ${
            localData.severity === 'alert' ? 'bg-red-500/20 border-red-400/30' : 'bg-emerald-500/20 border-emerald-400/30'
          }`}
        >
          <p className="text-sm uppercase tracking-wider text-blue-100 font-bold mb-1">Local Condition</p>
          <p className="text-2xl font-bold flex items-center gap-2">
            {localData.severity === 'alert' ? <AlertTriangle className="text-red-400" /> : <Droplets className="text-emerald-400" />}
            {localData.severity.toUpperCase()}
          </p>
        </button>
        
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts Panel */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-600" />
                Active Alerts
              </h2>
            </div>
            <div className="space-y-4">
              {generatedAlerts.length > 0 ? generatedAlerts.map((alert, i) => (
                <motion.div 
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-5 rounded-3xl border-2 flex gap-4 ${getSeverityColor(localData.severity)}`}
                >
                  <div className="mt-1">
                    <AlertTriangle size={28} className="animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-lg tracking-tight">{alert.type.toUpperCase()} CRITICAL WARNING</h4>
                    <p className="mt-1 text-sm font-medium leading-relaxed opacity-95">{alert.message}</p>
                    <div className="mt-4 flex items-center text-xs font-black uppercase tracking-tight gap-2">
                      <span className="px-2 py-1 bg-white/20 rounded-lg">High Impact</span>
                      <span className="flex items-center">
                        Action Required Immediately
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 text-center text-gray-500">
                  <CloudRain className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  No active alerts for your area today.
                </div>
              )}
            </div>
          </section>

          {/* Current Conditions Widget */}
          <section>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button 
                onClick={() => setSelectedStat(`Temperature: ${localData.temperature}°C. Extreme heat can lead to rapid moisture loss in plants.`)}
                className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm text-center hover:border-blue-500 transition cursor-pointer"
              >
                <Thermometer className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold text-gray-900">{localData.temperature}°C</p>
                <p className="text-xs text-gray-500 uppercase font-bold">Temp</p>
              </button>
              <button 
                onClick={() => setSelectedStat(`Humidity: ${localData.humidity}%. Lower humidity increases the rate of transpiration, making crops thirstier.`)}
                className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm text-center hover:border-blue-500 transition cursor-pointer"
              >
                <Droplets className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold text-gray-900">{localData.humidity}%</p>
                <p className="text-xs text-gray-500 uppercase font-bold">Humidity</p>
              </button>
              <button 
                onClick={() => setSelectedStat(`Wind: 12km/h. High winds can dry out topsoil quickly and physically damage stressed crops.`)}
                className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm text-center hover:border-blue-500 transition cursor-pointer"
              >
                <Wind className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                <p className="text-2xl font-bold text-gray-900">12km/h</p>
                <p className="text-xs text-gray-500 uppercase font-bold">Wind</p>
              </button>
              <button 
                onClick={() => setSelectedStat(`Soil Moisture: ${localData.soilMoisture}%. Critical level. Below 20% indicates severe water stress for most common food crops. Soil requires immediate irrigation or moisture conservation measures.`)}
                className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm text-center hover:border-blue-500 transition cursor-pointer"
              >
                <CloudRain className="w-6 h-6 mx-auto mb-2 text-cyan-500" />
                <p className="text-2xl font-bold text-gray-900">{localData.soilMoisture}%</p>
                <p className="text-xs text-gray-500 uppercase font-bold">Moisture</p>
              </button>
            </div>
          </section>
        </div>

        {/* Advisory Sidebar */}
        <div className="space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-bold text-gray-900">Expert Advisory</h2>
              <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-lg">NEW</span>
            </div>
            <div className="space-y-4">
              {advisories.map((adv, i) => (
                <motion.button 
                  key={adv.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedAdvisory(adv)}
                  className="w-full text-left group p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer ring-0 hover:ring-2 hover:ring-blue-100 appearance-none"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                      <adv.icon size={20} />
                    </div>
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase text-xs tracking-widest">{adv.title}</h4>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {adv.desc}
                  </p>
                </motion.button>
              ))}
              
              {/* Report Download */}
              <button 
                onClick={handleDownloadPDF}
                className="w-full mt-4 flex items-center justify-between p-6 bg-emerald-600 text-white rounded-3xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition group"
              >
                <div className="text-left">
                  <p className="font-bold">Farmer Report</p>
                  <p className="text-xs text-emerald-100">Download {new Date().toLocaleString('default', { month: 'long' })} Advisory</p>
                </div>
                <Download className="w-6 h-6 opacity-50 group-hover:opacity-100" />
              </button>
            </div>
          </section>
        </div>
      </div>

      <AnimatePresence>
        {(selectedAdvisory || selectedStat) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => { setSelectedAdvisory(null); setSelectedStat(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => { setSelectedAdvisory(null); setSelectedStat(null); }}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
              >
                <X size={24} />
              </button>

              {selectedAdvisory && (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl w-fit">
                    <selectedAdvisory.icon size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedAdvisory.title}</h2>
                    <p className="text-blue-600 font-medium text-sm border-b border-blue-50 pb-4">{selectedAdvisory.desc}</p>
                  </div>
                  <div className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl">
                    <p className="text-sm italic mb-2 font-bold uppercase tracking-widest text-gray-400">Expert Guidance</p>
                    {selectedAdvisory.fullDesc}
                  </div>
                </div>
              )}

              {selectedStat && (
                <div className="space-y-6 py-4 text-center">
                  <div className="p-5 bg-emerald-50 text-emerald-600 rounded-full w-fit mx-auto">
                    <Info size={40} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Indicator Context</h2>
                    <p className="text-gray-600 leading-relaxed text-lg italic">
                      "{selectedStat}"
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
