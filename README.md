# AI College Chatbot – Smart Student Assistance System

> **3rd-Year CSE Academic Project** | MERN Stack | JWT Auth | Voice Assistant | FAQ Knowledge Base

A fully functional AI-powered college chatbot that lets students ask questions about timings, library, exams, fees, departments, hostel, and more — through a modern conversational interface with voice support.

---

## Features

- **AI Chatbot** — Keyword/semantic FAQ matching engine (no external AI API required)
- **Voice Input** — Browser Web Speech API (Speech-to-Text)
- **Text-to-Speech** — Browser SpeechSynthesis reads answers aloud
- **Student Dashboard** — Quick-access cards, stats, recent conversations
- **Admin Dashboard** — Manage FAQs, view student queries
- **FAQ Management** — Full CRUD (Add / Edit / Delete / Search / Filter)
- **Authentication** — JWT-based login, bcrypt password hashing, role-based access
- **Chat History** — Persistent per-user conversation log with search
- **Responsive Design** — Tailwind CSS, works on desktop, tablet, and mobile
- **Zero-dependency fallback** — Runs fully in-memory if MongoDB is offline

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7, Lucide Icons |
| Backend | Node.js, Express.js (ESM modules) |
| Database | MongoDB + Mongoose (in-memory fallback included) |
| Auth | JWT, bcryptjs, role-based middleware |
| Voice | Browser Web Speech API (no extra libraries) |

---

## Folder Structure

```
c:\desktop\
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # Navbar, Footer, ProtectedRoute, FaqModal
│       ├── context/         # AuthContext (JWT state)
│       ├── pages/           # All 11 pages
│       └── services/        # api.js (HTTP calls), speech.js (voice)
├── server/                  # Express backend
│   ├── config/              # db.js (MongoDB + fallback)
│   ├── controllers/         # auth, chat, faq, admin
│   ├── data/                # sampleFaqs.js (25 demo FAQs)
│   ├── middleware/          # authMiddleware.js (JWT + role check)
│   ├── models/              # User, FAQ, ChatHistory (Mongoose)
│   ├── routes/              # authRoutes, chatRoutes, faqRoutes, adminRoutes
│   ├── services/            # chatbotService.js, storageService.js
│   └── server.js            # Entry point (port 5000)
├── .env.example
└── README.md
```

---

## Prerequisites

- **Node.js** v18 or higher — https://nodejs.org
- **MongoDB** (optional) — https://www.mongodb.com/try/download/community
  - The app runs perfectly without MongoDB using its built-in in-memory store

---

## Installation

```bash
# 1. Install backend dependencies
cd server
npm install

# 2. Install frontend dependencies
cd ../client
npm install
```

---

## Environment Variables

Copy `.env.example` to `server/.env`:

```bash
copy .env.example server\.env
```

`server/.env` contents:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/college_chatbot
JWT_SECRET=ai_college_chatbot_jwt_secret_key_2026_cse_project
```

> Leave `MONGO_URI` as-is. If MongoDB isn't running, the app automatically falls back to the in-memory store — **no configuration change needed**.

---

## MongoDB Setup (Optional)

If you want persistent data, install and start MongoDB:

```bash
# Windows — start MongoDB service
net start MongoDB

