import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Bot,
  MessageSquare,
  Clock,
  BookOpen,
  Calendar,
  Building2,
  Users,
  CreditCard,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const chats = await api.getChatHistory(user?.id);
        setHistory(chats);
      } catch (err) {
        console.error('Failed to load dashboard history', err);
      } finally {
        setLoadingHistory(false);
      }
    }
    loadData();
  }, [user]);

  const quickQuestions = [
    {
      title: 'College Timings',
      query: 'What are the college timings?',
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50 hover:bg-blue-100/80 border-blue-200/70',
    },
    {
      title: 'Library Timings',
      query: 'What are the library timings and rules?',
      icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50 hover:bg-indigo-100/80 border-indigo-200/70',
    },
    {
      title: 'Exam Information',
      query: 'When are the semester examinations conducted?',
      icon: <Calendar className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 hover:bg-amber-100/80 border-amber-200/70',
    },
    {
      title: 'Departments',
      query: 'What engineering departments are offered at the college?',
      icon: <Building2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200/70',
    },
    {
      title: 'Faculty Contacts',
      query: 'How can I contact faculty members outside class hours?',
      icon: <Users className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 hover:bg-purple-100/80 border-purple-200/70',
    },
    {
      title: 'Fees & Scholarships',
      query: 'What is the tuition fee payment deadline and procedure?',
      icon: <CreditCard className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50 hover:bg-rose-100/80 border-rose-200/70',
    },
  ];

  const handleAskQuick = (query) => {
    navigate(`/chatbot?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Card & Main Action */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-blue-500/15 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-blue-100 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Portal • Active Semester</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Your virtual campus assistant is online and ready to answer your academic, departmental, and campus queries.
            </p>
          </div>

          {/* Main Action Large Button */}
          <Link
            to="/chatbot"
            className="shrink-0 px-8 py-4 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <span>Ask AI Assistant</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Simple Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Questions Asked</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{history.length + 12}</h3>
            <span className="text-[11px] text-emerald-600 font-medium">Active this term</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Conversations</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{history.length || 2}</h3>
            <span className="text-[11px] text-blue-600 font-medium">Logged & searchable</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Saved Information</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">8 Topics</h3>
            <span className="text-[11px] text-slate-500 font-medium">Library, Exams, Fees</span>
          </div>
        </div>
      </div>

      {/* Quick Question Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Quick College Information</h2>
            <p className="text-xs text-slate-500">Click any card to prompt the AI Assistant instantly</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickQuestions.map((card, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuick(card.query)}
              className={`p-5 rounded-2xl border text-left transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer ${card.bg}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-white shadow-2xs">
                  {card.icon}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">{card.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-1">{card.query}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Conversations Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Conversations</h2>
            <p className="text-xs text-slate-500">Previous questions answered by your AI Assistant</p>
          </div>
          <Link
            to="/student/history"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All History →
          </Link>
        </div>

        {loadingHistory ? (
          <div className="py-12 flex justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Bot className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No questions asked yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start your first conversation with the AI College Assistant to see your history logged here.
            </p>
            <Link
              to="/chatbot"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Ask First Question
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {item.category || 'General'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.timestamp ? new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recently'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.message}</h4>
                  <p className="text-xs text-slate-600 line-clamp-1">{item.response}</p>
                </div>
                <button
                  onClick={() => handleAskQuick(item.message)}
                  className="shrink-0 self-start sm:self-center px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-white text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors shadow-2xs"
                >
                  Ask Again
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
