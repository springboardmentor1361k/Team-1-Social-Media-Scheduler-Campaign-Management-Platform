import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  IoGridOutline, 
  IoMegaphoneOutline, 
  IoCalendarClearOutline, 
  IoBarChartOutline, 
  IoNotificationsOutline, 
  IoSettingsOutline, 
  IoPersonOutline, 
  IoLogOutOutline,
  IoCloseOutline,
  IoPeopleOutline,
  IoDocumentTextOutline
} from 'react-icons/io5';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: IoGridOutline },
    { name: 'Social Accounts', path: '/social-accounts', icon: IoPeopleOutline },
    { name: 'Campaigns', path: '/campaigns', icon: IoMegaphoneOutline },
    { name: 'Scheduler', path: '/scheduler', icon: IoCalendarClearOutline },
    { name: 'Analytics', path: '/analytics', icon: IoBarChartOutline },
    { name: 'Reports', path: '/reports', icon: IoDocumentTextOutline },
    { name: 'Notifications', path: '/notifications', icon: IoNotificationsOutline },
    { name: 'Settings', path: '/settings', icon: IoSettingsOutline },
    { name: 'Profile', path: '/profile', icon: IoPersonOutline },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) => `
    flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 select-none
    ${isActive 
      ? 'bg-primary-500 text-white shadow-premium shadow-primary-500/20' 
      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-dark-800/60'
    }
  `;

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Box */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-dark-800 border-r border-slate-100 dark:border-dark-700/50
          transition-transform duration-300 transform lg:translate-x-0 flex flex-col justify-between
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Upper Sidebar branding */}
        <div>
          <div className="h-16 px-6 border-b border-slate-50 dark:border-dark-700/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-primary-500/20">
                S
              </div>
              <span className="font-extrabold text-lg text-slate-800 dark:text-slate-100 tracking-tight font-sans">
                Social<span className="text-primary-500">Pilot</span>
              </span>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-dark-700/30 transition-all text-xl"
            >
              <IoCloseOutline />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1.5 mt-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={navLinkClass}
              >
                <item.icon className="text-lg flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Lower Sidebar Profile & Logout */}
        <div className="p-4 border-t border-slate-50 dark:border-dark-700/30">
          <div className="flex items-center gap-3 p-2 mb-3 bg-slate-50/50 dark:bg-dark-900/20 rounded-xl border border-slate-100/50 dark:border-dark-700/25">
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80"} 
              alt={user?.name || "User Avatar"} 
              className="w-9 h-9 rounded-full object-cover shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate leading-none">
                {user?.name || "Jane Doe"}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-1">
                {user?.email || "jane@example.com"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200"
          >
            <IoLogOutOutline className="text-lg flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
