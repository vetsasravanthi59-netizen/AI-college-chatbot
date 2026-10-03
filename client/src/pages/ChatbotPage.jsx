import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  createSpeechRecognizer,
  speakText,
  stopSpeaking,
} from '../services/speech';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PlusCircle,
  History,
  LayoutDashboard,
  User,
  LogOut,
  Sparkles,
  HelpCircle,
  Menu,
  X,
  Check,
  AlertCircle,
  ShieldCheck,
  MessageSquare,
  Shield,
  BookOpen,
  LogIn,
  Home,
} from 'lucide-react';

export default function ChatbotPage() {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 'welcome_msg',
      sender: 'bot',
      text: "Hello! I’m your AI College Assistant. How can I help you today?",
      category: 'Welcome',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceNotice, setVoiceNotice] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentChats, setRecentChats] = useState([]);

  const messagesEndRef = useRef(null);
  const speechRecognizerRef = useRef(null);

  const suggestedQuestions = [
    'What are the college timings?',
    'Where is the library located?',
    'What are the library timings and rules?',
    'Who is the CSE HOD?',
    'When are semester exams?',
    'What engineering departments are offered at the college?',
    'Where can I view the official college holiday list?',
    'What is the tuition fee payment deadline and procedure?',
    'What companies visit for campus placements and what is the training process?',
    'What are the hostel facilities and mess timings?',
  ];

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Check voice support
  useEffect(() => {
    setVoiceSupported(isSpeechRecognitionSupported());
  }, []);

  // Load user chat history for the sidebar
  useEffect(() => {
    async function loadRecent() {
      if (user?.id) {
        try {
          const history = await api.getChatHistory(user.id);
          setRecentChats(history.slice(0, 6));
        } catch (err) {
          console.error(err);
        }
      }
    }
    loadRecent();
  }, [user]);

  // Handle incoming query param ?q=
  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      handleSendMessage(initialQuery);
      // Clean query parameter from URL so subsequent interactions don't get stuck
      navigate('/chatbot', { replace: true });
    }
  }, [searchParams]);

  // Core Send Message function
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    setInputMessage('');
    setVoiceNotice('');

    const userMessageId = `usr_${Date.now()}`;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Display user message
    const userMsg = {
      id: userMessageId,
      sender: 'user',
      text,
      timestamp: currentTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // 2. Query backend / local FAQ matching system
      const response = await api.sendChatMessage(text, user);

      // Add realistic human-like assistance delay (350ms)
      await new Promise((resolve) => setTimeout(resolve, 350));

      const botMsg = {
        id: response.id || `bot_${Date.now()}`,
        sender: 'bot',
        text: response.answer,
        category: response.matchedFaq?.category || 'Information',
        confidence: response.confidence || 0,
        suggestedTopics: response.suggestedTopics,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Update sidebar history
      setRecentChats((prev) => [
        {
          _id: botMsg.id,
          message: text,
          response: botMsg.text,
          timestamp: new Date(),
        },
        ...prev.slice(0, 5),
      ]);

      // If voice TTS readout is active, speak the answer
      if (autoSpeak) {
        speakText(response.answer);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: 'bot',
          text: "I don't have that information yet. Please contact the college administration or try another question.",
          category: 'Notice',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Voice Assistant Flow (Speech Recognition)
  const toggleListening = () => {
    if (!isSpeechRecognitionSupported()) {
      setVoiceNotice('Voice input is not supported in this browser. Please use text input.');
      setTimeout(() => setVoiceNotice(''), 4500);
      return;
    }

    if (isListening) {
      if (speechRecognizerRef.current) {
        speechRecognizerRef.current.abort();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognizer = createSpeechRecognizer({
        onStart: () => {
          setIsListening(true);
          setVoiceNotice('Listening... Speak your college question clearly.');
        },
        onEnd: () => {
          setIsListening(false);
          setVoiceNotice('');
        },
        onError: (err) => {
          setIsListening(false);
          setVoiceNotice(
            err === 'no-speech'
              ? 'No speech detected. Please try again.'
              : 'Voice recognition encountered an issue. Please use text input.'
          );
          setTimeout(() => setVoiceNotice(''), 4000);
        },
        onResult: (transcript) => {
          setIsListening(false);
          setVoiceNotice('');
          setInputMessage(transcript);
          // Auto submit the voice recognized question
          handleSendMessage(transcript);
        },
      });

      speechRecognizerRef.current = recognizer;
      recognizer.start();
    } catch (err) {
      setIsListening(false);
      setVoiceNotice('Voice input is not supported in this browser. Please use text input.');
    }
  };

  // Speak specific answer manually
  const handleSpeak = (text) => {
    speakText(text);
  };

  // New Chat action
  const handleNewChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'bot',
        text: "Hello! I’m your AI College Assistant. How can I help you today?",
        category: 'Welcome',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden relative">
      {/* Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top actions & history */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Mobile close & header */}
          <div className="flex md:hidden items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-sm text-slate-800">Chatbot Navigation</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => {
              handleNewChat();
              setSidebarOpen(false);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            New Chat
          </button>

          {/* Suggested Questions Section */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Suggested Questions</span>
            </div>
            <div className="space-y-1">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSendMessage(q);
                    setSidebarOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-lg text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors line-clamp-2 leading-relaxed border border-transparent hover:border-blue-100"
                >
                  • {q}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Conversations */}
          {recentChats.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <History className="w-3.5 h-3.5 text-slate-600" />
                <span>Recent Questions</span>
              </div>
              <div className="space-y-1">
                {recentChats.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      handleSendMessage(c.message);
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors truncate block"
                  >
                    💬 {c.message}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer links */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-1 text-xs font-medium text-slate-600">
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-indigo-600" />
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/faqs"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Manage FAQs
                  </Link>
                  <Link
                    to="/student/dashboard"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-500" />
                    Student View
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/student/dashboard"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-500" />
                    Student Dashboard
                  </Link>
                  <Link
                    to="/student/history"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    <History className="w-4 h-4 text-slate-500" />
                    Chat History
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                <User className="w-4 h-4 text-slate-500" />
                My Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold text-blue-700"
              >
                <LogIn className="w-4 h-4 text-blue-600" />
                Student Login
              </Link>
              <Link
                to="/admin/login"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors"
              >
                <Shield className="w-4 h-4 text-indigo-500" />
                Admin Portal
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white hover:text-slate-800 transition-colors"
              >
                <Home className="w-4 h-4 text-slate-500" />
                Back to Home
              </Link>
            </>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
        {/* Chat Area Top Bar */}
        <div className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-tight">AI College Assistant</h2>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Ready to answer college questions
                </div>
              </div>
            </div>
          </div>

          {/* Right Controls: Auto-voice toggle & Demo label */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Demo College Information</span>
            </div>

            <button
              onClick={() => {
                setAutoSpeak(!autoSpeak);
                if (autoSpeak) stopSpeaking();
              }}
              title={autoSpeak ? 'Mute AI voice responses' : 'Auto read aloud AI responses'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                autoSpeak
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-blue-600" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{autoSpeak ? 'Voice On' : 'Voice Off'}</span>
            </button>
          </div>
        </div>

        {/* Voice Feedback / Notification Banner */}
        {voiceNotice && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between text-xs text-blue-800 animate-in fade-in shrink-0">
            <div className="flex items-center gap-2">
              {isListening ? (
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              ) : (
                <AlertCircle className="w-4 h-4 text-blue-600" />
              )}
              <span>{voiceNotice}</span>
            </div>
            <button onClick={() => setVoiceNotice('')} className="text-blue-500 hover:text-blue-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 max-w-3xl ${
                  isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs shadow-xs ${
                    isBot
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-white font-semibold'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : user?.name?.charAt(0) || 'S'}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1.5 max-w-[85%] sm:max-w-[78%]">
                  <div
                    className={`p-4 rounded-2xl shadow-2xs text-sm leading-relaxed ${
                      isBot
                        ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                        : 'bg-blue-600 text-white rounded-tr-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Bot metadata badges */}
                    {isBot && msg.category && msg.id !== 'welcome_msg' && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          {msg.category}
                        </span>

                        {/* Read Aloud button */}
                        <button
                          onClick={() => handleSpeak(msg.text)}
                          title="Read response aloud"
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Speak</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Timestamp & confidence */}
                  <div
                    className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                      isBot ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isBot && msg.confidence > 0 && (
                      <span className="text-emerald-600 font-medium">
                        • {msg.confidence}% Match
                      </span>
                    )}
                  </div>

                  {/* Fallback suggested topics if query had no direct match */}
                  {msg.suggestedTopics && (
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-slate-500 mb-1.5">You can ask:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedTopics.map((topic, tidx) => (
                          <button
                            key={tidx}
                            onClick={() => handleSendMessage(topic)}
                            className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3 max-w-3xl mr-auto">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-xs shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-slate-400 ml-2 font-medium">Searching college knowledge base...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Area */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-4xl mx-auto relative flex items-center gap-2"
          >
            {/* Microphone button */}
            <button
              type="button"
              onClick={toggleListening}
              title={
                isListening
                  ? 'Stop listening'
                  : voiceSupported
                  ? 'Voice Assistant (Click and speak)'
                  : 'Voice input not supported in this browser'
              }
              className={`p-3 rounded-2xl transition-all shadow-xs flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white recording-pulse'
                  : 'bg-slate-100 text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {isListening ? <Mic className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Main Text Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? 'Listening... Speak now...' : 'Ask anything about timings, library, exams, fees, faculty...'}
                className="w-full py-3 pl-4 pr-10 rounded-2xl border border-slate-300 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center mt-2">
            Verified knowledge-base retrieval system • Demo College Information • Voice assisted
          </p>
        </div>
      </main>
    </div>
  );
}
