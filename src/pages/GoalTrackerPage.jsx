import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertCircle, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Completed Credits', value: 87 },
  { name: 'Remaining Credits', value: 51 },
];
const COLORS = ['#10b981', '#1e293b'];

const GoalTrackerPage = () => {
  const [targetCGPA, setTargetCGPA] = useState(3.8);
  const currentCGPA = 3.60;
  const remainingCredits = 51;
  
  // Basic simulation math
  const requiredAvgGPA = ((targetCGPA * 138) - (currentCGPA * 87)) / remainingCredits;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Goal Tracker & Simulation</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Simulate your future semesters to achieve your target CGPA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal Setting Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Target size={20} />
            </div>
            <h2 className="text-lg font-bold">Set Target</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2 block">Target Graduation CGPA</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="2.0" max="4.0" step="0.01" 
                  value={targetCGPA}
                  onChange={(e) => setTargetCGPA(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <div className="w-16 text-center font-bold text-xl">{targetCGPA.toFixed(2)}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-100 dark:border-gray-800">
              <div className="text-sm text-gray-500 mb-1">Required Avg. GPA</div>
              <div className={`text-3xl font-bold ${requiredAvgGPA > 4.0 ? 'text-red-500' : 'text-primary'}`}>
                {requiredAvgGPA > 4.0 ? 'Impossible' : requiredAvgGPA.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                For the remaining {remainingCredits} credits.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-center gap-8"
        >
          <div className="w-48 h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-bold">63%</div>
              <div className="text-xs text-gray-500">Done</div>
            </div>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <h3 className="text-lg font-bold">Degree Completion</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Completed (87 cr)</span>
                <span className="font-semibold text-primary">63%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '63%' }} />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              {requiredAvgGPA <= 4.0 && requiredAvgGPA > currentCGPA ? (
                <div className="flex items-start gap-3 text-sm">
                  <TrendingUp className="text-blue-500 mt-0.5 shrink-0" size={18} />
                  <p className="text-gray-600 dark:text-gray-400">
                    You need to perform <strong className="text-white">better</strong> than your current average. Focus on upcoming high-credit courses.
                  </p>
                </div>
              ) : requiredAvgGPA > 4.0 ? (
                <div className="flex items-start gap-3 text-sm">
                  <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={18} />
                  <p className="text-gray-600 dark:text-gray-400">
                    This target is mathematically impossible with your remaining credits. Maximum achievable CGPA is <strong>{(((currentCGPA * 87) + (4.0 * remainingCredits)) / 138).toFixed(2)}</strong>.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="text-green-500 mt-0.5 shrink-0" size={18} />
                  <p className="text-gray-600 dark:text-gray-400">
                    You are in a great position! Just maintain your current performance level.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Simulator Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-bold">"What-If" Scenario Simulator</h3>
          <button className="text-sm font-medium text-primary hover:text-primary-focus">Add Scenario</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-background-dark/50 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Scenario</th>
                <th className="px-6 py-4 font-medium">Next Semester GPA</th>
                <th className="px-6 py-4 font-medium">Credits Taken</th>
                <th className="px-6 py-4 font-medium">Resulting CGPA</th>
                <th className="px-6 py-4 font-medium">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <tr>
                <td className="px-6 py-4">If I get straight A+s</td>
                <td className="px-6 py-4 font-bold text-primary">4.00</td>
                <td className="px-6 py-4">15</td>
                <td className="px-6 py-4 font-bold">3.66</td>
                <td className="px-6 py-4 text-green-500 flex items-center gap-1"><ArrowUpRight size={16}/> +0.06</td>
              </tr>
              <tr>
                <td className="px-6 py-4">If I maintain current avg</td>
                <td className="px-6 py-4 font-bold text-blue-500">3.60</td>
                <td className="px-6 py-4">15</td>
                <td className="px-6 py-4 font-bold">3.60</td>
                <td className="px-6 py-4 text-gray-500 flex items-center gap-1">0.00</td>
              </tr>
              <tr>
                <td className="px-6 py-4">If I drop slightly</td>
                <td className="px-6 py-4 font-bold text-orange-500">3.30</td>
                <td className="px-6 py-4">15</td>
                <td className="px-6 py-4 font-bold">3.55</td>
                <td className="px-6 py-4 text-red-500 flex items-center gap-1"><ArrowDownRight size={16}/> -0.05</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default GoalTrackerPage;
