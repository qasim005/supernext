import React from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon, SuperNextLogo } from '../icons/IconComponents';
import { UserRole } from '../../App';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onBack: () => void;
  setUserRole: (role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack, setUserRole }) => {
  const navigate = useNavigate();

  const [form, setForm] = React.useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = React.useState<'email' | 'otp' | 'reset'>('email');
  const [forgotPasswordData, setForgotPasswordData] = React.useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [forgotPasswordLoading, setForgotPasswordLoading] = React.useState(false);
  const [forgotPasswordError, setForgotPasswordError] = React.useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/auth/login', form);
      const { token, user } = res.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set user role based on response
      setUserRole(user.role);
      onLogin(user.role);
      
      // Navigate based on user role
      if (user.role === 'admin' || user.role === 'master-admin') {
        navigate('/supernext/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotPasswordData({ ...forgotPasswordData, [e.target.name]: e.target.value });
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
    setForgotPasswordLoading(true);

    try {
      if (forgotPasswordStep === 'email') {
        await axiosInstance.post('/api/auth/forgot-password', { email: forgotPasswordData.email });
        setForgotPasswordSuccess('OTP sent to your email address');
        setForgotPasswordStep('otp');
      } else if (forgotPasswordStep === 'otp') {
        await axiosInstance.post('/api/auth/verify-reset-otp', {
          email: forgotPasswordData.email,
          otp: forgotPasswordData.otp,
        });
        setForgotPasswordSuccess('OTP verified successfully');
        setForgotPasswordStep('reset');
      } else if (forgotPasswordStep === 'reset') {
        if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
          setForgotPasswordError('Passwords do not match');
          return;
        }
        await axiosInstance.post('/api/auth/reset-password', {
          email: forgotPasswordData.email,
          otp: forgotPasswordData.otp,
          newPassword: forgotPasswordData.newPassword,
          confirmPassword: forgotPasswordData.confirmPassword,
        });
        setForgotPasswordSuccess('Password reset successfully');
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotPasswordStep('email');
          setForgotPasswordData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
        }, 2000);
      }
    } catch (err: any) {
      setForgotPasswordError(err.response?.data?.message || 'An error occurred');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <SuperNextLogo className="h-10 w-8" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SuperNext Cloud</h1>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Portal Login</p>
        </div>
        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-login" className="sr-only">Email address</label>
            <input
              id="email-login"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password-login" className="sr-only">Password</label>
            <input
              id="password-login"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Password"
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-600 hover:underline dark:text-blue-500"
            >
              Forgot your password?
            </button>
          </div>
        </form>

        <div className="text-sm text-center font-light text-gray-500 dark:text-gray-400 pt-4">
          <p className="mb-2">
            Need an account?{' '}
            <button onClick={() => navigate('/signup')} className="font-medium text-blue-600 hover:underline dark:text-blue-500">
              Sign up
            </button>
          </p>
          <button onClick={onBack} className="font-medium text-gray-500 hover:underline dark:text-gray-400">
            &larr; Go Back to Website
          </button>
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {forgotPasswordStep === 'email' && 'Reset Password'}
                {forgotPasswordStep === 'otp' && 'Enter OTP'}
                {forgotPasswordStep === 'reset' && 'New Password'}
              </h2>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordStep('email');
                  setForgotPasswordData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
                  setForgotPasswordError('');
                  setForgotPasswordSuccess('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              {forgotPasswordStep === 'email' && (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Enter your email address and we'll send you an OTP to reset your password.
                  </p>
                  <input
                    type="email"
                    name="email"
                    value={forgotPasswordData.email}
                    onChange={handleForgotPasswordChange}
                    placeholder="Email address"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </>
              )}
              
              {forgotPasswordStep === 'otp' && (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Enter the 6-digit OTP sent to {forgotPasswordData.email}
                  </p>
                  <input
                    type="text"
                    name="otp"
                    value={forgotPasswordData.otp}
                    onChange={handleForgotPasswordChange}
                    placeholder="Enter OTP"
                    maxLength={6}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center text-lg"
                  />
                </>
              )}
              
              {forgotPasswordStep === 'reset' && (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Enter your new password
                  </p>
                  <input
                    type="password"
                    name="newPassword"
                    value={forgotPasswordData.newPassword}
                    onChange={handleForgotPasswordChange}
                    placeholder="New password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={forgotPasswordData.confirmPassword}
                    onChange={handleForgotPasswordChange}
                    placeholder="Confirm new password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </>
              )}
              
              {forgotPasswordError && (
                <div className="text-red-500 text-sm text-center">{forgotPasswordError}</div>
              )}
              {forgotPasswordSuccess && (
                <div className="text-green-500 text-sm text-center">{forgotPasswordSuccess}</div>
              )}
              
              <button
                type="submit"
                disabled={forgotPasswordLoading}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
              >
                {forgotPasswordLoading ? 'Processing...' : 
                 forgotPasswordStep === 'email' ? 'Send OTP' :
                 forgotPasswordStep === 'otp' ? 'Verify OTP' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
