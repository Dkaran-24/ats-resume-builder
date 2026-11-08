'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/auth';
import { storage } from '@/lib/storage';
import { 
  User, Mail, Lock, Sparkles, CheckCircle2, ArrowRight, 
  ShieldCheck, X, LogIn, UserPlus, KeyRound
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserUpdate: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdate
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'profile'>('profile');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(currentUser.name || '');
  const [targetRole, setTargetRole] = useState(currentUser.targetRole || 'Senior Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState(currentUser.experienceLevel || 'Senior');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    setStatusMessage('Authenticating with Google Account...');
    setTimeout(() => {
      const googleUser: UserProfile = {
        id: `usr_goog_${Date.now()}`,
        name: 'Alex Morgan',
        email: 'alex.morgan.dev@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        targetRole: targetRole || 'Senior Full Stack Engineer',
        industry: 'Software & Technology',
        experienceLevel: 'Senior',
        createdAt: new Date().toISOString()
      };
      storage.saveUserProfile(googleUser);
      onUserUpdate(googleUser);
      setStatusMessage('Signed in successfully with Google!');
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 700);
    }, 600);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatusMessage('Logging in...');
    setTimeout(() => {
      const loggedIn: UserProfile = {
        ...currentUser,
        email: email,
        name: email.split('@')[0].replace('.', ' ').toUpperCase()
      };
      storage.saveUserProfile(loggedIn);
      onUserUpdate(loggedIn);
      setStatusMessage('Welcome back!');
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 600);
    }, 500);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setStatusMessage('Creating your ResumeForge AI account...');
    setTimeout(() => {
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name,
        email,
        targetRole,
        experienceLevel: experienceLevel as any,
        industry: 'Technology',
        createdAt: new Date().toISOString()
      };
      storage.saveUserProfile(newUser);
      onUserUpdate(newUser);
      setStatusMessage('Account created successfully!');
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 600);
    }, 500);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name,
      targetRole,
      experienceLevel: experienceLevel as any
    };
    storage.saveUserProfile(updated);
    onUserUpdate(updated);
    setStatusMessage('Profile updated successfully!');
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 600);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(`Password reset link sent to ${email || 'your email'}. Check your inbox!`);
    setTimeout(() => {
      setStatusMessage(null);
      setMode('login');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {mode === 'profile' && 'User Profile & Settings'}
              {mode === 'login' && 'Log In to ResumeForge AI'}
              {mode === 'signup' && 'Create Your Free Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h3>
            <p className="text-xs text-slate-500">
              {mode === 'profile' && 'Manage your career target role and credentials.'}
              {mode === 'login' && 'Access all your saved ATS resumes & job analyses.'}
              {mode === 'signup' && 'Build unlimited ATS resumes with AI career assistant.'}
              {mode === 'forgot' && 'Enter your email to receive a password reset link.'}
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-lg text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* MODE 1: PROFILE MANAGEMENT */}
        {mode === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 text-slate-500 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Professional Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Seniority Level</label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="Student">Student / Fresher</option>
                <option value="Entry-Level">Entry-Level (0-2 years)</option>
                <option value="Mid-Level">Mid-Level (3-5 years)</option>
                <option value="Senior">Senior (6-10 years)</option>
                <option value="Executive">Executive / Director (10+ years)</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                Switch Account / Sign In
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: LOGIN */}
        {mode === 'login' && (
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 shadow-2xs transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <div className="flex-1 border-t border-slate-200" />
              <span>or sign in with email</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-indigo-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                Sign In
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-1">
              Don't have an account?{' '}
              <button onClick={() => setMode('signup')} className="text-indigo-600 font-bold hover:underline">
                Sign up free
              </button>
            </div>
          </div>
        )}

        {/* MODE 3: SIGN UP */}
        {mode === 'signup' && (
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 shadow-2xs transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign up with Google</span>
            </button>

            <form onSubmit={handleSignUp} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                Create Account
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-1">
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-indigo-600 font-bold hover:underline">
                Sign in
              </button>
            </div>
          </div>
        )}

        {/* MODE 4: FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Enter your registered email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Send Password Reset Link
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

