import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronDown, ChevronUp, Save, Edit3 } from 'lucide-react';
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

const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const SemestersPage = () => {
  const { semesters, setSemesters, user } = useStore();
  const [editingSemesters, setEditingSemesters] = useState({});

  const toggleSemester = (id) => {
    setSemesters(semesters.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s));
  };

  const addSemester = () => {
    const newId = Date.now().toString();
    const newSem = {
      id: newId,
      name: `${getOrdinal(semesters.length + 1)} Semester`,
      expanded: true,
      courses: [{ id: Date.now().toString(), code: '', title: '', credit: 3, grade: 4.00 }]
    };
    setSemesters([newSem, ...semesters]);
    setEditingSemesters(prev => ({ ...prev, [newId]: true }));
  };

  const calculateGPA = (courses) => {
    const totalCredits = courses.reduce((acc, curr) => acc + Number(curr.credit || 0), 0);
    if (totalCredits === 0) return 0;
    const totalPoints = courses.reduce((acc, curr) => acc + (Number(curr.credit || 0) * Number(curr.grade || 0)), 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  const handleSaveSemester = async (id, e) => {
    if (e) e.preventDefault();
    
    if (!user || !user.uid) {
      toast.error('You must be logged in to save data.');
      return;
    }

    const cleanSemesters = JSON.parse(JSON.stringify(semesters));
    const userRef = doc(db, 'users', user.uid);

    const savePromise = new Promise(async (resolve, reject) => {
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

    try {
      await savePromise;
      if (id) {
        setEditingSemesters(prev => ({ ...prev, [id]: false }));
      }
    } catch (e) {
      console.error(e);
    }
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
          {semesters.map((semester) => {
            const isEditing = editingSemesters[semester.id];

            return (
              <motion.div
                key={semester.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`bg-white dark:bg-card-dark rounded-2xl border ${isEditing ? 'border-primary shadow-md shadow-primary/10' : 'border-gray-200 dark:border-gray-800 shadow-sm'} overflow-hidden transition-all`}
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
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={semester.name}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const newName = e.target.value;
                            setSemesters(semesters.map(s => s.id === semester.id ? { ...s, name: newName } : s));
                          }}
                          className="text-lg font-bold bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 outline-none focus:border-primary transition-colors w-full"
                        />
                      ) : (
                        <h2 className="text-lg font-bold">{semester.name}</h2>
                      )}
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
                        if (confirm('Are you sure you want to delete this entire semester?')) {
                          setSemesters(semesters.filter(s => s.id !== semester.id));
                        }
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
                          <div className={isEditing ? 'col-span-4' : 'col-span-5'}>Course Title</div>
                          <div className="col-span-2 text-center">Credits</div>
                          <div className="col-span-2 text-center">Grade</div>
                          {isEditing && <div className="col-span-1"></div>}
                        </div>

                        <div className="space-y-2">
                          {semester.courses.map((course, idx) => (
                            <div key={course.id} className={`flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-center p-3 sm:px-4 sm:py-2 rounded-xl ${isEditing ? 'bg-gray-50 dark:bg-background-dark border border-gray-100 dark:border-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30 border border-transparent'}`}>
                              
                              <div className="col-span-3 w-full">
                                <label className="sm:hidden text-xs text-gray-500 mb-1 block">Course Code</label>
                                {isEditing ? (
                                  <input 
                                    type="text" placeholder="SWE 101" value={course.code}
                                    onChange={(e) => {
                                      const newCourses = [...semester.courses];
                                      newCourses[idx].code = e.target.value;
                                      setSemesters(semesters.map(s => s.id === semester.id ? { ...s, courses: newCourses } : s));
                                    }}
                                    className="w-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                                  />
                                ) : (
                                  <div className="font-semibold text-sm">{course.code || '-'}</div>
                                )}
                              </div>

                              <div className={`${isEditing ? 'col-span-4' : 'col-span-5'} w-full`}>
                                <label className="sm:hidden text-xs text-gray-500 mb-1 block">Course Title</label>
                                {isEditing ? (
                                  <input 
                                    type="text" placeholder="Introduction to Software Engineering" value={course.title}
                                    onChange={(e) => {
                                      const newCourses = [...semester.courses];
                                      newCourses[idx].title = e.target.value;
                                      setSemesters(semesters.map(s => s.id === semester.id ? { ...s, courses: newCourses } : s));
                                    }}
                                    className="w-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                                  />
                                ) : (
                                  <div className="text-gray-600 dark:text-gray-300 text-sm truncate">{course.title || 'Untitled Course'}</div>
                                )}
                              </div>

                              <div className="col-span-2 w-full flex gap-3 sm:block text-center">
                                <div className="flex-1 sm:w-full">
                                  <label className="sm:hidden text-xs text-gray-500 mb-1 block">Credits</label>
                                  {isEditing ? (
                                    <input 
                                      type="number" min="0" max="4" step="1" value={course.credit}
                                      onChange={(e) => {
                                        const newCourses = [...semester.courses];
                                        newCourses[idx].credit = e.target.value;
                                        setSemesters(semesters.map(s => s.id === semester.id ? { ...s, courses: newCourses } : s));
                                      }}
                                      className="w-full text-center bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                                    />
                                  ) : (
                                    <div className="font-medium text-sm">{course.credit} cr</div>
                                  )}
                                </div>
                                
                                {isEditing && (
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
                                )}
                              </div>

                              <div className="col-span-2 hidden sm:block w-full text-center">
                                {isEditing ? (
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
                                ) : (
                                  <div className="font-bold text-primary">{GRADES.find(g => g.value === course.grade)?.label.split(' ')[0] || '-'}</div>
                                )}
                              </div>

                              {isEditing && (
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
                              )}
                            </div>
                          ))}
                        </div>

                        {isEditing ? (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <button 
                              onClick={() => {
                                const newCourses = [...semester.courses, { id: Date.now().toString(), code: '', title: '', credit: 3, grade: 4.00 }];
                                setSemesters(semesters.map(s => s.id === semester.id ? { ...s, courses: newCourses } : s));
                              }}
                              className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary-focus p-2 rounded-lg hover:bg-primary/5 transition-colors w-full sm:w-auto"
                            >
                              <Plus size={16} /> Add Course
                            </button>

                            <button 
                              onClick={(e) => handleSaveSemester(semester.id, e)}
                              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-focus text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20 w-full sm:w-auto"
                            >
                              <Save size={16} /> Save & Close
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <button 
                              onClick={() => setEditingSemesters(prev => ({ ...prev, [semester.id]: true }))}
                              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                            >
                              <Edit3 size={16} /> Edit Semester
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {semesters.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-gray-800 border-dashed">
            <div className="text-gray-400 mb-4">No semesters added yet.</div>
            <button 
              onClick={addSemester}
              className="bg-primary hover:bg-primary-focus text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
            >
              Add 1st Semester
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SemestersPage;