# Or run manually
mongod --dbpath "C:\data\db"
```

Without MongoDB, the app still works with 25 preloaded demo FAQs and temporary in-session storage.

---

## How to Start

### Backend (Terminal 1)

```bash
cd server
node server.js
```

You should see:
```
🎓 AI College Chatbot Server is running on port 5000
🚀 API Base: http://localhost:5000/api
```

### Frontend (Terminal 2)

```bash
cd client
npm run dev
```

You should see:
```
VITE ready in ~750ms
➜  Local: http://localhost:5173/
```

---

## URLs

| Service | URL |
|---------|-----|
| **Frontend (App)** | **http://localhost:5173** |
| **Backend API** | http://localhost:5000/api |
| **Health Check** | http://localhost:5000/api/health |

---

## Demo Credentials

> These are development/demo credentials only. Do not use in production.

| Role | Email | Password |
|------|-------|----------|
| **Student** | student@college.edu | student123 |
| **Admin** | admin@college.edu | admin123 |

Both login pages have a **1-Click Demo** button for instant login.

---

## How the Chatbot Fallback Works

Since this is a prototype, no external AI API is required. The chatbot uses a local **keyword + semantic scoring** engine:

1. Student sends a question (e.g. *"When does the library close?"*)
2. The question is tokenized — stop words removed
3. Each FAQ is scored by:
   - Direct phrase match (+40 pts)
   - Keyword exact match (+25 pts)
   - Keyword token overlap (+8 pts each)
   - Question token overlap (+6 pts each)
   - Category match (+10 pts)
4. The FAQ with the highest score (above threshold 12) is returned
5. If no match found → friendly fallback message + suggested topics

**To connect a real AI API later**, replace or augment `findFaqMatch()` in `server/services/chatbotService.js` with an OpenAI / Gemini API call.

---

## How to Configure AI API (Future)

In `server/services/chatbotService.js`, add at the top of `findFaqMatch()`:

```js
// Example: OpenAI integration
if (process.env.OPENAI_API_KEY) {
  const aiAnswer = await callOpenAI(query);
  if (aiAnswer) return { success: true, answer: aiAnswer, confidence: 95 };
}
// Falls through to keyword matching below...
```

Add to `server/.env`:
```
OPENAI_API_KEY=your_key_here
```

---

## How Voice Assistant Works

- **Microphone button** in chatbot uses `window.SpeechRecognition` (Chrome/Edge)
- Spoken words are transcribed to text and auto-submitted as a question
- Bot answers are read aloud via `window.speechSynthesis` when Voice is toggled On
- If the browser doesn't support voice, a friendly message is shown and text chat still works

---

## REST API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register student |
| POST | `/api/auth/login` | Login (student or admin) |
| GET | `/api/auth/me` | Get current user (JWT required) |
| POST | `/api/chat` | Send message, get FAQ answer |
| GET | `/api/chat/history` | Get chat history |
| DELETE | `/api/chat/history` | Clear chat history |
| GET | `/api/faqs` | List all FAQs (supports ?search= ?category=) |
| POST | `/api/faqs` | Create FAQ |
| PUT | `/api/faqs/:id` | Update FAQ |
| DELETE | `/api/faqs/:id` | Delete FAQ |
| GET | `/api/admin/dashboard` | Admin stats |
| GET | `/api/health` | Server health check |

---

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `EADDRINUSE: port 5000` | Another process is using port 5000. Run: `netstat -ano \| findstr :5000` then `taskkill /PID <pid> /F` |
| `MongoDB connection refused` | Normal — app uses in-memory fallback automatically. No action needed. |
| `npm run dev` blocked by PS policy | Run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` first |
| Voice input not working | Use Chrome or Edge. Safari/Firefox have limited Speech API support. |
| Login fails with "Invalid credentials" | Use exact demo credentials: `student@college.edu` / `student123` |

---

## Pages Overview

| Page | Route | Access |
|------|-------|--------|
| Landing Page | `/` | Public |
| Student Login | `/login` | Public |
| Student Register | `/register` | Public |
| Admin Login | `/admin/login` | Public |
| Student Dashboard | `/student/dashboard` | Student only |
| AI Chatbot | `/chatbot` | Public (history saved if logged in) |
| Chat History | `/student/history` | Student only |
| Profile | `/profile` | Logged in |
| Admin Dashboard | `/admin/dashboard` | Admin only |
| FAQ Management | `/admin/faqs` | Admin only |

---

*AI College Chatbot — 3rd Year CSE Academic Project Demonstration | MERN Stack*
