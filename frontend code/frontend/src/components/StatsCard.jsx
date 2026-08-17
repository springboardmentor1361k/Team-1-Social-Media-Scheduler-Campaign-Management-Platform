import React from 'react';
import { IoTrendingUp, IoTrendingDown } from 'react-icons/io5';
import Card from './Card';

const StatsCard = ({
  title,
  value,
  change,
  trend = 'up',
  icon: Icon,
  className = ''
}) => {
  const isUp = trend === 'up';
  
  return (
    <Card className={`overflow-hidden relative ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {title}
          </span>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {value}
          </span>
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-500 dark:text-primary-400 flex items-center justify-center text-xl shadow-inner">
            <Icon />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold">
        {change && (
          <>
            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full ${
              isUp 
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
            }`}>
              {isUp ? <IoTrendingUp className="text-sm" /> : <IoTrendingDown className="text-sm" />}
              {change}
            </span>
            <span className="text-slate-400 dark:text-slate-500">
              vs last month
            </span>
          </>
        )}
      </div>
      
      {/* Sleek bottom gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400/40 via-primary-500/10 to-transparent"></div>
    </Card>
  );
};

export default StatsCard;
