import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

const Login = () => {
  const { login } = useAuth();
  const { success, error: notifyError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Get path to redirect back to or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Invalid email address format.';
    }
    
    if (!password) {
      tempErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      success("Logged in successfully! Welcome back.");
      navigate(from, { replace: true });
    } catch (err) {
      notifyError(err.message || "Failed to log in. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 grid-bg flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md select-none animate-slide-up">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center text-white text-2xl font-extrabold mx-auto shadow-lg shadow-primary-500/20 mb-3">
            S
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-sans">
            Welcome to Social<span className="text-primary-500">Pilot</span>
          </h2>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-2">
            Schedule posts and run analytics across social channels
          </p>
        </div>

        {/* Login form card */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={IoMailOutline}
              required
            />

            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* Remember & Forgot Password Link */}
            <div className="flex items-center justify-between text-xs font-semibold select-none mt-1">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-200 dark:border-dark-700/60 text-primary-500 focus:ring-primary-500 w-4 h-4"
                />
                Remember Me
              </label>
              
              <Link 
                to="/login" // For mock simulation, redirects back to login page
                onClick={() => success("Mock password reset email sent to your inbox!")}
                className="text-primary-500 hover:text-primary-600 transition-colors hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Form Submit Button */}
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full py-3.5 mt-2 shadow-glow-primary hover:shadow-glow-primary-hover"
            >
              Sign In
            </Button>
          </form>
        </Card>

        {/* Footnote Link */}
        <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-primary-500 hover:text-primary-600 font-bold transition-colors hover:underline"
          >
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
