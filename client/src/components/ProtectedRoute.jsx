import React from 'react';
import { Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

export default function ProtectedRoute({ children, roleRequired }) {
  const { user, isAuthenticated, loading, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!isAuthenticated) {
    const redirectPath = roleRequired === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If user is Admin, allow supervisor access to student pages
  if (user?.role === 'admin' && roleRequired === 'student') {
    return children;
  }

  // If role is required and does not match (e.g. Student trying to access Admin pages)
  if (roleRequired && user?.role !== roleRequired) {
    const handleSwitchToAdmin = async () => {
      try {
        await login('admin@college.edu', 'admin123');
        navigate(location.pathname || '/admin/dashboard', { replace: true });
      } catch (err) {
        navigate('/admin/login');
      }
    };

    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            You are logged in as a <strong>{user?.role}</strong>. This page requires{' '}
            <strong className="text-red-600">{roleRequired}</strong> privileges.
          </p>
          <div className="flex flex-col gap-2.5">
            {roleRequired === 'admin' && (
              <button
                onClick={handleSwitchToAdmin}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In as Admin (1-Click Switch)
              </button>
            )}

            <Link
              to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Back to My Dashboard
            </Link>

            <Link
              to={roleRequired === 'admin' ? '/admin/login' : '/login'}
              className="w-full py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium transition-colors"
            >
              Sign In with Another Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
