import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, X, MessageSquare, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithGemini } from '../lib/gemini';
import { ChatMessage } from '../types';

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I am your Drought Pulse AI assistant. How can I help you today? You can ask about current drought conditions, farming tips for low rainfall, or data analysis.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const response = await chatWithGemini(userMessage, messages);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
            AI Pulse Assistant
          </h1>
          <p className="text-gray-500">24/7 agricultural support and data insights</p>
        </div>
        <div className="px-4 py-2 bg-purple-50 rounded-2xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-widest">Always Learning</span>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((message, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'bg-blue-600' : 'bg-purple-100'
                }`}>
                  {message.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-purple-600" />}
                </div>
                <div className={`p-4 rounded-[2rem] text-sm leading-relaxed shadow-sm ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-4 rounded-3xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span className="text-xs font-medium text-gray-500 italic">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <form onSubmit={handleSend} className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Ask agricultural advice or drought queries..."
                className="w-full pl-6 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all shadow-sm"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
             {['Heat stress tips', 'Rainfall updates', 'Water conservation', 'Best crops'].map(suggestion => (
               <button
                 key={suggestion}
                 type="button"
                 onClick={() => setInput(suggestion)}
                 className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-500 hover:border-purple-300 hover:text-purple-600 transition"
               >
                 {suggestion}
               </button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
