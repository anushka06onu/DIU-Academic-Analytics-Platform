import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import useStore from '../store/useStore';

const MainLayout = () => {
  const { setCommandPaletteOpen } = useStore();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-gray-100 selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-1 flex flex-col pt-24 pb-8">
        <div className="flex-1 px-4 md:px-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
