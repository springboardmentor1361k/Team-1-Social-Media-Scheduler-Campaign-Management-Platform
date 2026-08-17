import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMenuOutline, IoSearchOutline, IoNotificationsOutline, IoSunnyOutline, IoMoonOutline, IoPersonOutline, IoSettingsOutline, IoLogOutOutline, IoCalendarOutline, IoMegaphoneOutline } from 'react-icons/io5';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import notificationService from '../services/notificationService';
import searchService from '../services/searchService';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch unread notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications();
        if (Array.isArray(data)) {
          const unread = data.filter(n => !n.read);
          setUnreadCount(unread.length);
          setRecentNotifications(data.slice(0, 4));
        } else {
          setUnreadCount(0);
          setRecentNotifications([]);
        }
        // const unread = data.filter(n => !n.read);
        // setUnreadCount(unread.length);
        // setRecentNotifications(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to load notifications for navbar:", err);
      }
    };
    fetchNotifications();

    // Poll notifications every 30 seconds for real-time updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global search debounce and API call
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      setShowSearchResults(false);
      return;
    }

    setShowSearchResults(true);
    setIsSearching(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const results = await searchService.search(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error("Failed to query global search:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/campaigns?search=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markNotificationRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setRecentNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 dark:border-dark-700/50 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md px-6 select-none transition-colors duration-200">

      {/* Left side navbar hamburger and search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-700/50 transition-all text-2xl"
          aria-label="Toggle sidebar menu"
        >
          <IoMenuOutline />
        </button>

        <div className="hidden sm:block w-full max-w-xs relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full relative">
            <IoSearchOutline className="absolute left-3.5 text-slate-400 dark:text-slate-500 text-lg pointer-events-none" />
            <input
              type="text"
              placeholder="Search campaigns, schedules, alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) {
                  setShowSearchResults(true);
                }
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-dark-900/30 border border-slate-100 dark:border-dark-700/50 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-dark-900/60 transition-all text-slate-700 dark:text-slate-200"
            />
          </form>

          {showSearchResults && (
            <div className="absolute left-0 right-0 mt-2 bg-white/95 dark:bg-dark-800/95 backdrop-blur-md border border-slate-100 dark:border-dark-700/50 rounded-2xl shadow-premium-hover overflow-hidden animate-slide-up z-50 max-h-[420px] overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-8 gap-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></span>
                </div>
              ) : (
                <div className="p-3 flex flex-col gap-4">
                  {/* Campaigns Section */}
                  {searchResults?.campaigns?.length > 0 && (
                    <div>
                      <div className="px-3.5 pb-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 flex justify-between">
                        <span>Campaigns</span>
                        <span className="bg-slate-50 dark:bg-dark-900 px-1.5 py-0.5 rounded text-[9px]">{searchResults.campaigns.length}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {searchResults.campaigns.map(camp => (
                          <button
                            key={camp.id}
                            onClick={() => {
                              setShowSearchResults(false);
                              navigate(`/campaigns?search=${encodeURIComponent(camp.name)}`);
                            }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-dark-900/40 transition-colors"
                          >
                            <IoMegaphoneOutline className="text-base text-primary-500 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate leading-tight">{camp.name}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none mt-1">{camp.objective || camp.platform}</p>
                            </div>
                            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded capitalize">{camp.status}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Schedules Section */}
                  {searchResults?.schedules?.length > 0 && (
                    <div>
                      <div className="px-3.5 pb-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 flex justify-between">
                        <span>Schedules</span>
                        <span className="bg-slate-50 dark:bg-dark-900 px-1.5 py-0.5 rounded text-[9px]">{searchResults.schedules.length}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {searchResults.schedules.map(sched => (
                          <button
                            key={sched.id}
                            onClick={() => {
                              setShowSearchResults(false);
                              navigate(`/scheduler`);
                            }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-dark-900/40 transition-colors"
                          >
                            <IoCalendarOutline className="text-base text-amber-500 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate leading-tight">{sched.content}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none mt-1">{sched.platform} • {sched.scheduled_time?.split('T')[0]}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notifications Section */}
                  {searchResults?.notifications?.length > 0 && (
                    <div>
                      <div className="px-3.5 pb-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 flex justify-between">
                        <span>Notifications</span>
                        <span className="bg-slate-50 dark:bg-dark-900 px-1.5 py-0.5 rounded text-[9px]">{searchResults.notifications.length}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {searchResults.notifications.map(notif => (
                          <button
                            key={notif.id}
                            onClick={() => {
                              setShowSearchResults(false);
                              navigate(`/notifications`);
                            }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-dark-900/40 transition-colors"
                          >
                            <IoNotificationsOutline className="text-base text-rose-500 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate leading-tight">{notif.title}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none mt-1">{notif.message}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!searchResults || (searchResults.campaigns?.length === 0 && searchResults.schedules?.length === 0 && searchResults.notifications?.length === 0)) && (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side navbar actions */}
      <div className="flex items-center gap-3">

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-dark-700/50 transition-all text-lg border border-transparent"
          aria-label="Toggle visual theme"
        >
          {isDark ? <IoSunnyOutline /> : <IoMoonOutline />}
        </button>

        {/* Notifications Popover Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-dark-700/50 transition-all text-lg relative"
            aria-label="View alerts"
          >
            <IoNotificationsOutline />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border border-white dark:border-dark-800">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-dark-800 border border-slate-100 dark:border-dark-700/50 rounded-2xl shadow-premium-hover overflow-hidden animate-slide-up z-50">
              <div className="px-5 py-4 border-b border-slate-50 dark:border-dark-700/30 bg-slate-50/50 dark:bg-dark-900/10 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Notifications</span>
                <Link to="/notifications" onClick={() => setShowNotifications(false)} className="text-[10px] font-semibold text-primary-500 hover:underline">
                  View all
                </Link>
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-50 dark:divide-dark-700/20">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                      }}
                      className={`p-4 flex gap-3 hover:bg-slate-50 dark:hover:bg-dark-900/20 cursor-pointer transition-colors ${!notif.read ? 'bg-primary-50/10 dark:bg-primary-950/5' : ''}`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.read ? 'bg-transparent' : 'bg-primary-500'}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate leading-snug">
                          {notif.title}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 leading-snug">
                          {notif.message}
                        </p>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 block">
                          {notif.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No new notifications.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vertical line separator */}
        <span className="h-6 w-px bg-slate-100 dark:bg-dark-700/50"></span>

        {/* Profile Avatar Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-700/50 transition-all select-none"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80"}
              alt={user?.name || "Avatar"}
              className="w-8 h-8 rounded-lg object-cover shadow-sm ring-1 ring-slate-100 dark:ring-dark-700/20"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-dark-800 border border-slate-100 dark:border-dark-700/50 rounded-2xl shadow-premium-hover overflow-hidden animate-slide-up z-50">
              <div className="p-4 border-b border-slate-50 dark:border-dark-700/30">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">
                  {user?.name || "Jane Doe"}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-1">
                  {user?.email || "jane@example.com"}
                </p>
              </div>
              <div className="p-1.5 flex flex-col">
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-900/30 transition-all"
                >
                  <IoPersonOutline className="text-base text-slate-400" />
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-900/30 transition-all"
                >
                  <IoSettingsOutline className="text-base text-slate-400" />
                  Settings
                </Link>
                <hr className="my-1.5 border-slate-50 dark:border-dark-700/30 mx-2" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left transition-all"
                >
                  <IoLogOutOutline className="text-base" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
