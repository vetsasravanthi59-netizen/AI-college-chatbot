import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  History,
  Search,
  Trash2,
  MessageSquare,
  Bot,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Tag,
} from 'lucide-react';

export default function ChatHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getChatHistory(user?.id);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleClear = async () => {
    try {
      await api.clearChatHistory(user?.id);
      setHistory([]);
      setShowClearConfirm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredHistory = history.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.message.toLowerCase().includes(q) ||
      item.response.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  const handleOpenConversation = (query) => {
    navigate(`/chatbot?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <History className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Student Chat History</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review past interactions, responses, and continue conversations with the AI Assistant.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          )}

          <Link
            to="/chatbot"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            New Chat
          </Link>
        </div>
      </div>

      {/* Confirmation Dialog for Clearing History */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Clear All Chat History?</h3>
              <p className="text-xs text-slate-500 mt-1">
                This will delete your recorded chatbot questions and responses. This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow-xs"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search conversation keywords (e.g. library, timing, exam, hostel, fee)..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 shadow-2xs"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* History Grid / List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchTerm ? 'No matching conversations found' : 'No chat history logged yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchTerm
              ? 'Try modifying your search term or browsing general categories.'
              : 'Interact with the AI Assistant to log questions and answers.'}
          </p>
          <button
            onClick={() => navigate('/chatbot')}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
          >
            Ask a Question Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHistory.map((item, index) => (
            <div
              key={item._id || index}
              onClick={() => handleOpenConversation(item.message)}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-3"
            >
              <div className="space-y-2">
                {/* Meta info */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {item.category || 'General'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {item.timestamp ? new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recent'}
                    </span>
                  </div>
                </div>

                {/* User query */}
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                    Q
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.message}
                  </h4>
                </div>

                {/* AI response preview */}
                <div className="flex items-start gap-2 pl-1">
                  <div className="w-4 h-4 rounded-full bg-slate-100 text-blue-600 flex items-center justify-center text-[9px] shrink-0 font-bold mt-0.5">
                    A
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {item.response}
                  </p>
                </div>
              </div>

              {/* Bottom action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
                <span>Resume in Chatbot</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
