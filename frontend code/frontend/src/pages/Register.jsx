import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline, IoCallOutline, IoBusinessOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

const Register = () => {
  const { register } = useAuth();
  const { success, error: notifyError } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required.';
    
    if (!formData.email) {
      tempErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Invalid email address format.';
    }
    
    if (!formData.phone.trim()) tempErrors.phone = 'Phone number is required.';
    if (!formData.companyName.trim()) tempErrors.companyName = 'Company name is required.';
    
    if (!formData.password) {
      tempErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
    }
    
    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone,
        formData.companyName
      );
      success("Account created successfully! Welcome to SocialPilot.");
      navigate('/dashboard');
    } catch (err) {
      notifyError(err.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 grid-bg flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-lg select-none animate-slide-up py-8">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center text-white text-2xl font-extrabold mx-auto shadow-lg shadow-primary-500/20 mb-3">
            S
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-sans">
            Get Started with Social<span className="text-primary-500">Pilot</span>
          </h2>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-2">
            Create an account to schedule posts, manage campaigns, and track metrics
          </p>
        </div>

        {/* Register form card */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="name"
                name="name"
                type="text"
                label="Full Name"
                placeholder="Jane Doe"
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
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                icon={IoMailOutline}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="phone"
                name="phone"
                type="tel"
                label="Phone Number"
                placeholder="+1 (555) 019-2834"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                icon={IoCallOutline}
                required
              />

              <Input
                id="companyName"
                name="companyName"
                type="text"
                label="Company Name"
                placeholder="SocialPilot Corp"
                value={formData.companyName}
                onChange={handleInputChange}
                error={errors.companyName}
                icon={IoBusinessOutline}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  icon={IoLockClosedOutline}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-[38px] text-slate-400 dark:text-slate-500 text-lg hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>

              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                icon={IoLockClosedOutline}
                required
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 select-none mt-1">
              <input
                type="checkbox"
                required
                className="rounded border-slate-200 dark:border-dark-700/60 text-primary-500 focus:ring-primary-500 w-4 h-4 mt-0.5"
              />
              <span>
                I agree to the{' '}
                <a href="#terms" className="text-primary-500 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#privacy" className="text-primary-500 hover:underline">Privacy Policy</a>.
              </span>
            </div>

            {/* Form Submit Button */}
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full py-3.5 mt-3 shadow-glow-primary hover:shadow-glow-primary-hover"
            >
              Create Account
            </Button>
          </form>
        </Card>

        {/* Footnote Link */}
        <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-500 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary-500 hover:text-primary-600 font-bold transition-colors hover:underline"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
