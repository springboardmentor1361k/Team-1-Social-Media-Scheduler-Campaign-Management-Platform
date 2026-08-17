import { useEffect, useState } from 'react';
// import React, { useState } from 'react';
import { IoPersonOutline, IoMailOutline, IoCallOutline, IoBusinessOutline, IoCameraOutline } from 'react-icons/io5';

import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { success, error: notifyError } = useNotification();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    companyName: user?.companyName || '',
    avatar: user?.avatar || ''
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        companyName: user.companyName || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Mock Avatar edit handler (cycles through high quality Unsplash face photos)
  const handleAvatarCycle = () => {
    const faces = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250"
    ];
    const currentIndex = faces.indexOf(formData.avatar);
    const nextIndex = (currentIndex + 1) % faces.length;
    setFormData(prev => ({ ...prev, avatar: faces[nextIndex] }));
    success("Mock profile picture updated!");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
        success("Custom profile picture uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required.';

    if (!formData.email) {
      tempErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Invalid email address format.';
    }

    if (!formData.phone.trim()) tempErrors.phone = 'Phone number is required.';
    if (!formData.companyName.trim()) tempErrors.companyName = 'Company name is required.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      await updateProfile(formData);
      success("Profile details updated successfully!");
    } catch (err) {
      notifyError("Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 select-none animate-fade-in">
      <PageHeader
        title="My Profile"
        description="Verify or modify your personal credentials, contact points, and branding details."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left Side: Avatar Display Details */}
        <Card className="lg:col-span-1 p-6 flex flex-col items-center text-center">

          {/* Avatar Edit Wrapper */}
          <div className="relative">
            <div className="relative group cursor-pointer" onClick={handleAvatarCycle}>
              <img
                src={formData.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=250"}
                alt={formData.name || "User profile avatar"}
                className="w-28 h-28 rounded-full object-cover shadow-premium ring-4 ring-slate-100 dark:ring-dark-700/40 group-hover:opacity-85 transition-opacity"
              />
              {/* Camera Overlay Icon */}
              <div className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xl">
                <IoCameraOutline />
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            {/* Floating Edit Button */}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-dark-800 cursor-pointer hover:scale-105 transition-all text-sm z-10"
              title="Upload custom profile picture"
              onClick={(e) => e.stopPropagation()}
            >
              <IoCameraOutline />
            </label>
          </div>

          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-4 leading-none">
            {formData.name || "Jane Doe"}
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1.5 uppercase tracking-wider">
            Workspace Administrator
          </p>

          <hr className="my-5 w-full border-slate-50 dark:border-dark-700/25" />

          {/* Quick Info Grid */}
          <div className="w-full flex flex-col gap-3.5 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-slate-400 dark:text-slate-500 font-semibold">User ID</span>
              <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">usr_100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 dark:text-slate-500 font-semibold">Access Level</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">Admin</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 dark:text-slate-500 font-semibold">Status</span>
              <span className="font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">Active</span>
            </div>
          </div>

        </Card>

        {/* Right Side: Credentials editing form */}
        <Card
          title="Account Details"
          subtitle="Configure personal contact fields and company profiles"
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="name"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                icon={IoPersonOutline}
                required
              />

              <Input
                id="email"
                name="email"
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                icon={IoMailOutline}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="phone"
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                icon={IoCallOutline}
                required
              />

              <Input
                id="companyName"
                name="companyName"
                label="Company Name"
                value={formData.companyName}
                onChange={handleInputChange}
                error={errors.companyName}
                icon={IoBusinessOutline}
                required
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
              >
                Save Details
              </Button>
            </div>

          </form>
        </Card>

      </div>

    </div>
  );
};

export default Profile;
