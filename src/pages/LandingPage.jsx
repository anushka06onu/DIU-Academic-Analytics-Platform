import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, TrendingUp, Award, BookOpen } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import useStore from '../store/useStore';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, setAuthOpen } = useStore();

  const handleStart = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setAuthOpen(true);
    }
  };

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
      title: 'Real-Time Analytics',
      description: 'Track your CGPA, semester GPA, and credit completion with beautiful, animated interactive charts.'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
      title: 'Predictive Insights',
      description: 'Simulate future semesters to see exactly what you need to achieve your target graduation CGPA.'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-purple-500" />,
      title: 'Dynamic Semester Management',
      description: 'Add unlimited semesters, calculate real-time GPA updates, and automatically map DIU grading systems.'
    },
    {
      icon: <Award className="w-6 h-6 text-yellow-500" />,
      title: 'Smart Goal Tracking',
      description: 'Set ambitious academic targets and receive actionable insights to stay on the Dean\'s List.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-gray-100 font-sans selection:bg-primary/30">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 pt-32 pb-32 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Designed for Daffodil International University Students
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
          >
            Master Your Academic Journey with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Precision.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            A premium, professional-grade platform to track your CGPA, predict future outcomes, and unlock data-driven insights about your academic performance.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-focus transition-all shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5"
            >
              Start Tracking Now <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-card-dark text-gray-900 dark:text-white font-semibold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-700"
            >
              Learn More
            </button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-background-dark z-10" />
          <div className="glassmorphism rounded-2xl overflow-hidden shadow-2xl border border-white/20 dark:border-gray-700 p-2 md:p-4">
            <div className="bg-white dark:bg-card-dark rounded-xl w-full h-[400px] md:h-[600px] border border-gray-100 dark:border-gray-800 flex flex-col">
              <div className="h-14 border-b border-gray-100 dark:border-gray-800 flex items-center px-6 gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1" />
                <div className="w-32 h-6 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
              </div>
              <div className="flex-1 p-6 flex gap-6">
                <div className="hidden md:flex w-48 flex-col gap-4">
                  <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
                  <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
                  <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-md w-3/4 animate-pulse" />
                </div>
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex gap-6 h-32">
                    <div className="flex-1 bg-primary/10 rounded-xl border border-primary/20" />
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                  </div>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
