import React, { useState, useEffect } from 'react';
import { X, HelpCircle, FileText, Tag, Folder } from 'lucide-react';

const CATEGORIES = [
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

export default function FaqModal({ isOpen, onClose, onSave, initialData }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [keywords, setKeywords] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question || '');
      setAnswer(initialData.answer || '');
      setCategory(initialData.category || 'General');
      setKeywords(Array.isArray(initialData.keywords) ? initialData.keywords.join(', ') : (initialData.keywords || ''));
    } else {
      setQuestion('');
      setAnswer('');
      setCategory('General');
      setKeywords('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please provide a question.');
      return;
    }
    if (!answer.trim()) {
      setError('Please provide an answer.');
      return;
    }

    const keywordArray = keywords
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      await onSave({
        _id: initialData?._id,
        question: question.trim(),
        answer: answer.trim(),
        category,
        keywords: keywordArray,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save FAQ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? 'Edit Demonstration FAQ' : 'Add New Demonstration FAQ'}
              </h3>
              <p className="text-xs text-slate-500">Knowledge-base record for AI Chatbot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-100">
              {error}
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-slate-500" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Question */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              Question
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What are the college timings?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Answer
            </label>
            <textarea
              required
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter verified college response..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              Keywords (Comma separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. timings, hours, open, close, schedule"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Used by the chatbot matching engine for high-accuracy semantic retrieval.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update FAQ' : 'Save FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
