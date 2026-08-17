import React, { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-lg'
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div 
        className={`bg-white dark:bg-dark-800 rounded-2xl shadow-premium border border-slate-100 dark:border-dark-700/50 w-full ${maxWidth} z-10 overflow-hidden transform transition-all animate-slide-up flex flex-col max-h-[90vh]`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-50 dark:border-dark-700/30 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-dark-700/30 transition-all text-xl"
            aria-label="Close modal"
          >
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-slate-600 dark:text-slate-300">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4.5 border-t border-slate-50 dark:border-dark-700/30 bg-slate-50/50 dark:bg-dark-900/10 flex items-center justify-end gap-3 flex-wrap">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
