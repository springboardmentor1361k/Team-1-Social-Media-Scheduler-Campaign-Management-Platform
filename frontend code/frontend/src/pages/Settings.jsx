import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IoSettingsOutline, 
  IoShieldCheckmarkOutline, 
  IoNotificationsOutline, 
  IoColorPaletteOutline,
  IoLogOutOutline,
  IoLockClosedOutline
} from 'react-icons/io5';

import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useNotification } from '../hooks/useNotification';
import userService from '../services/userService';

const Settings = () => {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { success, error: notifyError } = useNotification();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'security' | 'notifications'

  // Security Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Preference details
  const [language, setLanguage] = useState('en');
  const [notifPrefs, setNotifPrefs] = useState({
    emailSuccess: true,
    emailError: true,
    weeklyReport: false,
    desktopAlerts: true
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTogglePreference = (key) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required.';
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters.';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsSavingPassword(true);
    setPasswordErrors({});
    try {
      await userService.updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      success("Password changed successfully!");
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Failed to update password.";
      notifyError(errMsg);
      if (errMsg.toLowerCase().includes("current password")) {
        setPasswordErrors({ currentPassword: errMsg });
      }
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleSaveGeneral = () => {
    success("General preferences updated successfully.");
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col gap-6 select-none animate-fade-in">
      <PageHeader
        title="Settings"
        description="Configure language choices, system alerts, password safety, and workspace parameters."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Navigation Sidebar Panel */}
        <Card className="p-3 md:col-span-1">
          <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {[
              { id: 'general', label: 'General Settings', icon: IoSettingsOutline },
              { id: 'security', label: 'Security & Safety', icon: IoShieldCheckmarkOutline },
              { id: 'notifications', label: 'Alert Preferences', icon: IoNotificationsOutline }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap md:w-full ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-premium shadow-primary-500/10'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-900/40 hover:text-slate-800'
                }`}
              >
                <tab.icon className="text-base" />
                <span>{tab.label}</span>
              </button>
            ))}
            
            <hr className="hidden md:block my-2 border-slate-50 dark:border-dark-700/30" />
            
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left transition-all"
            >
              <IoLogOutOutline className="text-base" />
              Logout Session
            </button>
          </div>
        </Card>

        {/* Action Panel Content */}
        <div className="md:col-span-3">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <Card title="General Preferences" subtitle="Manage theme layouts and language parameters">
              <div className="flex flex-col gap-6 mt-2">
                
                {/* Visual Theme */}
                <div className="flex items-center justify-between border-b border-slate-50 dark:border-dark-700/20 pb-4">
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <IoColorPaletteOutline /> Dark Theme Palette
                    </h5>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                      Render application UI colors in sleek dark layout modes
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      isDark ? 'bg-primary-500' : 'bg-slate-200 dark:bg-dark-900'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isDark ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* App Language */}
                <div className="flex items-center justify-between border-b border-slate-50 dark:border-dark-700/20 pb-4">
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200">System Language</h5>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                      Select localized wording labels for page modules
                    </p>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs font-bold focus:outline-none focus:border-primary-500 text-slate-700 dark:text-slate-200"
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Español (ES)</option>
                    <option value="fr">Français (FR)</option>
                    <option value="de">Deutsch (DE)</option>
                  </select>
                </div>

                <div className="flex justify-end mt-2">
                  <Button variant="primary" size="sm" onClick={handleSaveGeneral}>
                    Save Preferences
                  </Button>
                </div>

              </div>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card title="Change Password" subtitle="Input passwords to secure your campaign logs">
              <form onSubmit={handleSubmitPassword} className="flex flex-col gap-4 mt-2">
                
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  label="Current Password"
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.currentPassword}
                  icon={IoLockClosedOutline}
                  required
                />

                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  label="New Password"
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.newPassword}
                  icon={IoLockClosedOutline}
                  required
                />

                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm New Password"
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.confirmPassword}
                  icon={IoLockClosedOutline}
                  required
                />

                <div className="flex justify-end mt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSavingPassword}
                  >
                    Update Password
                  </Button>
                </div>

              </form>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card title="Alert Preferences" subtitle="Toggle which email and notification channels you subscribe to">
              <div className="flex flex-col gap-4.5 mt-2">
                {[
                  { key: 'emailSuccess', title: 'Post Success Updates', desc: 'Receive automated notification emails when scheduled posts publish successfully.' },
                  { key: 'emailError', title: 'Post Fail Alerts', desc: 'Get immediate notifications if social updates fail to upload media or write api records.' },
                  { key: 'weeklyReport', title: 'Weekly Engagement Logs', desc: 'Send summaries of weekly engagement growth charts to workspace inbox.' },
                  { key: 'desktopAlerts', title: 'Desktop Push Alerts', desc: 'Allow browser notifications triggers on success updates.' }
                ].map((pref) => (
                  <div key={pref.key} className="flex items-start justify-between border-b border-slate-50 dark:border-dark-700/20 pb-4 last:border-0 last:pb-0">
                    <div className="max-w-xl">
                      <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200">{pref.title}</h5>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">{pref.desc}</p>
                    </div>
                    <button
                      onClick={() => handleTogglePreference(pref.key)}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 ${
                        notifPrefs[pref.key] ? 'bg-primary-500' : 'bg-slate-200 dark:bg-dark-900'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          notifPrefs[pref.key] ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}

                <div className="flex justify-end mt-4">
                  <Button variant="primary" size="sm" onClick={() => success("Alert notifications preferences updated successfully.")}>
                    Save Subscriptions
                  </Button>
                </div>
              </div>
            </Card>
          )}

        </div>

      </div>

    </div>
  );
};

export default Settings;
