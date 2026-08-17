import React from 'react';

const PageHeader = ({ title, description, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 select-none">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-sans">
          {title}
        </h1>
        {description && (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-3 flex-wrap">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
