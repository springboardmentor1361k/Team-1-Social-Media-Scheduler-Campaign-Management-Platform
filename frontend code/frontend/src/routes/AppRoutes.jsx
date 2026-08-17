import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Campaigns from '../pages/Campaigns';
import Scheduler from '../pages/Scheduler';
import Analytics from '../pages/Analytics';
import Notifications from '../pages/Notifications';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import SocialAccounts from '../pages/SocialAccounts';
import Reports from '../pages/Reports';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard Layout Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="social-accounts" element={<SocialAccounts />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="scheduler" element={<Scheduler />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reports" element={<Reports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
