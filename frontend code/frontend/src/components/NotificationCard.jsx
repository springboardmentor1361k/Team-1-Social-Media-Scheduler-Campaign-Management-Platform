import React from 'react';
import { IoCheckmarkCircle, IoWarning, IoAlertCircle, IoInformationCircle, IoCheckmark, IoTrashOutline } from 'react-icons/io5';

const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete
}) => {
  const { id, title, message, timestamp, type, read } = notification;

  let Icon = IoInformationCircle;
  let iconBg = 'bg-blue-50 text-blue-500 dark:bg-blue-950/20 dark:text-blue-400';

  if (type === 'success') {
    Icon = IoCheckmarkCircle;
    iconBg = 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-400';
  } else if (type === 'warning') {
    Icon = IoWarning;
    iconBg = 'bg-amber-50 text-amber-500 dark:bg-amber-950/20 dark:text-amber-400';
  } else if (type === 'error') {
    Icon = IoAlertCircle;
    iconBg = 'bg-rose-50 text-rose-500 dark:bg-rose-950/20 dark:text-rose-400';
  }

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
        read 
          ? 'bg-white dark:bg-dark-800 border-slate-100 dark:border-dark-700/30' 
          : 'bg-slate-50/50 dark:bg-dark-800/40 border-primary-100 dark:border-primary-950/20 shadow-sm relative'
      }`}
    >
      {/* Unread indicator */}
      {!read && (
        <span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-primary-500"></span>
      )}

      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xl ${iconBg}`}>
        <Icon />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-semibold text-slate-800 dark:text-slate-100 ${!read ? 'pr-4' : ''}`}>
          {title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          {message}
        </p>
        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-2 block">
          {timestamp}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 self-center">
        {!read && onMarkAsRead && (
          <button
            onClick={() => onMarkAsRead(id)}
            className="p-2 rounded-xl text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-dark-700/50 transition-all text-base"
            title="Mark as read"
          >
            <IoCheckmark />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-dark-700/50 transition-all text-base"
            title="Delete notification"
          >
            <IoTrashOutline />
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
