import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { X, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import useStore from '../store/useStore';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setSemesters } = useStore();

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setEmail('');
      setPassword('');
    }
  }, [isOpen]);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.semesters) {
          setSemesters(data.semesters);
        } else {
          setSemesters([]);
        }
      } else {
        await setDoc(doc(db, 'users', uid), { semesters: [] });
        setSemesters([]);
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();

    const emailLower = email.toLowerCase().trim();
    if (!emailLower.endsWith('diu.edu.bd') && !emailLower.endsWith('daffodilvarsity.edu.bd')) {
      toast.error('Only DIU student or faculty emails are allowed (e.g., @diu.edu.bd or @daffodilvarsity.edu.bd).');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await signInWithEmailAndPassword(auth, emailLower, password);
        toast.success('Successfully logged in!');
      } else {
        result = await createUserWithEmailAndPassword(auth, emailLower, password);
        if (name) {
          await updateProfile(result.user, { displayName: name });
        }
        toast.success('Account created successfully!');
      }
      await fetchUserData(result.user.uid);
      onClose();
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/operation-not-allowed') {
        toast.error('Please enable Email/Password Authentication in your Firebase Console!');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Try logging in instead.');
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        toast.error('Invalid email or password.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password should be at least 6 characters.');
      } else {
        toast.error('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error('Please enter your email address first.');
      return;
    }

    const emailLower = email.toLowerCase().trim();
    if (!emailLower.endsWith('diu.edu.bd') && !emailLower.endsWith('daffodilvarsity.edu.bd')) {
      toast.error('Only DIU student or faculty emails are allowed (e.g., @diu.edu.bd or @daffodilvarsity.edu.bd).');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, emailLower);
      toast.success('Password reset email sent!');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email.');
      } else {
        toast.error('Failed to send reset email.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-card-dark rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-800"
      >
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl mx-auto flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-primary/30">
              DIU
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {isLogin ? 'Sign in to access your analytics.' : 'Join the platform to track your academic journey.'}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <input 
                    type="text" 
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="Student Name"
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">DIU Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                  placeholder="student@diu.edu.bd"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                {isLogin && (
                  <button type="button" onClick={handlePasswordReset} className="text-xs text-primary hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 bg-primary hover:bg-primary-focus text-white rounded-xl py-3 font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              {loading ? <span className="animate-pulse">Loading...</span> : (
                <>
                  <LogIn size={18} />
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-semibold"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
