import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 transition-colors duration-200 flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col transition-all duration-300">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Content Route Viewport */}
        <main className="flex-1 p-5 md:p-8 animate-fade-in">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
