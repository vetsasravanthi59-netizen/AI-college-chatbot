import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getMongoStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'AI College Chatbot – Smart Student Assistance System',
    timestamp: new Date(),
    database: getMongoStatus() ? 'MongoDB Connected' : 'In-Memory High-Fidelity Store Active',
  });
});

// Central friendly error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred. Please try again.',
  });
});

// Start Server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🎓 AI College Chatbot Server is running on port ${PORT}`);
    console.log(`🚀 API Base: http://localhost:${PORT}/api`);
    console.log(`🩺 Health:   http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

startServer();
