import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import ChatbotPage from './pages/ChatbotPage';
import ChatHistoryPage from './pages/ChatHistoryPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import FaqManagementPage from './pages/FaqManagementPage';
import NotFoundPage from './pages/NotFoundPage';

function AppLayout() {
  const location = useLocation();
  const isChatbotPage = location.pathname === '/chatbot';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/register" element={<StudentRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* AI Chatbot */}
          <Route path="/chatbot" element={<ChatbotPage />} />

          {/* Student Protected Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute roleRequired="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/history"
            element={
              <ProtectedRoute roleRequired="student">
                <ChatHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/faqs"
            element={
              <ProtectedRoute roleRequired="admin">
                <FaqManagementPage />
              </ProtectedRoute>
            }
          />

          {/* Aliases & Redirects for Seamless Navigation */}
          <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/student-dashboard" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/history" element={<Navigate to="/student/history" replace />} />
          <Route path="/chat-history" element={<Navigate to="/student/history" replace />} />
          <Route path="/chat" element={<Navigate to="/chatbot" replace />} />
          <Route path="/ask" element={<Navigate to="/chatbot" replace />} />
          <Route path="/assistant" element={<Navigate to="/chatbot" replace />} />
          <Route path="/ai" element={<Navigate to="/chatbot" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/faqs" element={<Navigate to="/admin/faqs" replace />} />
          <Route path="/faq" element={<Navigate to="/admin/faqs" replace />} />
          <Route path="/admin/faq" element={<Navigate to="/admin/faqs" replace />} />
          <Route path="/signin" element={<Navigate to="/login" replace />} />
          <Route path="/sign-in" element={<Navigate to="/login" replace />} />
          <Route path="/student-login" element={<Navigate to="/login" replace />} />
          <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />
          <Route path="/sign-up" element={<Navigate to="/register" replace />} />
          <Route path="/registration" element={<Navigate to="/register" replace />} />
          <Route path="/student-registration" element={<Navigate to="/register" replace />} />
          <Route path="/student/profile" element={<Navigate to="/profile" replace />} />
          <Route path="/my-profile" element={<Navigate to="/profile" replace />} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Conditionally omit footer on interactive full-height chatbot page */}
      {!isChatbotPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
