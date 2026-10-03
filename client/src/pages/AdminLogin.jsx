import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight, LogIn } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);

  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated as admin, redirect to admin dashboard
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const getRedirectPath = () => {
    const fromPath = location.state?.from?.pathname;
    if (fromPath && fromPath !== '/admin/login' && fromPath !== '/login') {
      return fromPath;
    }
    return '/admin/dashboard';
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide administrative credentials.');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email.trim(), password);
      if (data.user?.role !== 'admin') {
        setError('Unauthorized: This account does not possess administrator credentials.');
        return;
      }
      navigate(getRedirectPath(), { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Instant Demo Login for Admin
  const handleInstantDemoLogin = async () => {
    setEmail('admin@college.edu');
    setPassword('admin123');
    setError('');
    setIsDemoSubmitting(true);
    setLoading(true);
    try {
      const data = await login('admin@college.edu', 'admin123');
      navigate(getRedirectPath(), { replace: true });
    } catch (err) {
      setError(err.message || 'Demo admin login failed');
    } finally {
      setLoading(false);
      setIsDemoSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900/5">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-900 items-center justify-center text-white shadow-md mb-4">
              <Shield className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin & Faculty Portal</h2>
            <p className="text-xs text-slate-500 mt-1">Manage FAQs, knowledge-base records, and chatbot analytics</p>
          </div>

          {/* Demo Admin Credentials Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between gap-3">
            <div className="text-xs">
              <span className="font-bold text-indigo-950 block">Demo Admin Credentials:</span>
              <code className="text-indigo-800 text-[11px]">admin@college.edu</code> • <code className="text-indigo-800 text-[11px]">admin123</code>
            </div>
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              disabled={loading}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shrink-0 shadow-sm flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isDemoSubmitting ? 'Entering...' : '1-Click Demo'}
            </button>
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
                Admin Email
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
                  placeholder="admin@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-indigo-400" />
                  Sign In to Admin Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link to="/login" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
              Looking for student login instead? Click here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
