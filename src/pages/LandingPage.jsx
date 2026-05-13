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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

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

      <section id="features" className="py-24 bg-white dark:bg-card-dark border-t border-gray-200 dark:border-gray-800 relative z-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need for Academic Excellence</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform provides all the tools required to track, analyze, and predict your academic trajectory with unparalleled clarity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-gray-50 dark:bg-background-dark border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 bg-gray-50 dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 relative z-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about the DIU Academic Analytics Platform.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'Is this platform free?', a: 'Yes! The platform is completely free for all DIU students to use.' },
              { q: 'Is my data secure?', a: 'Absolutely. We use Google Firebase for enterprise-grade security and authentication.' },
              { q: 'How does the prediction system work?', a: 'It calculates your required GPA based on your current CGPA, completed credits, and the target CGPA you set for your graduation.' },
              { q: 'Can I export my report?', a: 'Yes, you can instantly export a perfectly formatted PDF of your dashboard and statistics directly from the platform.' }
            ].map((faq, idx) => {
              const [isOpen, setIsOpen] = useState(false);
              return (
                <div key={idx} className="bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                  <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-6 py-4 flex items-center justify-between font-bold text-lg text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {faq.q}
                    <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 mt-2 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
