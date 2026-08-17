import React from 'react';
import { Link } from 'react-router-dom';
import { IoAlertCircleOutline } from 'react-icons/io5';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 grid-bg flex flex-col items-center justify-center p-4 text-center select-none">
      <div className="max-w-md w-full animate-slide-up flex flex-col items-center gap-4">
        
        {/* Glow Error Icon */}
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center text-4xl shadow-glow-primary hover:scale-105 transition-all">
          <IoAlertCircleOutline />
        </div>

        <h1 className="text-6xl font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tighter mt-4 leading-none">
          404
        </h1>
        
        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mt-2">
          Page Not Found
        </h2>
        
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 max-w-xs mt-1 leading-relaxed">
          The page you are looking for does not exist or has been relocated to another workspace address.
        </p>

        {/* Action button redirecting back to home dashboard */}
        <Link to="/" className="mt-6 w-full sm:w-auto">
          <Button variant="primary" className="w-full shadow-glow-primary">
            Back to Dashboard
          </Button>
        </Link>

      </div>
    </div>
  );
};

export default NotFound;
