import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FeaturesPage = () => {
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
            Everything You Need for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Academic Excellence</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Our platform provides all the tools required to track, analyze, and predict your academic trajectory with unparalleled clarity.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto relative z-10">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
