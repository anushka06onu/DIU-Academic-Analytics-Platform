import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertCircle, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const COLORS = ['#10b981', '#1e293b'];

const GoalTrackerPage = () => {
  const { semesters } = useStore();
  const [targetCGPA, setTargetCGPA] = useState(3.8);

  const calculateOverallStats = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    semesters.forEach(sem => {
      const semCredits = sem.courses.reduce((acc, curr) => acc + Number(curr.credit || 0), 0);
      const semPoints = sem.courses.reduce((acc, curr) => acc + (Number(curr.credit || 0) * Number(curr.grade || 0)), 0);
      totalPoints += semPoints;
      totalCredits += semCredits;
    });

    const currentCGPA = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    return { currentCGPA, totalCredits };
  };

  const { currentCGPA, totalCredits: completedCredits } = calculateOverallStats();
  const DEGREE_TOTAL_CREDITS = 138; // standard DIU degree credits
  const remainingCredits = Math.max(0, DEGREE_TOTAL_CREDITS - completedCredits);
  
  // Calculate required GPA for remaining credits
  let requiredAvgGPA = 0;
  if (remainingCredits > 0) {
    requiredAvgGPA = ((targetCGPA * DEGREE_TOTAL_CREDITS) - (currentCGPA * completedCredits)) / remainingCredits;
  }

  const completionPercentage = DEGREE_TOTAL_CREDITS > 0 ? Math.min(100, (completedCredits / DEGREE_TOTAL_CREDITS) * 100).toFixed(0) : 0;
  
  const data = [
    { name: 'Completed Credits', value: completedCredits },
    { name: 'Remaining Credits', value: remainingCredits },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Goal Tracker & Simulation</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Simulate your future semesters to achieve your target CGPA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  className="flex-1 accent-primary cursor-pointer"
                />
                <div className="w-16 text-center font-bold text-xl">{targetCGPA.toFixed(2)}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
              <div className="text-sm text-gray-500 mb-1">Required Avg. GPA</div>
              <div className={`text-3xl font-bold ${requiredAvgGPA > 4.0 || requiredAvgGPA < 0 ? 'text-red-500' : 'text-primary'}`}>
                {requiredAvgGPA > 4.0 || requiredAvgGPA < 0 ? 'Impossible' : requiredAvgGPA.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                For the remaining {remainingCredits} credits.
              </div>
            </div>
          </div>
        </motion.div>

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
              <div className="text-2xl font-bold">{completionPercentage}%</div>
              <div className="text-xs text-gray-500">Done</div>
            </div>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <h3 className="text-lg font-bold">Degree Completion</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Completed ({completedCredits} cr)</span>
                <span className="font-semibold text-primary">{completionPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${completionPercentage}%` }} />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              {completedCredits === 0 ? (
                <div className="flex items-start gap-3 text-sm">
                  <AlertCircle className="text-gray-500 mt-0.5 shrink-0" size={18} />
                  <p className="text-gray-600 dark:text-gray-400">
                    Add semesters to see your degree progression and required targets.
                  </p>
                </div>
              ) : requiredAvgGPA <= 4.0 && requiredAvgGPA > currentCGPA ? (
                <div className="flex items-start gap-3 text-sm">
                  <TrendingUp className="text-blue-500 mt-0.5 shrink-0" size={18} />
                  <p className="text-gray-600 dark:text-gray-400">
                    You need to perform <strong className="text-gray-900 dark:text-white">better</strong> than your current average ({currentCGPA.toFixed(2)}). Focus on upcoming high-credit courses.
                  </p>
                </div>
              ) : requiredAvgGPA > 4.0 ? (
                <div className="flex items-start gap-3 text-sm">
                  <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={18} />
                  <p className="text-gray-600 dark:text-gray-400">
                    This target is mathematically impossible with your remaining credits. Maximum achievable CGPA is <strong>{(((currentCGPA * completedCredits) + (4.0 * remainingCredits)) / DEGREE_TOTAL_CREDITS).toFixed(2)}</strong>.
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

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-bold">"What-If" Scenario Simulator</h3>
          <button 
            onClick={() => toast.success('Custom scenarios coming soon!')}
            className="text-sm font-medium text-primary hover:text-primary-focus transition-colors"
          >
            Add Scenario
          </button>
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
              {[
                { name: 'If I get straight A+s', gpa: 4.00, cred: 15 },
                { name: 'If I maintain current avg', gpa: currentCGPA || 3.0, cred: 15 },
                { name: 'If I drop slightly', gpa: Math.max(0, currentCGPA - 0.3), cred: 15 },
              ].map((scenario, idx) => {
                const newTotalPoints = (currentCGPA * completedCredits) + (scenario.gpa * scenario.cred);
                const newTotalCredits = completedCredits + scenario.cred;
                const newCgpa = newTotalCredits > 0 ? (newTotalPoints / newTotalCredits) : 0;
                const impact = newCgpa - currentCGPA;
                
                return (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">{scenario.name}</td>
                    <td className="px-6 py-4 font-bold text-primary">{scenario.gpa.toFixed(2)}</td>
                    <td className="px-6 py-4">{scenario.cred}</td>
                    <td className="px-6 py-4 font-bold">{newCgpa.toFixed(2)}</td>
                    <td className={`px-6 py-4 flex items-center gap-1 ${impact > 0 ? 'text-green-500' : impact < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                      {impact > 0 ? <ArrowUpRight size={16}/> : impact < 0 ? <ArrowDownRight size={16}/> : null}
                      {impact > 0 ? '+' : ''}{impact.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default GoalTrackerPage;
