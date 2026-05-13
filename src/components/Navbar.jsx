import React, { useState, useEffect } from 'react';
import { Sun, Moon, LogIn, LayoutDashboard, Library, Target, LogOut, Menu, X } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import useStore from '../store/useStore';
import AuthModal from './AuthModal';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
  const { user, theme, toggleTheme, isAuthOpen, setAuthOpen } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = user ? (
    <>
      <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={({isActive}) => `block py-2 ${isActive ? "text-primary font-bold" : "hover:text-primary transition-colors"}`}>Dashboard</NavLink>
      <NavLink to="/semesters" onClick={() => setIsMobileMenuOpen(false)} className={({isActive}) => `block py-2 ${isActive ? "text-primary font-bold" : "hover:text-primary transition-colors"}`}>Semesters</NavLink>
      <NavLink to="/goals" onClick={() => setIsMobileMenuOpen(false)} className={({isActive}) => `block py-2 ${isActive ? "text-primary font-bold" : "hover:text-primary transition-colors"}`}>Goal Tracker</NavLink>
    </>
  ) : (
    <>
      <NavLink to="/features" onClick={() => setIsMobileMenuOpen(false)} className={({isActive}) => `block py-2 ${isActive ? "text-primary font-bold" : "hover:text-primary transition-colors"}`}>Features</NavLink>
      <NavLink to="/faq" onClick={() => setIsMobileMenuOpen(false)} className={({isActive}) => `block py-2 ${isActive ? "text-primary font-bold" : "hover:text-primary transition-colors"}`}>FAQ</NavLink>
    </>
  );

  return (
    <>
      <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || !isLandingPage || isMobileMenuOpen ? 'bg-white/90 dark:bg-card-dark/90 backdrop-blur-md shadow-sm py-4 border-b border-gray-200 dark:border-gray-800' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity z-50">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
              DIU
            </div>
            <span className="font-bold text-base sm:text-xl tracking-tight dark:text-white">Analytics Platform</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            {navLinks}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-red-50 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:bg-red-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setAuthOpen(true)}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-3 z-50">
            {user ? (
              <button 
                onClick={handleLogout}
                className="p-1.5 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            ) : (
              <button 
                onClick={() => setAuthOpen(true)}
                className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-primary-focus transition-colors shadow-sm"
              >
                Sign In
              </button>
            )}
            <button onClick={toggleTheme} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1.5 text-gray-600 dark:text-gray-300 focus:outline-none">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-white/95 dark:bg-card-dark/95 border-b border-gray-200 dark:border-gray-800 absolute top-full left-0 w-full shadow-lg"
            >
              <div className="px-6 py-6 flex flex-col gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                {navLinks}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                  {user ? (
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors py-2 font-bold"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setAuthOpen(true);
                      }}
                      className="w-full bg-primary text-white px-6 py-3 rounded-xl text-center font-bold hover:bg-primary-focus transition-colors shadow-lg shadow-primary/30 mt-2"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
