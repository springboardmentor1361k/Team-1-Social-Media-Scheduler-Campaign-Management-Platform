import React from 'react';

const Card = ({
  children,
  className = '',
  onClick,
  title,
  subtitle,
  headerActions,
  hoverable = false,
  ...props
}) => {
  const isInteractive = typeof onClick === 'function';

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-dark-800 
        border border-slate-100 dark:border-dark-700/50 
        rounded-2xl shadow-premium
        transition-all duration-300
        ${hoverable || isInteractive ? 'hover:shadow-premium-hover hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || headerActions) && (
        <div className="px-6 py-5 border-b border-slate-50 dark:border-dark-700/30 flex items-center justify-between gap-4 flex-wrap">
          <div>
            {title && (
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
