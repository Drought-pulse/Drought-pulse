import React from 'react';
import { Droplets, LogOut, User, LayoutDashboard, Map as MapIcon, MessageSquare } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  user: UserType | null;
  onLogout: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Navbar({ user, onLogout, activeView, setActiveView }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => setActiveView('home')}
            >
              <Droplets className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Drought Pulse
              </span>
            </div>
            
            {user && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    activeView === 'dashboard'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveView('map')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    activeView === 'map'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <MapIcon className="w-4 h-4 mr-2" />
                  Live Map
                </button>
                <button
                  onClick={() => setActiveView('chat')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    activeView === 'chat'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  AI Assistant
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="h-5 w-5" />
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveView('login')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
