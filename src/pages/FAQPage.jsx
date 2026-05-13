import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQPage = () => {
  const faqs = [
    { q: 'Is this platform free?', a: 'Yes! The platform is completely free for all DIU students to use.' },
    { q: 'Is my data secure?', a: 'Absolutely. We use Google Firebase for enterprise-grade security and authentication.' },
    { q: 'How does the prediction system work?', a: 'It calculates your required GPA based on your current CGPA, completed credits, and the target CGPA you set for your graduation.' },
    { q: 'Can I export my report?', a: 'Yes, you can instantly export a perfectly formatted PDF of your dashboard and statistics directly from the platform.' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-gray-100 font-sans selection:bg-primary/30 overflow-x-hidden">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 pt-32 pb-24 relative">
        <div className="text-center mb-16 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Questions</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Everything you need to know about the DIU Academic Analytics Platform.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          {faqs.map((faq, idx) => {
            const [isOpen, setIsOpen] = useState(false);
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
              >
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
              </motion.div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;
