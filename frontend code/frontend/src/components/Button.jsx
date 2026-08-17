import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon = null,
  ...props
}) => {
  // Styles for states
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-premium hover:shadow-premium-hover border border-transparent',
    secondary: 'bg-white hover:bg-slate-50 dark:bg-dark-800 dark:hover:bg-dark-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-dark-700 shadow-sm',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-premium border border-transparent',
    outline: 'bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/20',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-600 dark:text-slate-400 border border-transparent'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4.5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className="text-lg" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
