import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Sleek dual spinning rings */}
        <div className="absolute inset-0 rounded-full border-4 border-primary-500/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 animate-spin"></div>
        {/* Pulsing center dot */}
        <div className="w-4 h-4 rounded-full bg-primary-500 animate-pulse"></div>
      </div>
      <p className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase animate-pulse">
        Loading SocialPilot...
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-50/80 dark:bg-dark-900/90 backdrop-blur-sm flex items-center justify-center w-full h-full">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10 w-full h-full min-h-[200px]">
      {spinner}
    </div>
  );
};

export default Loader;
