import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bot,
  Mic,
  Zap,
  BookOpen,
  History,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  MessageSquare,
  Clock,
  Award,
  Users,
} from 'lucide-react';

export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location]);
  const features = [
    {
      icon: <Bot className="w-6 h-6 text-blue-600" />,
      title: 'AI Chatbot',
      description: 'Conversational assistant tuned specifically to address academic, administrative, and student queries.',
    },
    {
      icon: <Mic className="w-6 h-6 text-indigo-600" />,
      title: 'Voice Assistant',
      description: 'Hands-free voice interaction powered by browser Speech Recognition and clear Text-to-Speech playback.',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      title: 'Instant Answers',
      description: 'Get verified responses in milliseconds without navigating complex departmental hierarchies or waiting in queues.',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
      title: 'College Information',
      description: 'Authoritative data covering library timings, examination cycles, department HODs, transport, and hostels.',
    },
    {
      icon: <History className="w-6 h-6 text-purple-600" />,
      title: 'Chat History',
      description: 'Review your previous questions and saved answers anytime from your personalized student repository.',
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-rose-600" />,
      title: 'Smart Student Support',
      description: 'Tailored specifically for undergraduate and postgraduate engineering students to streamline campus life.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Ask a Question',
      description: 'Type your question or click the microphone to speak naturally.',
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
    },
    {
      step: '02',
      title: 'AI Understands',
      description: 'Intelligent keyword and semantic matching extracts user intent.',
      icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
    },
    {
      step: '03',
      title: 'Find College Information',
      description: 'The system consults the verified college knowledge-base repository.',
      icon: <Search className="w-6 h-6 text-emerald-600" />,
    },
    {
      step: '04',
      title: 'Get an Answer',
      description: 'Receive instant, accurate information with optional voice readout.',
      icon: <Award className="w-6 h-6 text-amber-600" />,
    },
  ];

  const sampleQuickQuestions = [
    'What are the college timings?',
    'Where is the library located?',
    'Who is the CSE HOD?',
    'When are semester exams?',
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Demo Banner */}
      <div className="bg-blue-600 text-white text-xs py-2 px-4 text-center font-medium">
        🎓 3rd-Year CSE Academic Project Demonstration • Preloaded with 25 Verified Demonstration College FAQs
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 bg-gradient-to-b from-blue-50/70 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Next-Gen Student Services Portal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                AI College Chatbot
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-3xl sm:text-4xl lg:text-5xl mt-2 font-bold">
                  Smart Student Assistance System
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Get quick answers to college-related questions through an AI-powered student assistant.
                Access timings, examination schedules, departmental contacts, library access, and campus amenities instantly.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/chatbot"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all flex items-center gap-2 group"
                >
                  <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Ask AI Assistant
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/login"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-base border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center gap-2"
                >
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Student Login
                </Link>
              </div>

              {/* Quick sample prompt pills */}
              <div className="pt-4 border-t border-slate-200/80">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                  Try asking questions like:
                </p>
                <div className="flex flex-wrap gap-2">
                  {sampleQuickQuestions.map((q, idx) => (
                    <Link
                      key={idx}
                      to={`/chatbot?q=${encodeURIComponent(q)}`}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-2xs"
                    >
                      "{q}"
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Visual / Chatbot Showcase Mockup */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
                {/* Window header */}
                <div className="bg-slate-900 px-5 py-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium text-slate-300 ml-2">Campus Assistant v1.0</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online
                  </div>
                </div>

                {/* Simulated Chat Feed */}
                <div className="p-5 space-y-4 bg-slate-50/50 min-h-[360px] flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Bot welcome */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200 text-xs text-slate-700 leading-relaxed max-w-[85%]">
                        Hello! I am your <strong>AI College Assistant</strong>. Ask me about exams, library hours, department contacts, or campus facilities!
                      </div>
                    </div>

                    {/* User message */}
                    <div className="flex items-start gap-2.5 justify-end">
                      <div className="bg-blue-600 text-white p-3.5 rounded-2xl rounded-tr-xs shadow-xs text-xs leading-relaxed max-w-[85%] text-left">
                        Where is the library and when does it close?
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">
                        S
                      </div>
                    </div>

                    {/* Bot response */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200 text-xs text-slate-700 leading-relaxed max-w-[85%] space-y-1.5">
                        <p>
                          The <strong>Central Library</strong> is on the 2nd Floor of Academic Block A. It remains open Monday to Saturday from <strong>8:30 AM to 7:00 PM</strong>.
                        </p>
                        <span className="inline-block text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-sm">
                          Category: Library • 100% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Input Mockup */}
                  <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
                    <input
                      readOnly
                      value="Type or tap microphone to speak..."
                      className="w-full text-xs text-slate-400 bg-transparent px-2 outline-hidden cursor-pointer"
                    />
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-500">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div className="p-2 rounded-xl bg-blue-600 text-white">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Engineered for Students
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3 sm:text-4xl">
              Comprehensive Campus Assistance
            </h2>
            <p className="text-base text-slate-600 mt-4">
              Everything students and campus administrators need to communicate academic information friction-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <div
                key={index}
                className="bg-slate-50/70 hover:bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-50 transition-all shadow-2xs">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3 sm:text-4xl">
              How the Assistant Works
            </h2>
            <p className="text-base text-slate-600 mt-4">
              Four streamlined steps from natural query to authoritative answer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-slate-200">{step.step}</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
                <Award className="w-4 h-4" />
                <span>3rd-Year CSE Academic Project</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Designed to Modernize Higher Education Student Support
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                The AI College Chatbot replaces fragmented paper notices and crowded administrative desks with an intelligent,
                always-available virtual advisor. Built on the MERN stack architecture with modern Web Speech APIs, role-based
                dashboards, and FAQ management.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/chatbot"
                  className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors shadow-md"
                >
                  Experience the Chatbot Now
                </Link>
                <Link
                  to="/admin/login"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
                >
                  Admin Knowledge Base Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
