import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, User, Mail, Lock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function StudentRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/student/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid student email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password, confirmPassword);
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 items-center justify-center text-white shadow-md shadow-blue-500/20 mb-4">
              <Bot className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Student Account</h2>
            <p className="text-xs text-slate-500 mt-1">Join the Smart Student Assistance network</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Nair"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                College Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Register Student Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
