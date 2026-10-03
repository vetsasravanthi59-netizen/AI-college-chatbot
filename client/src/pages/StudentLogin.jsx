import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, Mail, Lock, Eye, EyeOff, LogIn, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);

  const { login, isAuthenticated, isStudent, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, automatically redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isStudent, isAdmin, navigate]);

  // Safe redirect path calculation
  const getRedirectPath = () => {
    const fromPath = location.state?.from?.pathname;
    if (fromPath && fromPath !== '/login' && fromPath !== '/admin/login') {
      return fromPath;
    }
    return '/student/dashboard';
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your student email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(getRedirectPath(), { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Login: instantly populates credentials and executes login & redirect
  const handleInstantDemoLogin = async () => {
    setEmail('student@college.edu');
    setPassword('student123');
    setError('');
    setIsDemoSubmitting(true);
    setLoading(true);
    try {
      await login('student@college.edu', 'student123');
      navigate(getRedirectPath(), { replace: true });
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
      setIsDemoSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        {/* Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 items-center justify-center text-white shadow-md shadow-blue-500/20 mb-4">
              <Bot className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Student Portal Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">Access your AI Assistant and personalized college dashboard</p>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-between gap-3">
            <div className="text-xs">
              <span className="font-bold text-blue-900 block">Demo Student Account:</span>
              <code className="text-blue-700 text-[11px]">student@college.edu</code> • <code className="text-blue-700 text-[11px]">student123</code>
            </div>
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              disabled={loading}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shrink-0 shadow-sm flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
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
                Student Email
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
                  placeholder="student@college.edu"
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
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
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In to Student Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3 text-center">
            <p className="text-xs text-slate-600">
              New student?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                Create an account
              </Link>
            </p>

            <Link
              to="/admin/login"
              className="text-xs text-slate-400 hover:text-indigo-600 transition-colors inline-flex items-center justify-center gap-1"
            >
              Are you a faculty or portal administrator? Admin Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
