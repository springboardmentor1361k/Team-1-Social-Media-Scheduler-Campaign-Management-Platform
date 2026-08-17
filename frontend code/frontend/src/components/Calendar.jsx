import React, { useState } from 'react';
import { IoChevronBack, IoChevronForward, IoLogoFacebook, IoLogoInstagram, IoLogoLinkedin, IoLogoTwitter, IoAdd, IoMegaphoneOutline } from 'react-icons/io5';

const PLATFORM_ICONS = {
  facebook: { icon: IoLogoFacebook, color: 'bg-blue-500 text-white' },
  instagram: { icon: IoLogoInstagram, color: 'bg-pink-500 text-white' },
  linkedin: { icon: IoLogoLinkedin, color: 'bg-blue-700 text-white' },
  twitter: { icon: IoLogoTwitter, color: 'bg-slate-900 dark:bg-slate-200 dark:text-dark-900 text-white' }
};

const Calendar = ({ posts = [], campaigns = [], onSelectDate, onSelectPost, onSelectCampaign }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper arrays for calendar generation
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Days in current month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Previous month days fill
  const prevMonthDays = new Date(year, month, 0).getDate();
  const fillPrevDays = Array.from({ length: firstDayOfMonth }, (_, i) => prevMonthDays - firstDayOfMonth + i + 1);

  // Current month days
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Total grid slots (usually 35 or 42 to make complete grid rows of 7)
  const totalGridSlots = 42;
  const fillNextDays = Array.from({ length: totalGridSlots - (fillPrevDays.length + currentMonthDays.length) }, (_, i) => i + 1);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Check if a day has posts
  const getPostsForDay = (dayNum, isCurrentMonth = true) => {
    if (!isCurrentMonth) return [];
    
    // Format to YYYY-MM-DD local style
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    
    return posts.filter(post => post.scheduledDate === dateString);
  };

  // Check if a day has campaigns starting on that day
  const getCampaignsForDay = (dayNum, isCurrentMonth = true) => {
    if (!isCurrentMonth) return [];
    
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    
    return campaigns.filter(campaign => campaign.startDate === dateString);
  };

  return (
    <div className="w-full bg-white dark:bg-dark-800 rounded-2xl border border-slate-100 dark:border-dark-700/50 shadow-premium overflow-hidden">
      {/* Calendar Header */}
      <div className="px-6 py-5 border-b border-slate-50 dark:border-dark-700/30 flex items-center justify-between bg-slate-50/50 dark:bg-dark-900/10">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
          {monthNames[month]} <span className="text-slate-400 dark:text-slate-500 font-semibold">{year}</span>
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-700/50 border border-slate-200 dark:border-dark-700/50 transition-all text-sm"
          >
            <IoChevronBack />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-700/50 border border-slate-200 dark:border-dark-700/50 transition-all"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-700/50 border border-slate-200 dark:border-dark-700/50 transition-all text-sm"
          >
            <IoChevronForward />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b border-slate-50 dark:border-dark-700/30 text-center py-2 bg-slate-50/20 dark:bg-dark-900/5">
        {dayNames.map(day => (
          <span key={day} className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-1.5 select-none">
            {day}
          </span>
        ))}
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-7 grid-rows-6 divide-x divide-y divide-slate-100 dark:divide-dark-700/30 border-t border-l border-slate-100 dark:border-dark-700/30">
        
        {/* Previous Month Days */}
        {fillPrevDays.map((day) => (
          <div
            key={`prev-${day}`}
            className="min-h-[100px] p-2 bg-slate-50/30 dark:bg-dark-900/10 text-slate-300 dark:text-slate-600 cursor-not-allowed select-none"
          >
            <span className="text-xs font-medium">{day}</span>
          </div>
        ))}

        {/* Current Month Days */}
        {currentMonthDays.map((day) => {
          const dayPosts = getPostsForDay(day);
          const dayCampaigns = getCampaignsForDay(day);
          
          // Format date for clicking/creation
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <div
              key={`curr-${day}`}
              className={`min-h-[105px] p-2 bg-white dark:bg-dark-800 transition-all duration-200 flex flex-col group relative ${
                isToday 
                  ? 'bg-primary-50/20 dark:bg-primary-950/10 calendar-day-active' 
                  : 'hover:bg-slate-50/50 dark:hover:bg-dark-900/20'
              }`}
            >
              {/* Day Label Header */}
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                  isToday 
                    ? 'bg-primary-500 text-white shadow-sm' 
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {day}
                </span>
                
                {/* Quick Add Schedule Post */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectDate) onSelectDate(dateStr);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded bg-primary-500 hover:bg-primary-600 text-white transition-opacity text-xs shadow-sm"
                  title="Schedule post on this day"
                >
                  <IoAdd />
                </button>
              </div>

              {/* Day Scheduled Posts & Campaigns */}
              <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[70px]">
                {dayCampaigns.map((camp) => (
                  <button
                    key={camp.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectCampaign) onSelectCampaign(camp);
                    }}
                    className="flex items-center gap-1 px-1 py-0.5 rounded text-[9px] font-bold text-primary-700 dark:text-primary-300 truncate text-left border border-primary-100 dark:border-primary-950/40 bg-primary-50/40 hover:bg-primary-100/50 dark:bg-primary-950/25 dark:hover:bg-primary-950/40 transition-colors w-full"
                    title={`Campaign: ${camp.name}`}
                  >
                    <span className="w-3.5 h-3.5 rounded bg-primary-500 text-white flex items-center justify-center flex-shrink-0 text-[8px]">
                      <IoMegaphoneOutline />
                    </span>
                    <span className="truncate flex-1">{camp.name}</span>
                  </button>
                ))}

                {dayPosts.map((post) => {
                  const platConfig = PLATFORM_ICONS[post.platform.toLowerCase()] || { icon: IoMegaphoneOutline, color: 'bg-slate-500' };
                  const Icon = platConfig.icon;
                  return (
                    <button
                      key={post.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectPost) onSelectPost(post);
                      }}
                      className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate text-left border border-slate-100 dark:border-dark-700/40 bg-slate-50 hover:bg-slate-100 dark:bg-dark-700/60 dark:hover:bg-dark-700 transition-colors w-full ${
                        post.status === 'failed' ? 'border-rose-200 dark:border-rose-950 bg-rose-50/20' : ''
                      }`}
                      title={post.content}
                    >
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 text-[8px] ${platConfig.color}`}>
                        <Icon />
                      </span>
                      <span className="truncate flex-1">{post.content}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Next Month Days */}
        {fillNextDays.map((day) => (
          <div
            key={`next-${day}`}
            className="min-h-[100px] p-2 bg-slate-50/30 dark:bg-dark-900/10 text-slate-300 dark:text-slate-600 cursor-not-allowed select-none"
          >
            <span className="text-xs font-medium">{day}</span>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Calendar;
