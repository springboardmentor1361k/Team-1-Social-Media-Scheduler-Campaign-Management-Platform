import React, { createContext, useState, useCallback } from 'react';
import { IoCheckmarkCircle, IoWarning, IoAlertCircle, IoInformationCircle, IoClose } from 'react-icons/io5';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const triggerToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((msg, dur) => triggerToast(msg, 'success', dur), [triggerToast]);
  const error = useCallback((msg, dur) => triggerToast(msg, 'error', dur), [triggerToast]);
  const warning = useCallback((msg, dur) => triggerToast(msg, 'warning', dur), [triggerToast]);
  const info = useCallback((msg, dur) => triggerToast(msg, 'info', dur), [triggerToast]);

  return (
    <NotificationContext.Provider value={{ success, error, warning, info, removeToast }}>
      {children}

      {/* Self-rendering toast container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let bgColor = 'bg-white dark:bg-dark-800';
          let textColor = 'text-slate-800 dark:text-white';
          let iconColor = 'text-blue-500';
          let Icon = IoInformationCircle;
          let borderColor = 'border-blue-500/20';

          if (toast.type === 'success') {
            bgColor = 'bg-emerald-50 dark:bg-emerald-950/30';
            textColor = 'text-emerald-800 dark:text-emerald-200';
            iconColor = 'text-emerald-500';
            Icon = IoCheckmarkCircle;
            borderColor = 'border-emerald-500/20';
          } else if (toast.type === 'error') {
            bgColor = 'bg-rose-50 dark:bg-rose-950/30';
            textColor = 'text-rose-800 dark:text-rose-200';
            iconColor = 'text-rose-500';
            Icon = IoAlertCircle;
            borderColor = 'border-rose-500/20';
          } else if (toast.type === 'warning') {
            bgColor = 'bg-amber-50 dark:bg-amber-950/30';
            textColor = 'text-amber-800 dark:text-amber-200';
            iconColor = 'text-amber-500';
            Icon = IoWarning;
            borderColor = 'border-amber-500/20';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${borderColor} ${bgColor} ${textColor} shadow-premium animate-slide-in-right transform transition-all duration-300`}
              role="alert"
            >
              <div className={`mt-0.5 text-xl flex-shrink-0 ${iconColor}`}>
                <Icon />
              </div>
              <div className="flex-1 text-sm font-medium leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg p-0.5 rounded transition-colors"
                aria-label="Close alert"
              >
                <IoClose />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};
