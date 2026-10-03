import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import FaqModal from '../components/FaqModal';
import {
  BookOpen,
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Tag,
  Folder,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'College Information',
  'Departments',
  'Faculty',
  'Examinations',
  'Fees',
  'Library',
  'Events',
  'Holidays',
  'Transport',
  'Hostel',
  'Placements',
  'Campus facilities',
  'General',
];

export default function FaqManagementPage() {
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const loadFaqs = async () => {
    setLoading(true);
    try {
      const data = await api.getFaqs(searchTerm, selectedCategory);
      setFaqs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, [searchTerm, selectedCategory]);

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingFaq(faq);
    setIsModalOpen(true);
  };

  const handleSaveFaq = async (faqData) => {
    if (faqData._id) {
      await api.updateFaq(faqData._id, faqData);
      setToastMessage('FAQ updated successfully.');
    } else {
      await api.createFaq(faqData);
      setToastMessage('New FAQ created successfully.');
    }
    setTimeout(() => setToastMessage(''), 3000);
    loadFaqs();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteFaq(deleteId);
      setToastMessage('FAQ deleted from knowledge base.');
      setTimeout(() => setToastMessage(''), 3000);
      setDeleteId(null);
      loadFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Knowledge-Base & FAQ Management</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain and update official college answers utilized by the AI chatbot knowledge engine.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={loadFaqs}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh FAQs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <PlusCircle className="w-4 h-4" />
            Add New FAQ
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="md:col-span-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions, answers, or keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
          />
        </div>

        {/* Category Filter */}
        <div className="md:col-span-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong>{faqs.length}</strong> college FAQ records</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            Verified Knowledge Records
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No FAQ entries match your filters</p>
            <p className="text-xs text-slate-400">Clear your search or add a new question.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6 w-1/4">Question</th>
                  <th className="py-3.5 px-6 w-2/5">Answer</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Keywords</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faqs.map((faq) => (
                  <tr key={faq._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 align-top">
                      {faq.question}
                    </td>
                    <td className="py-4 px-6 text-slate-600 leading-relaxed align-top">
                      {faq.answer}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap align-top">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px]">
                        {faq.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(faq.keywords || []).slice(0, 4).map((kw, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 text-[10px]"
                          >
                            {kw}
                          </span>
                        ))}
                        {(faq.keywords || []).length > 4 && (
                          <span className="text-[10px] text-slate-400">
                            +{faq.keywords.length - 4} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right align-top whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(faq)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 transition-colors"
                          title="Edit FAQ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(faq._id)}
                          className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-500 transition-colors"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Knowledge FAQ?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this answer from the AI knowledge base?
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow-xs"
              >
                Delete FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <FaqModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFaq}
        initialData={editingFaq}
      />
    </div>
  );
}
