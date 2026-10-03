import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">AI College Assistant</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Smart Student Assistance System designed to provide instant answers to college timings, library services,
              examinations, courses, and student facilities.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 text-xs text-blue-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              Demo College Information Mode
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/chatbot" className="hover:text-white transition-colors">Ask AI Assistant</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Student Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">Student Registration</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* College Services */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 tracking-wide uppercase">Key Information</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/chatbot?q=What are the college timings?" className="hover:text-white transition-colors">College Timings</Link>
              </li>
              <li>
                <Link to="/chatbot?q=Where is the college library located?" className="hover:text-white transition-colors">Library & Resources</Link>
              </li>
              <li>
                <Link to="/chatbot?q=When are the semester examinations conducted?" className="hover:text-white transition-colors">Exam Timetable</Link>
              </li>
              <li>
                <Link to="/chatbot?q=What engineering departments are offered at the college?" className="hover:text-white transition-colors">Academic Departments</Link>
              </li>
              <li>
                <Link to="/chatbot?q=What are the hostel facilities and mess timings?" className="hover:text-white transition-colors">Hostel & Mess</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 tracking-wide uppercase">Contact & Support</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Academic Block A, Engineering Campus, Tech Boulevard</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@college.edu</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+91 (0) 80 2345 6789</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 AI College Chatbot. 3rd-Year CSE Academic Project Demonstration.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Academic Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
