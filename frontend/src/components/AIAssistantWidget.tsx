import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, ArrowRight, X } from 'lucide-react';

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Hello! I am your Shiv Shakti AI. I can analyze inventory, predict udhari defaults, or summarize job cards. How can I help?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: 'Analyzing... Based on recent data, I recommend re-stocking Engine Oil as it has high demand this week.' }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-blue-500/20 overflow-hidden flex flex-col h-[450px]"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse"><Wrench className="w-4 h-4" /></div>
                <span className="font-bold">Shiv Shakti AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-600'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2">
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)}
                placeholder="Ask AI anything..." 
                className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2 outline-none text-sm dark:text-white border border-transparent focus:border-blue-500/50 transition-colors"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors shadow-sm"><ArrowRight className="w-5 h-5" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white flex items-center justify-center shadow-lg shadow-blue-500/40 relative"
      >
        <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></span>
        <Wrench className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
