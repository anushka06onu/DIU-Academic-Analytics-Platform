import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { GraduationCap, BookOpen, TrendingUp, Award, AlertTriangle, ArrowUpRight, ArrowDownRight, FileDown } from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon, trend, trendValue, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
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
  const { semesters, setSemesters, user } = useStore();
  const [isExporting, setIsExporting] = useState(false);

  // Calculate Data
  const calculateData = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    const chartData = [...semesters].reverse().map(sem => {
      const semCredits = sem.courses.reduce((acc, curr) => acc + Number(curr.credit || 0), 0);
      const semPoints = sem.courses.reduce((acc, curr) => acc + (Number(curr.credit || 0) * Number(curr.grade || 0)), 0);
      const gpa = semCredits > 0 ? (semPoints / semCredits) : 0;
      
      totalPoints += semPoints;
      totalCredits += semCredits;
      const cgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;

      return {
        semester: sem.name,
        gpa: Number(gpa.toFixed(2)),
        cgpa: Number(cgpa.toFixed(2)),
        credits: semCredits
      };
    });

    const currentCgpa = chartData.length > 0 ? chartData[chartData.length - 1].cgpa : 0;
    
    // Simple prediction algorithm
    const prediction = currentCgpa > 0 ? Math.min(4.0, currentCgpa + 0.05).toFixed(2) : "0.00";
    
    return { chartData, currentCgpa, totalCredits, prediction };
  };

  const { chartData, currentCgpa, totalCredits, prediction } = calculateData();

  const handleExportPDF = () => {
    toast.success('Select "Save as PDF" in the print dialog!', { duration: 4000 });
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const loadExampleData = () => {
    setSemesters([
      {
        id: 'sem3',
        name: 'Fall 2023',
        expanded: false,
        courses: [
          { id: 'c1', code: 'SWE 331', title: 'Software Engineering', credit: 3, grade: 3.75 },
          { id: 'c2', code: 'SWE 333', title: 'Database Management', credit: 3, grade: 4.00 }
        ]
      },
      {
        id: 'sem2',
        name: 'Summer 2023',
        expanded: false,
        courses: [
          { id: 'c3', code: 'SWE 221', title: 'Data Structures', credit: 3, grade: 3.50 },
          { id: 'c4', code: 'SWE 223', title: 'Algorithms', credit: 3, grade: 3.75 }
        ]
      },
      {
        id: 'sem1',
        name: 'Spring 2023',
        expanded: false,
        courses: [
          { id: 'c5', code: 'SWE 111', title: 'Programming C', credit: 3, grade: 4.00 },
          { id: 'c6', code: 'ENG 113', title: 'Basic English', credit: 3, grade: 3.25 }
        ]
      }
    ]);
    toast.success('Example data loaded! Please go to Semesters to edit or save.');
  };

  if (semesters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <BookOpen size={48} />
        </div>
        <h2 className="text-3xl font-bold">Welcome to your Dashboard</h2>
        <p className="text-gray-500 max-w-md">You haven't added any academic data yet. Add your first semester to unlock beautiful analytics and predictions.</p>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.href='/semesters'}
            className="bg-primary hover:bg-primary-focus text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            Add First Semester
          </button>
          <button 
            onClick={loadExampleData}
            className="bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-full font-semibold transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Load Example Data
          </button>
        </div>
      </div>
    );
  }

  const generateInsights = () => {
    if (chartData.length === 0) return [];
    
    const insights = [];
    
    // Insight 1: Trend
    if (chartData.length >= 2) {
      const last = chartData[chartData.length - 1].gpa;
      const prev = chartData[chartData.length - 2].gpa;
      if (last > prev) {
        insights.push({
          icon: <TrendingUp className="text-blue-500 mt-0.5 shrink-0" size={18} />,
          text: `Great job! Your semester GPA improved from ${prev.toFixed(2)} to ${last.toFixed(2)}. Keep up the momentum!`,
          bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30'
        });
      } else if (last < prev) {
        insights.push({
          icon: <AlertTriangle className="text-orange-500 mt-0.5 shrink-0" size={18} />,
          text: `Your recent semester GPA (${last.toFixed(2)}) dropped slightly compared to the previous one (${prev.toFixed(2)}). Identify the tough courses and adapt!`,
          bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/30'
        });
      } else {
        insights.push({
          icon: <TrendingUp className="text-blue-500 mt-0.5 shrink-0" size={18} />,
          text: `You maintained a perfectly consistent GPA of ${last.toFixed(2)} across your last two semesters!`,
          bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30'
        });
      }
    } else {
      insights.push({
        icon: <Award className="text-green-500 mt-0.5 shrink-0" size={18} />,
        text: `Great start to your academic journey! Add more semesters to unlock trend analysis.`,
        bg: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30'
      });
    }

    // Insight 2: Credit Load Analysis
    if (chartData.length >= 2) {
      const heavySemesters = chartData.filter(s => s.credits >= 15);
      const lightSemesters = chartData.filter(s => s.credits < 15);
      
      const heavyAvg = heavySemesters.length ? heavySemesters.reduce((a,b)=>a+b.gpa,0)/heavySemesters.length : 0;
      const lightAvg = lightSemesters.length ? lightSemesters.reduce((a,b)=>a+b.gpa,0)/lightSemesters.length : 0;

      if (heavyAvg > lightAvg && heavySemesters.length > 0 && lightSemesters.length > 0) {
        insights.push({
          icon: <Award className="text-green-500 mt-0.5 shrink-0" size={18} />,
          text: `You actually perform better in heavy semesters (15+ credits) with a ${heavyAvg.toFixed(2)} avg vs ${lightAvg.toFixed(2)} in lighter ones.`,
          bg: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30'
        });
      } else if (lightAvg > heavyAvg && heavySemesters.length > 0 && lightSemesters.length > 0) {
        insights.push({
          icon: <Award className="text-green-500 mt-0.5 shrink-0" size={18} />,
          text: `You perform much stronger in lighter semesters (<15 credits). Consider balancing your future course load to protect your CGPA.`,
          bg: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30'
        });
      }
    }

    // Insight 3: Grade Analysis
    const allCourses = semesters.flatMap(s => s.courses);
    const lowGrades = allCourses.filter(c => c.grade <= 2.75 && c.grade > 0);
    const failedGrades = allCourses.filter(c => c.grade === 0);

    if (failedGrades.length > 0) {
      insights.push({
        icon: <AlertTriangle className="text-red-500 mt-0.5 shrink-0" size={18} />,
        text: `You have ${failedGrades.length} failed course(s). Retaking these will have the largest immediate mathematical impact on your CGPA.`,
        bg: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30'
      });
    } else if (lowGrades.length > 0) {
       insights.push({
        icon: <AlertTriangle className="text-orange-500 mt-0.5 shrink-0" size={18} />,
        text: `You have ${lowGrades.length} course(s) with a B- or lower. Retaking these could rapidly boost your overall CGPA.`,
        bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/30'
      });
    } else if (allCourses.length > 0) {
      insights.push({
        icon: <Award className="text-green-500 mt-0.5 shrink-0" size={18} />,
        text: `Excellent performance! You have no failing grades or low marks dragging down your CGPA.`,
        bg: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30'
      });
    }

    return insights;
  };

  const dynamicInsights = generateInsights();

  return (
    <>
      {/* --- NORMAL INTERACTIVE DASHBOARD --- */}
      <div className="space-y-8 pb-10 print:hidden" id="pdf-content">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Overview</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Student'}!</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toast('Edit Profile coming soon!', { icon: '✏️' })}
              className="flex items-center gap-2 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              Edit Profile
            </button>
            <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 bg-primary hover:bg-primary-focus text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              <FileDown size={18} />
              {isExporting ? 'Generating...' : 'Export PDF Report'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Current CGPA" 
            value={currentCgpa.toFixed(2)} 
            icon={<Award size={24} />} 
            trend={chartData.length > 1 && chartData[chartData.length-1].cgpa >= chartData[chartData.length-2].cgpa ? "up" : "down"} 
            trendValue={chartData.length > 1 ? Math.abs(chartData[chartData.length-1].cgpa - chartData[chartData.length-2].cgpa).toFixed(2) : "0.00"}
            delay={0.1}
          />
          <StatCard 
            title="Credits Completed" 
            value={totalCredits} 
            icon={<BookOpen size={24} />} 
            delay={0.2}
          />
          <StatCard 
            title="Predicted Graduation" 
            value={prediction} 
            icon={<GraduationCap size={24} />} 
            trend="up" 
            trendValue="On Track"
            delay={0.3}
          />
          <StatCard 
            title="Consistency Score" 
            value="88%" 
            icon={<TrendingUp size={24} />} 
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2 bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">GPA Progression</h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col"
          >
            <h2 className="text-lg font-bold mb-4">Smart Insights</h2>
            <div className="space-y-4 flex-1">
              {dynamicInsights.length > 0 ? (
                dynamicInsights.map((insight, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border transition-transform hover:-translate-y-1 ${insight.bg}`}>
                    <div className="flex items-start gap-3">
                      {insight.icon}
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {insight.text}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                 <div className="text-gray-500 text-sm text-center py-10">Add semesters to unlock insights.</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>


      {/* --- HIDDEN PRINT-ONLY REPORT --- */}
      <div className="hidden print:block w-full text-black bg-white">
        <div className="text-center mb-10 pb-6 border-b-2 border-gray-900">
          <h1 className="text-4xl font-extrabold mb-2 uppercase tracking-wide">DIU Academic Report</h1>
          <p className="text-xl font-medium text-gray-700">Student: {user?.displayName || user?.email?.split('@')[0] || 'N/A'}</p>
          <p className="text-sm text-gray-500 mt-2">Generated on: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="flex justify-between items-center mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-200" style={{ pageBreakInside: 'avoid' }}>
          <div className="text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Current CGPA</p>
            <p className="text-3xl font-bold text-primary">{currentCgpa.toFixed(2)}</p>
          </div>
          <div className="text-center border-l border-r border-gray-200 px-10">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Total Credits</p>
            <p className="text-3xl font-bold">{totalCredits}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Predicted Graduation</p>
            <p className="text-3xl font-bold text-blue-600">{prediction}</p>
          </div>
        </div>

        <div className="mb-12" style={{ pageBreakInside: 'avoid' }}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-primary"/> GPA Progression
          </h2>
          <div className="h-[300px] w-full border border-gray-200 rounded-2xl p-4 bg-white">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="semester" tick={{ fill: '#374151', fontSize: 12 }} dy={10} axisLine={false} tickLine={false} />
                <YAxis domain={[2.0, 4.0]} tick={{ fill: '#374151', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Line type="monotone" dataKey="cgpa" name="Cumulative CGPA" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                <Line type="monotone" dataKey="gpa" name="Semester GPA" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="break-before-page">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b-2 border-gray-900 pb-2">
            <BookOpen size={24} className="text-primary"/> Detailed Semester Breakdown
          </h2>
          
          <div className="space-y-8">
            {semesters.map((sem, idx) => {
              const semCredits = sem.courses.reduce((acc, curr) => acc + Number(curr.credit || 0), 0);
              const semPoints = sem.courses.reduce((acc, curr) => acc + (Number(curr.credit || 0) * Number(curr.grade || 0)), 0);
              const gpa = semCredits > 0 ? (semPoints / semCredits) : 0;

              return (
                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden" style={{ pageBreakInside: 'avoid' }}>
                  <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b border-gray-200">
                    <h3 className="font-bold text-lg">{sem.name}</h3>
                    <div className="flex gap-6 text-sm font-semibold text-gray-700">
                      <span>Semester GPA: <span className={gpa >= 3.5 ? 'text-green-600' : ''}>{gpa.toFixed(2)}</span></span>
                      <span>Credits: {semCredits}</span>
                    </div>
                  </div>
                  
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Course Code</th>
                        <th className="px-6 py-3 font-semibold">Course Title</th>
                        <th className="px-6 py-3 font-semibold text-center">Credits</th>
                        <th className="px-6 py-3 font-semibold text-center">Grade Achieved</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sem.courses.map((c, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-3 font-medium text-gray-900">{c.code}</td>
                          <td className="px-6 py-3 text-gray-600">{c.title}</td>
                          <td className="px-6 py-3 text-center text-gray-600">{c.credit}</td>
                          <td className="px-6 py-3 text-center font-bold">
                            {c.grade > 0 ? Number(c.grade).toFixed(2) : <span className="text-red-500">F</span>}
                          </td>
                        </tr>
                      ))}
                      {sem.courses.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-gray-500 italic">No courses added for this semester.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
