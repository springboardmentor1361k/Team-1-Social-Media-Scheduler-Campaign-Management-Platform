import React, { useState, useEffect } from 'react';
import { IoNotificationsOutline, IoCheckmarkDoneOutline, IoTrashOutline } from 'react-icons/io5';

import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Card from '../components/Card';
import NotificationCard from '../components/NotificationCard';
import Loader from '../components/Loader';
import { useNotification } from '../hooks/useNotification';
import notificationService from '../services/notificationService';

const Notifications = () => {
  const { success, error: notifyError } = useNotification();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      notifyError("Failed to fetch notification list.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      success("Marked as read.");
    } catch (err) {
      notifyError("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      success("Notification deleted.");
    } catch (err) {
      notifyError("Failed to delete notification.");
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) {
      success("All notifications are already read.");
      return;
    }
    
    try {
      setLoading(true);
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      success("All notifications marked as read.");
    } catch (err) {
      notifyError("Failed to update all items.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setLoading(true);
      await notificationService.clearAll();
      setNotifications([]);
      success("Cleared all notifications.");
    } catch (err) {
      notifyError("Failed to clear items.");
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header with clear/mark buttons */}
      <PageHeader
        title="Notifications Log"
        description="Monitor system updates, task success logs, and warning details."
        action={
          notifications.length > 0 && (
            <div className="flex items-center gap-2 select-none">
              <Button
                variant="outline"
                size="sm"
                icon={IoCheckmarkDoneOutline}
                onClick={handleMarkAllRead}
              >
                Mark All Read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={IoTrashOutline}
                className="text-rose-500 hover:bg-rose-50"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            </div>
          )
        }
      />

      {/* Tabs list controls */}
      <Card className="p-4 flex items-center justify-between gap-4 select-none">
        <div className="flex gap-1">
          {[
            { label: 'All Logs', value: 'all' },
            { label: 'Unread Only', value: 'unread' },
            { label: 'Read Logs', value: 'read' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === tab.value
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-dark-900 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-dark-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Count details */}
        <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold hidden sm:inline">
          Showing {filteredNotifications.length} of {notifications.length} logs
        </span>
      </Card>

      {/* Notifications Render area */}
      {loading ? (
        <Loader />
      ) : filteredNotifications.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredNotifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center select-none bg-white dark:bg-dark-800 rounded-2xl border border-slate-100 dark:border-dark-700/50 shadow-premium flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-dark-900/50 flex items-center justify-center text-slate-400 text-2xl">
            <IoNotificationsOutline />
          </div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No notifications</h3>
          <p className="text-xs text-slate-400 max-w-xs">
            {filter === 'unread' 
              ? "You don't have any unread notifications currently." 
              : "Your notification logs log history is currently empty."
            }
          </p>
        </div>
      )}

    </div>
  );
};

export default Notifications;
