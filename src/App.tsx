import React, { useState, useEffect } from 'react';
import { User, DroughtData } from './types';
import { getCurrentUser, setCurrentUser, getStoredDatasets, saveDataset } from './lib/storage';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Home from './components/Home';
import ResearcherDashboard from './components/ResearcherDashboard';
import FarmerDashboard from './components/FarmerDashboard';
import InteractiveMap from './components/InteractiveMap';
import Chatbot from './components/Chatbot';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [data, setData] = useState<DroughtData[]>(getStoredDatasets());
  const [activeView, setActiveView] = useState<string>('home');

  useEffect(() => {
    if (user && activeView === 'home') {
      setActiveView('dashboard');
    }
  }, [user]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setCurrentUser(newUser);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentUser(null);
    setActiveView('home');
  };

  const handleUpload = (newData: DroughtData[]) => {
    setData(newData);
    saveDataset(newData);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <Home onGetStarted={() => setActiveView('login')} />;
      case 'login':
        return <Auth onLogin={handleLogin} />;
      case 'dashboard':
        if (!user) return <Auth onLogin={handleLogin} />;
        return user.role === 'researcher' 
          ? <ResearcherDashboard data={data} onUpload={handleUpload} />
          : <FarmerDashboard user={user} data={data} />;
      case 'map':
        return <InteractiveMap data={data} />;
      case 'chat':
        return <Chatbot />;
      default:
        return <Home onGetStarted={() => setActiveView('login')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        activeView={activeView} 
        setActiveView={setActiveView} 
      />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
