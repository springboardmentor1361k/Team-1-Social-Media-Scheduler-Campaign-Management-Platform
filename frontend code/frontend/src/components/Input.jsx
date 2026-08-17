import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  id,
  name,
  type = 'text',
  placeholder = '',
  disabled = false,
  value,
  onChange,
  className = '',
  icon: Icon = null,
  ...props
}) => {
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 select-none tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 text-lg">
            <Icon />
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={`${error ? errorId : ''} ${helperText ? helperId : ''}`}
          className={`
            w-full rounded-xl text-sm font-medium
            border transition-all duration-200 custom-input
            disabled:bg-slate-50 dark:disabled:bg-dark-900/50 disabled:text-slate-400
            bg-white dark:bg-dark-900/40 text-slate-800 dark:text-slate-100
            ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3
            ${error 
              ? 'border-rose-400 dark:border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/10' 
              : 'border-slate-200 dark:border-dark-700/60 focus:border-primary-500 focus:ring-primary-500/15'
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <p
          id={errorId}
          className="text-xs text-rose-500 font-medium select-none animate-fade-in"
        >
          {error}
        </p>
      )}
      {!error && helperText && (
        <p
          id={helperId}
          className="text-xs text-slate-400 dark:text-slate-500 select-none"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
