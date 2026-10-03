import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import FaqModal from '../components/FaqModal';
import {
  Shield,
  Users,
  BookOpen,
  MessageSquare,
  PlusCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Tag,
  CheckCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 148,
    totalFaqs: 25,
    totalQuestions: 418,
    recentQuestions: [],
    categoriesCount: {},
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadData = async () => {
    try {
      const data = await api.getAdminStats();
      if (data) setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveFaq = async (faqData) => {
    await api.createFaq(faqData);
    setToastMessage('FAQ successfully added to knowledge base.');
    setTimeout(() => setToastMessage(''), 3500);
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold border border-white/10">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Administrative Operations Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Admin & Academic Coordinator Dashboard
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Monitor student engagement, manage verified demonstration FAQs, and curate knowledge base answers for the AI Assistant.
            </p>
          </div>

          {/* Quick Actions in Banner */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add New FAQ
            </button>
            <Link
              to="/admin/faqs"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Manage FAQs
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Students</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalStudents || 148}</h3>
            <span className="text-[11px] text-emerald-600 font-medium">Registered scholars</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total FAQs</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalFaqs || 25}</h3>
            <span className="text-[11px] text-indigo-600 font-medium">Verified Knowledge-base</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Questions Asked</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalQuestions || 418}</h3>
            <span className="text-[11px] text-emerald-600 font-medium">Processed by Assistant</span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all text-left flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Add New FAQ</h4>
              <p className="text-xs text-slate-500">Insert new college knowledge entry</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </button>

        <Link
          to="/admin/faqs"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-left flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Manage FAQs</h4>
              <p className="text-xs text-slate-500">Edit, search, and delete entries</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/chatbot"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all text-left flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Test Chatbot Live</h4>
              <p className="text-xs text-slate-500">Validate AI response accuracy</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Recent Questions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Student Questions Log</h2>
            <p className="text-xs text-slate-500">Live feed of student queries addressed by the system</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            Real-Time Query Log
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Student</th>
                <th className="py-3.5 px-6">Question Asked</th>
                <th className="py-3.5 px-6">Assistant Response</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(stats.recentQuestions || []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No student questions logged yet in this session.
                  </td>
                </tr>
              ) : (
                stats.recentQuestions.map((q, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-900 whitespace-nowrap">
                      {q.userName || 'Student'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-800 font-medium max-w-xs truncate">
                      {q.message}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 max-w-sm truncate">
                      {q.response}
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px]">
                        {q.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-400 whitespace-nowrap">
                      {q.timestamp ? new Date(q.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add FAQ */}
      <FaqModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFaq}
      />
    </div>
  );
}
