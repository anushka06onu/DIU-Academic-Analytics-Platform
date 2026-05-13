import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronDown, ChevronUp, Save, CloudOff, Cloud } from 'lucide-react';
import useStore from '../store/useStore';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const GRADES = [
  { label: 'A+ (4.00)', value: 4.00 },
  { label: 'A (3.75)', value: 3.75 },
  { label: 'A- (3.50)', value: 3.50 },
  { label: 'B+ (3.25)', value: 3.25 },
  { label: 'B (3.00)', value: 3.00 },
  { label: 'B- (2.75)', value: 2.75 },
  { label: 'C+ (2.50)', value: 2.50 },
  { label: 'C (2.25)', value: 2.25 },
  { label: 'D (2.00)', value: 2.00 },
  { label: 'F (0.00)', value: 0.00 },
];

const SemestersPage = () => {
  const { semesters, setSemesters, user } = useStore();
  const [syncStatus, setSyncStatus] = useState('synced');

  // Auto-save is removed to favor manual saving

  const toggleSemester = (id) => {
    setSemesters(semesters.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s));
  };

  const addSemester = () => {
    const newSem = {
      id: Date.now().toString(),
      name: `New Semester`,
      expanded: true,
      courses: [{ id: Date.now().toString(), code: '', title: '', credit: 3, grade: 4.00 }]
    };
    setSemesters([newSem, ...semesters]);
  };

  const calculateGPA = (courses) => {
    const totalCredits = courses.reduce((acc, curr) => acc + Number(curr.credit || 0), 0);
    if (totalCredits === 0) return 0;
    const totalPoints = courses.reduce((acc, curr) => acc + (Number(curr.credit || 0) * Number(curr.grade || 0)), 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  const handleSaveSemester = async (e) => {
    if (e) e.preventDefault();
    
    if (!user || !user.uid) {
      toast.error('You must be logged in to save data.');
      return;
    }

    const cleanSemesters = JSON.parse(JSON.stringify(semesters));
    const userRef = doc(db, 'users', user.uid);

    const savePromise = new Promise(async (resolve, reject) => {
      // If Firestore hangs (e.g. database not created), timeout after 5 seconds
      const timeout = setTimeout(() => {
        reject(new Error("Connection timed out! Have you clicked 'Create Database' in your Firestore Console?"));
      }, 5000);

      try {
        await setDoc(userRef, { semesters: cleanSemesters }, { merge: true });
        clearTimeout(timeout);
        resolve();
      } catch (err) {
        clearTimeout(timeout);
        reject(err);
      }
    });

    toast.promise(savePromise, {
      loading: 'Saving your data to the cloud...',
      success: 'Saved successfully!',
      error: (err) => `${err.message}`,
    });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Semesters</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your courses and calculate real-time GPA.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={addSemester}
            className="flex items-center gap-2 bg-white dark:bg-card-dark text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-transform hover:-translate-y-0.5 shadow-sm"
          >
            <Plus size={16} /> Add Semester
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {semesters.map((semester) => (
            <motion.div
              key={semester.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              <div 
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleSemester(semester.id)}
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    {semester.expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={semester.name}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const newName = e.target.value;
                        setSemesters(semesters.map(s => s.id === semester.id ? { ...s, name: newName } : s));
                      }}
                      className="text-lg font-bold bg-transparent outline-none border-b border-transparent focus:border-primary transition-colors w-full"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {semester.courses.length} courses • {semester.courses.reduce((a, c) => a + Number(c.credit || 0), 0)} Credits
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6 ml-4">
                  <div className="text-right">
                    <div className="text-xs sm:text-sm text-gray-500">GPA</div>
                    <div className="text-xl sm:text-2xl font-bold text-primary">{calculateGPA(semester.courses)}</div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSemesters(semesters.filter(s => s.id !== semester.id));
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {semester.expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100 dark:border-gray-800"
                  >
                    <div className="p-3 sm:p-5">
                      <div className="hidden sm:grid grid-cols-12 gap-4 mb-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                        <div className="col-span-3">Course Code</div>
                        <div className="col-span-4">Course Title</div>
                        <div className="col-span-2">Credits</div>
                        <div className="col-span-2">Grade</div>
                      </div>

                      <div className="space-y-3">
                        {semester.courses.map((course, idx) => (
                          <div key={course.id} className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-center bg-gray-50 dark:bg-background-dark p-3 sm:p-2 rounded-xl border border-gray-100 dark:border-gray-800 sm:border-none">
                            <div className="col-span-3 w-full">
                              <label className="sm:hidden text-xs text-gray-500 mb-1 block">Course Code</label>
                              <input 
                                type="text" 
                                placeholder="SWE 101"
                                value={course.code}
                                onChange={(e) => {
                                  const newCourses = [...semester.courses];
                                  newCourses[idx].code = e.target.value;
                                  setSemesters(semesters.map(s => s.id === semester.id ? { ...s, courses: newCourses } : s));
                                }}
                                className="w-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                              />
                            </div>
                            <div className="col-span-4 w-full">
                              <label className="sm:hidden text-xs text-gray-500 mb-1 block">Course Title</label>
                              <input 
                                type="text" 
                                placeholder="Introduction to Software Engineering"
                                value={course.title}
                                onChange={(e) => {
                                  const newCourses = [...semester.courses];
                                  newCourses[idx].title = e.target.value;
                                  setSemesters(semesters.map(s => s.id === semester.id ? { ...s, courses: newCourses } : s));
                                }}
                                className="w-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                              />
                            </div>
                            <div className="col-span-2 w-full flex gap-3 sm:block">
                              <div className="flex-1 sm:w-full">
                                <label className="sm:hidden text-xs text-gray-500 mb-1 block">Credits</label>
                                <input 
                                  type="number" 
                                  min="0" max="4" step="1"
                                  value={course.credit}
                                  onChange={(e) => {
                                    const newCourses = [...semester.courses];
                                    newCourses[idx].credit = e.target.value;
                                    setSemesters(semesters.map(s => s.id === semester.id ? { ...s, courses: newCourses } : s));
                                  }}
                                  className="w-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                                />
                              </div>
                              <div className="flex-1 sm:hidden">
                                <label className="text-xs text-gray-500 mb-1 block">Grade</label>
                                <select
                                  value={course.grade}
                                  onChange={(e) => {
                                    const newCourses = [...semester.courses];
                                    newCourses[idx].grade = Number(e.target.value);
                                    setSemesters(semesters.map(s => s.id === semester.id ? { ...s, courses: newCourses } : s));
                                  }}
                                  className="w-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                                >
                                  {GRADES.map(g => (
                                    <option key={g.value} value={g.value}>{g.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="col-span-2 hidden sm:block w-full">
                              <select
                                value={course.grade}
                                onChange={(e) => {
                                  const newCourses = [...semester.courses];
                                  newCourses[idx].grade = Number(e.target.value);
                                  setSemesters(semesters.map(s => s.id === semester.id ? { ...s, courses: newCourses } : s));
                                }}
                                className="w-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                              >
                                {GRADES.map(g => (
                                  <option key={g.value} value={g.value}>{g.label}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-span-1 flex justify-end sm:justify-center w-full sm:w-auto mt-2 sm:mt-0">
                              <button 
                                onClick={() => {
                                  const newCourses = semester.courses.filter(c => c.id !== course.id);
                                  setSemesters(semesters.map(s => s.id === semester.id ? { ...s, courses: newCourses } : s));
                                }}
                                className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button 
                          onClick={() => {
                            const newCourses = [...semester.courses, { id: Date.now().toString(), code: '', title: '', credit: 3, grade: 4.00 }];
                            setSemesters(semesters.map(s => s.id === semester.id ? { ...s, courses: newCourses } : s));
                          }}
                          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-focus p-2 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          <Plus size={16} /> Add Course
                        </button>

                        <button 
                          onClick={handleSaveSemester}
                          className="flex items-center gap-2 bg-primary hover:bg-primary-focus text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20"
                        >
                          <Save size={16} /> Save
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {semesters.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-gray-800 border-dashed">
            <div className="text-gray-400 mb-4">No semesters added yet.</div>
            <button 
              onClick={addSemester}
              className="bg-primary hover:bg-primary-focus text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
            >
              Add First Semester
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SemestersPage;
