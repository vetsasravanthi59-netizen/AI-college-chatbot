import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  GraduationCap,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  MessageSquare,
  Shield,
  History,
  BookOpen,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Smooth scroll handler for anchor links
  const handleScrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">AI College Chatbot</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">MVP</span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Smart Student Assistance System</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>

            <button
              onClick={() => handleScrollToSection('features')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Features
            </button>

            <button
              onClick={() => handleScrollToSection('about')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              About
            </button>

            <Link
              to="/chatbot"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                isActive('/chatbot') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bot className="w-4 h-4 text-blue-600" />
              Ask AI
            </Link>

            {/* Student Navigation Links */}
            {isAuthenticated && (
              <>
                <Link
                  to="/student/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    isActive('/student/dashboard') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/student/history"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    isActive('/student/history') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <History className="w-4 h-4" />
                  History
                </Link>
              </>
            )}

            {/* Admin Navigation Links */}
            {isAuthenticated && isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    isActive('/admin/dashboard') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Shield className="w-4 h-4 text-indigo-600" />
                  Admin Panel
                </Link>
                <Link
                  to="/admin/faqs"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    isActive('/admin/faqs') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Manage FAQs
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/50 transition-all text-sm font-medium text-slate-700"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span>{user?.name?.split(' ')[0]}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 uppercase font-semibold">
                    {user?.role}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                >
                  Student Login
                </Link>
                <Link
                  to="/admin/login"
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-md transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <button
            onClick={() => handleScrollToSection('features')}
            className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => handleScrollToSection('about')}
            className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            About
          </button>
          <Link
            to="/chatbot"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-blue-600 hover:bg-blue-50"
          >
            Ask AI Assistant
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Student Dashboard
              </Link>
              <Link
                to="/student/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Chat History
              </Link>

              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-700 hover:bg-indigo-50"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/faqs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-700 hover:bg-indigo-50"
                  >
                    Manage FAQs
                  </Link>
                </>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Profile ({user?.name})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-slate-200 text-slate-800 font-medium"
              >
                Student Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-blue-600 text-white font-medium shadow-xs"
              >
                Get Started
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-indigo-600"
              >
                Admin Portal Login →
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
