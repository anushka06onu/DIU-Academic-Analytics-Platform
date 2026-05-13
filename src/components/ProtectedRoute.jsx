import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const AuthProvider = ({ children }) => {
  const { setUser, setSemesters } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.semesters) {
              setSemesters(data.semesters);
            }
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setSemesters]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
};

const ProtectedRoute = ({ children }) => {
  const { user } = useStore();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
