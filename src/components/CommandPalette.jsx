import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Search, LayoutDashboard, Library, Target, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

const CommandPalette = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, theme, toggleTheme, user } = useStore();
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setSearch('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    { id: 'dashboard', name: 'Go to Dashboard', icon: <LayoutDashboard size={18} />, action: () => navigate('/dashboard') },
    { id: 'semesters', name: 'Manage Semesters', icon: <Library size={18} />, action: () => navigate('/semesters') },
    { id: 'goals', name: 'Goal Tracker', icon: <Target size={18} />, action: () => navigate('/goals') },
    { id: 'theme', name: `Toggle Theme (${theme === 'dark' ? 'Light' : 'Dark'})`, icon: theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />, action: toggleTheme },
  ];

  if (user) {
    actions.push({ id: 'logout', name: 'Log Out', icon: <LogOut size={18} />, action: () => signOut(auth) });
  }

  const filteredActions = actions.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={() => setCommandPaletteOpen(false)} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-card-dark w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 relative z-10"
      >
        <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <Search size={20} className="text-gray-400" />
          <input 
            ref={inputRef}
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-gray-900 dark:text-gray-100"
          />
          <div className="text-xs text-gray-400 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded">ESC</div>
        </div>
        
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredActions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No results found.</div>
          ) : (
            filteredActions.map((action, idx) => (
              <button
                key={action.id}
                onClick={() => {
                  action.action();
                  setCommandPaletteOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white group"
              >
                <div className="text-gray-400 group-hover:text-primary transition-colors">
                  {action.icon}
                </div>
                {action.name}
              </button>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CommandPalette;
