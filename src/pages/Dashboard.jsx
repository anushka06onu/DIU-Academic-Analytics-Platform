import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { GraduationCap, BookOpen, TrendingUp, Award, AlertTriangle, ArrowUpRight, ArrowDownRight, FileDown } from 'lucide-react';
import useStore from '../store/useStore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

  const handleExportPDF = async () => {
    const input = document.getElementById('pdf-content');
    if (!input) return;
    
    setIsExporting(true);
    const toastId = toast.loading('Generating PDF Report...');
    
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#f9fafb'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Academic_Report.pdf');
      toast.success('PDF Downloaded successfully!', { id: toastId });
    } catch (err) {
      toast.error('Failed to generate PDF', { id: toastId });
    } finally {
      setIsExporting(false);
    }
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

  return (
    <div className="space-y-8 pb-10" id="pdf-content">
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
            {isExporting ? 'Generating...' : 'Export PDF'}
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
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 transition-transform hover:-translate-y-1">
              <div className="flex items-start gap-3">
                <TrendingUp className="text-blue-500 mt-0.5 shrink-0" size={18} />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Your GPA trend has improved over the last 2 semesters. Keep up the momentum!
                </p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 transition-transform hover:-translate-y-1">
              <div className="flex items-start gap-3">
                <Award className="text-green-500 mt-0.5 shrink-0" size={18} />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  You perform 15% better in high-credit semesters compared to lighter ones.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 transition-transform hover:-translate-y-1">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-orange-500 mt-0.5 shrink-0" size={18} />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Recommendation: Avoid taking more than 18 credits next semester to maintain your high CGPA.
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
