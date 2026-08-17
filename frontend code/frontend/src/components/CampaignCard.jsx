import React from 'react';
import { IoLogoFacebook, IoLogoInstagram, IoLogoLinkedin, IoLogoTwitter, IoPencilOutline, IoTrashOutline, IoCalendarOutline } from 'react-icons/io5';
import Card from './Card';
import Button from './Button';

const PLATFORM_ICONS = {
  facebook: { icon: IoLogoFacebook, color: 'text-[#1877F2] hover:bg-[#1877F2]/10' },
  instagram: { icon: IoLogoInstagram, color: 'text-[#E4405F] hover:bg-[#E4405F]/10' },
  linkedin: { icon: IoLogoLinkedin, color: 'text-[#0A66C2] hover:bg-[#0A66C2]/10' },
  twitter: { icon: IoLogoTwitter, color: 'text-slate-800 dark:text-slate-200 hover:bg-slate-500/10' }
};

const STATUS_BADGES = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
  paused: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
  completed: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
  draft: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-dark-700/50 dark:text-slate-400 dark:border-dark-600/40'
};

const CampaignCard = ({
  campaign,
  onEdit,
  onDelete
}) => {
  const { id, name, description, status, budget, spent, startDate, endDate, platforms = [], postsCount = 0 } = campaign;

  const budgetProgress = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  // Format Date strings
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-premium-hover transition-all duration-300">
      {/* Upper section */}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_BADGES[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(campaign)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-slate-50 dark:hover:bg-dark-700/30 transition-all text-base"
                title="Edit campaign"
              >
                <IoPencilOutline />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-dark-700/30 transition-all text-base"
                title="Delete campaign"
              >
                <IoTrashOutline />
              </button>
            )}
          </div>
        </div>

        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-3 leading-snug line-clamp-1">
          {name}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2 min-h-[32px]">
          {description}
        </p>

        {/* Platforms */}
        <div className="flex items-center gap-1.5 mt-4">
          {platforms.map((plat) => {
            const platInfo = PLATFORM_ICONS[plat.toLowerCase()];
            if (!platInfo) return null;
            const Icon = platInfo.icon;
            return (
              <span
                key={plat}
                className={`w-7 h-7 rounded-lg flex items-center justify-center border border-slate-100 dark:border-dark-700/50 text-sm ${platInfo.color}`}
                title={plat}
              >
                <Icon />
              </span>
            );
          })}
          {platforms.length === 0 && (
            <span className="text-[10px] text-slate-400">No platforms connected</span>
          )}
        </div>
      </div>

      {/* Stats Divider */}
      <hr className="my-4.5 border-slate-50 dark:border-dark-700/30" />

      {/* Progress & Lower Section */}
      <div>
        <div className="flex justify-between text-xs font-semibold mb-1">
          <span className="text-slate-400 dark:text-slate-500">Budget Progress</span>
          <span className="text-slate-700 dark:text-slate-300">
            ${spent.toLocaleString()} / <span className="text-slate-400 dark:text-slate-500">${budget.toLocaleString()}</span>
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-dark-700 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === 'active' ? 'bg-primary-500' : 'bg-slate-400'
            }`}
            style={{ width: `${budgetProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mt-4 font-medium">
          <span className="flex items-center gap-1">
            <IoCalendarOutline />
            {formatDate(startDate)} - {formatDate(endDate)}
          </span>
          <span className="font-bold text-slate-600 dark:text-slate-300">
            {postsCount} {postsCount === 1 ? 'post' : 'posts'}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default CampaignCard;
