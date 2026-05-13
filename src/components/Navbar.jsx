import React, { useState, useEffect } from 'react';
import { Sun, Moon, LogIn, LayoutDashboard, Library, Target, LogOut } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import useStore from '../store/useStore';
import AuthModal from './AuthModal';

const Navbar = () => {
  const { user, theme, toggleTheme } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
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
    navigate('/');
  };

  return (
    <>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || !isLandingPage ? 'bg-white/80 dark:bg-card-dark/80 backdrop-blur-md shadow-sm py-4 border-b border-gray-200 dark:border-gray-800' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
              DIU
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block dark:text-white">Analytics Platform</span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            {user ? (
              <>
                <NavLink to="/dashboard" className={({isActive}) => isActive ? "text-primary font-bold" : "hover:text-primary transition-colors"}>Dashboard</NavLink>
                <NavLink to="/semesters" className={({isActive}) => isActive ? "text-primary font-bold" : "hover:text-primary transition-colors"}>Semesters</NavLink>
                <NavLink to="/goals" className={({isActive}) => isActive ? "text-primary font-bold" : "hover:text-primary transition-colors"}>Goal Tracker</NavLink>
              </>
            ) : (
              <>
                <a href="/#features" className="hover:text-primary transition-colors">Features</a>
                <a href="/#faq" className="hover:text-primary transition-colors">FAQ</a>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
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
                onClick={() => setIsAuthOpen(true)}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
