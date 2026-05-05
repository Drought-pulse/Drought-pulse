import React from 'react';
import { motion } from 'motion/react';
import { Droplets, Sprout, Database, ShieldAlert, ArrowRight, Github } from 'lucide-react';

interface HomeProps {
  onGetStarted: () => void;
}

export default function Home({ onGetStarted }: HomeProps) {
  const features = [
    { title: 'For Farmers', desc: 'Real-time drought metrics and actionable agricultural advisories.', icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'For Researchers', desc: 'Secure platform for climate data upload and validation.', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Early Alerts', desc: 'Heat stress and rainfall deficit notifications delivered to your phone.', icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center p-6 bg-[#f8fafc]">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-400 rounded-full blur-[100px] -mr-[400px] -mt-[400px]"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-400 rounded-full blur-[100px] -ml-[300px] -mb-[300px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/50 rounded-full text-blue-700 text-sm font-bold uppercase tracking-widest mb-8 border border-blue-200">
            <Droplets size={16} />
            Monitoring Climate Pulse
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-tight mb-6">
            Drought <br />
            <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-amber-600 bg-clip-text text-transparent">
              Pulse
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between climate research and on-field farming through real-time monitoring and AI-driven early warnings.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-bold text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center group"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-white border border-gray-200 text-gray-700 rounded-[2rem] font-bold text-lg hover:border-gray-300 transition-all shadow-sm">
              Explore Live Map
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:-translate-y-2 transition-transform cursor-default"
            >
              <div className={`w-16 h-16 rounded-[1.5rem] ${feature.bg} ${feature.color} flex items-center justify-center mb-8`}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 text-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center relative z-10">
          {[
            { v: '28+', l: 'States Monitored' },
            { v: '500+', l: 'Alerts Delivered' },
            { v: '2k+', l: 'District Data Points' },
            { v: '99%', l: 'System Accuracy' },
          ].map((s, i) => (
            <div key={s.l}>
              <p className="text-5xl font-black mb-2">{s.v}</p>
              <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-blue-900/20 blur-3xl rounded-full scale-150"></div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Droplets className="text-blue-600" />
            <span className="font-black text-xl tracking-tight">DROUGHT PULSE</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 Climate Ready Initiative. Built for resilience.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Github size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
