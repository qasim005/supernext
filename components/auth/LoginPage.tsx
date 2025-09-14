import React, { useState } from 'react';
import { GoogleIcon, SuperNextLogo } from '../icons/IconComponents';
import { UserRole } from '../../App';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle login/signup logic here.
    // For this demo, we'll just log in as a client.
    onLogin('client');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <SuperNextLogo className="h-10 w-8" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SuperNext Cloud</h1>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isSignup ? 'Create a New Account' : 'Portal Login'}
          </p>
        </div>
        
        {isSignup ? (
          // Signup Form
          <>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input id="name" name="name" type="text" required className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Full Name" />
              </div>
              <div>
                <label htmlFor="email-signup" className="sr-only">Email address</label>
                <input id="email-signup" name="email" type="email" autoComplete="email" required className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Email address" />
              </div>
              <div>
                <label htmlFor="password-signup" className="sr-only">Password</label>
                <input id="password-signup" name="password" type="password" autoComplete="new-password" required className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Password" />
              </div>
              <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                  Sign Up
              </button>
            </form>
            <div className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
              <p>
                Already have an account?{' '}
                <button onClick={() => setIsSignup(false)} className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                  Sign in
                </button>
              </p>
            </div>
          </>
        ) : (
          // Login Form
          <>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin('client'); }}>
              <div>
                <label htmlFor="email-login" className="sr-only">Email address</label>
                <input id="email-login" name="email" type="email" autoComplete="email" defaultValue="client@example.com" required className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Email address" />
              </div>
              <div>
                <label htmlFor="password-login" className="sr-only">Password</label>
                <input id="password-login" name="password" type="password" autoComplete="current-password" defaultValue="password" required className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Password" />
              </div>
              <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                  Sign In
              </button>
            </form>
            
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="flex-shrink mx-4 text-xs text-gray-500 dark:text-gray-400 uppercase">Demo Login</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button onClick={() => onLogin('client')} className="w-full text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-xs px-4 py-2 text-center">Client</button>
                <button onClick={() => onLogin('admin')} className="w-full text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-xs px-4 py-2 text-center">Admin</button>
                <button onClick={() => onLogin('master-admin')} className="w-full text-white bg-purple-600 hover:bg-purple-700 font-medium rounded-lg text-xs px-4 py-2 text-center">Master</button>
            </div>


            <div className="text-sm text-center font-light text-gray-500 dark:text-gray-400 pt-4">
              <p className="mb-2">
                Need an account?{' '}
                <button onClick={() => setIsSignup(true)} className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                  Sign up
                </button>
              </p>
              <button onClick={onBack} className="font-medium text-gray-500 hover:underline dark:text-gray-400">
                &larr; Go Back to Website
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
