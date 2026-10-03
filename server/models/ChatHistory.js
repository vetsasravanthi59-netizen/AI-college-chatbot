import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    default: 'Student',
  },
  message: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'General',
  },
  confidence: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const ChatHistory = mongoose.models.ChatHistory || mongoose.model('ChatHistory', chatHistorySchema);
