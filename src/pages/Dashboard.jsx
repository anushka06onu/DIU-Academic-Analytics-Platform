import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { GraduationCap, BookOpen, TrendingUp, Award, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const mockData = [
  { semester: 'Spring 22', gpa: 3.2, cgpa: 3.2, credits: 15 },
  { semester: 'Summer 22', gpa: 3.5, cgpa: 3.35, credits: 12 },
  { semester: 'Fall 22', gpa: 3.8, cgpa: 3.5, credits: 18 },
  { semester: 'Spring 23', gpa: 3.4, cgpa: 3.47, credits: 15 },
  { semester: 'Summer 23', gpa: 3.9, cgpa: 3.56, credits: 12 },
  { semester: 'Fall 23', gpa: 3.75, cgpa: 3.6, credits: 15 },
];

const StatCard = ({ title, value, icon, trend, trendValue, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      {trend && (
        <span className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {trendValue}
        </span>
      )}
    </div>
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <div className="text-3xl font-bold">{value}</div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back! Here's your academic summary.</p>
        </div>
        <button className="bg-primary hover:bg-primary-focus text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-primary/20">
          Generate PDF Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Current CGPA" 
          value="3.60" 
          icon={<Award size={24} />} 
          trend="up" 
          trendValue="+0.04"
          delay={0.1}
        />
        <StatCard 
          title="Credits Completed" 
          value="87" 
          icon={<BookOpen size={24} />} 
          delay={0.2}
        />
        <StatCard 
          title="Predicted Graduation" 
          value="3.72" 
          icon={<GraduationCap size={24} />} 
          trend="up" 
          trendValue="On Track"
          delay={0.3}
        />
        <StatCard 
          title="Performance Trend" 
          value="Improving" 
          icon={<TrendingUp size={24} />} 
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">GPA Progression</h2>
            <select className="bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 text-sm outline-none">
              <option>All Semesters</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} domain={[2.0, 4.0]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="cgpa" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCgpa)" />
                <Line type="monotone" dataKey="gpa" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Insights Sidebar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col"
        >
          <h2 className="text-lg font-bold mb-4">Smart Insights</h2>
          <div className="space-y-4 flex-1">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-start gap-3">
                <TrendingUp className="text-blue-500 mt-0.5 shrink-0" size={18} />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Your performance is consistently improving. You're on track to hit Dean's List next semester if you maintain a 3.75+ GPA.
                </p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
              <div className="flex items-start gap-3">
                <Award className="text-green-500 mt-0.5 shrink-0" size={18} />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  You performed best in semesters with heavy theory courses. Consider taking similar electives.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-orange-500 mt-0.5 shrink-0" size={18} />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Warning: Your upcoming semester has 18 credits, which historically drops your GPA by 0.15 points.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
