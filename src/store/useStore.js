import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // Theme State
      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      // User & Auth State
      user: null,
      setUser: (user) => set({ user }),

      // App Data State
      semesters: [],
      setSemesters: (semesters) => set({ semesters }),
      degreeCredits: 138,
      setDegreeCredits: (degreeCredits) => set({ degreeCredits }),
      targetCgpa: 3.80,
      setTargetCgpa: (targetCgpa) => set({ targetCgpa }),
      addSemester: (semester) => set((state) => ({ semesters: [semester, ...state.semesters] })),
      updateSemester: (id, updated) => set((state) => ({
        semesters: state.semesters.map(s => s.id === id ? { ...s, ...updated } : s)
      })),
      removeSemester: (id) => set((state) => ({
        semesters: state.semesters.filter(s => s.id !== id)
      })),

      // UI State
      isCommandPaletteOpen: false,
      setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
    }),
    {
      name: 'diu-academic-analytics-storage',
      partialize: (state) => ({ theme: state.theme }), // Only persist theme locally, data syncs with Firebase
    }
  )
);

export default useStore;
