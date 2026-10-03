import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Bot className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
          <h2 className="text-lg font-bold text-slate-800">Page Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The page you are looking for does not exist in the College Student Portal.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
