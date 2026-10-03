import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Shield,
  Calendar,
  LogOut,
  Edit3,
  Check,
  X,
  Sparkles,
  Bot,
  GraduationCap,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Rahul Sharma');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('6th Semester');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({ name });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Success banner */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Cover / Header Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative">
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Student Account</span>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 sm:px-10 pb-10 pt-0 relative">
          {/* Avatar and Action row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-md shadow-slate-200">
                <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black">
                  {user?.name?.charAt(0) || 'S'}
                </div>
              </div>
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{user?.name || 'Rahul Sharma'}</h1>
                <p className="text-xs text-slate-500 font-medium">{user?.email || 'student@college.edu'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:border-blue-400 bg-white text-slate-700 hover:text-blue-600 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              ) : null}

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          </div>

          {/* Edit Form or Information Grid */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-100 max-w-lg">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Academic Semester
                </label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  <User className="w-4 h-4 text-blue-600" />
                  Role
                </div>
                <p className="text-sm font-bold text-slate-800 capitalize">{user?.role || 'student'}</p>
                <span className="text-[11px] text-slate-400">Undergraduate Scholar</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  Department
                </div>
                <p className="text-sm font-bold text-slate-800">{department}</p>
                <span className="text-[11px] text-slate-400">{semester}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  Email
                </div>
                <p className="text-sm font-bold text-slate-800 truncate">{user?.email || 'student@college.edu'}</p>
                <span className="text-[11px] text-emerald-600 font-medium">Domain Verified</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Enrolled Since
                </div>
                <p className="text-sm font-bold text-slate-800">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'January 2026'}
                </p>
                <span className="text-[11px] text-slate-400">Academic Year 2025-26</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
