import bcrypt from 'bcryptjs';
import { sampleFaqs } from '../data/sampleFaqs.js';
import { getMongoStatus } from '../config/db.js';
import { User } from '../models/User.js';
import { FAQ } from '../models/FAQ.js';
import { ChatHistory } from '../models/ChatHistory.js';

// In-Memory store fallback
const inMemoryStore = {
  users: [
    {
      _id: 'usr_student_demo',
      name: 'Rahul Sharma',
      email: 'student@college.edu',
      passwordHash: bcrypt.hashSync('student123', 10),
      role: 'student',
      createdAt: new Date('2026-01-15T09:00:00Z'),
    },
    {
      _id: 'usr_admin_demo',
      name: 'Admin Coordinator',
      email: 'admin@college.edu',
      passwordHash: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      createdAt: new Date('2025-11-01T09:00:00Z'),
    },
  ],
  faqs: JSON.parse(JSON.stringify(sampleFaqs)),
  chatHistory: [
    {
      _id: 'chat_init_1',
      userId: 'usr_student_demo',
      userName: 'Rahul Sharma',
      message: 'What are the college timings?',
      response: 'The college operates Monday through Friday from 9:00 AM to 4:30 PM. Administrative offices remain open until 5:00 PM.',
      category: 'College Information',
      confidence: 95,
      timestamp: new Date(Date.now() - 3600000 * 4),
    },
    {
      _id: 'chat_init_2',
      userId: 'usr_student_demo',
      userName: 'Rahul Sharma',
      message: 'Where is the library located?',
      response: 'The Central Library is located on the 2nd Floor of the Academic Block (Block A), right next to the Central Seminar Hall.',
      category: 'Library',
      confidence: 90,
      timestamp: new Date(Date.now() - 3600000 * 2),
    },
  ],
};

export const storageService = {
  // Users
  async findUserByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (getMongoStatus()) {
      try {
        return await User.findOne({ email: cleanEmail });
      } catch (err) {
        console.error('Mongo findUser error:', err);
      }
    }
    return inMemoryStore.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  },

  async createUser({ name, email, password, role = 'student' }) {
    const cleanEmail = email.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(password, 10);

    if (getMongoStatus()) {
      try {
        const newUser = await User.create({
          name,
          email: cleanEmail,
          password: passwordHash,
          role,
        });
        return {
          _id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
        };
      } catch (err) {
        console.error('Mongo createUser error:', err);
      }
    }

    const newUser = {
      _id: `usr_${Date.now()}`,
      name,
      email: cleanEmail,
      passwordHash,
      role,
      createdAt: new Date(),
    };
    inMemoryStore.users.push(newUser);
    return {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
  },

  async verifyPassword(storedUser, password) {
    const hash = storedUser.password || storedUser.passwordHash;
    if (!hash) return false;
    return bcrypt.compare(password, hash);
  },

  // FAQs
  async getAllFaqs({ search = '', category = '' } = {}) {
    let list = [];
    if (getMongoStatus()) {
      try {
        const query = {};
        if (category && category !== 'All') {
          query.category = category;
        }
        if (search) {
          query.$or = [
            { question: { $regex: search, $options: 'i' } },
            { answer: { $regex: search, $options: 'i' } },
            { keywords: { $regex: search, $options: 'i' } },
          ];
        }
        list = await FAQ.find(query).sort({ createdAt: -1 });
        return list;
      } catch (err) {
        console.error('Mongo getAllFaqs error:', err);
      }
    }

    list = [...inMemoryStore.faqs];
    if (category && category !== 'All') {
      list = list.filter(f => f.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        f =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          (f.keywords && f.keywords.some(k => k.toLowerCase().includes(q)))
      );
    }
    return list;
  },

  async createFaq({ question, answer, category, keywords = [] }) {
    if (getMongoStatus()) {
      try {
        return await FAQ.create({ question, answer, category, keywords });
      } catch (err) {
        console.error('Mongo createFaq error:', err);
      }
    }

    const newFaq = {
      _id: `faq_${Date.now()}`,
      question,
      answer,
      category: category || 'General',
      keywords: Array.isArray(keywords)
        ? keywords
        : (keywords || '').split(',').map(k => k.trim()).filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryStore.faqs.unshift(newFaq);
    return newFaq;
  },

  async updateFaq(id, { question, answer, category, keywords }) {
    if (getMongoStatus()) {
      try {
        return await FAQ.findByIdAndUpdate(
          id,
          { question, answer, category, keywords },
          { new: true }
        );
      } catch (err) {
        console.error('Mongo updateFaq error:', err);
      }
    }

    const index = inMemoryStore.faqs.findIndex(f => f._id === id);
    if (index === -1) return null;

    const current = inMemoryStore.faqs[index];
    const updated = {
      ...current,
      question: question !== undefined ? question : current.question,
      answer: answer !== undefined ? answer : current.answer,
      category: category !== undefined ? category : current.category,
      keywords: keywords !== undefined ? keywords : current.keywords,
      updatedAt: new Date(),
    };
    inMemoryStore.faqs[index] = updated;
    return updated;
  },

  async deleteFaq(id) {
    if (getMongoStatus()) {
      try {
        await FAQ.findByIdAndDelete(id);
        return true;
      } catch (err) {
        console.error('Mongo deleteFaq error:', err);
      }
    }

    const initialLen = inMemoryStore.faqs.length;
    inMemoryStore.faqs = inMemoryStore.faqs.filter(f => f._id !== id);
    return inMemoryStore.faqs.length < initialLen;
  },

  // Chat History
  async saveChatMessage({ userId, userName, message, response, category, confidence }) {
    const entry = {
      _id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId: userId || 'anonymous',
      userName: userName || 'Student',
      message,
      response,
      category: category || 'General',
      confidence: confidence || 0,
      timestamp: new Date(),
    };

    if (getMongoStatus()) {
      try {
        await ChatHistory.create(entry);
      } catch (err) {
        console.error('Mongo saveChat error:', err);
      }
    }

    inMemoryStore.chatHistory.unshift(entry);
    return entry;
  },

  async getChatHistory(userId = null) {
    if (getMongoStatus()) {
      try {
        const query = userId ? { userId } : {};
        return await ChatHistory.find(query).sort({ timestamp: -1 });
      } catch (err) {
        console.error('Mongo getChatHistory error:', err);
      }
    }

    if (!userId) {
      return [...inMemoryStore.chatHistory];
    }
    return inMemoryStore.chatHistory.filter(c => c.userId === userId);
  },

  async clearChatHistory(userId) {
    if (getMongoStatus()) {
      try {
        const query = userId ? { userId } : {};
        await ChatHistory.deleteMany(query);
      } catch (err) {
        console.error('Mongo clearChatHistory error:', err);
      }
    }

    if (userId) {
      inMemoryStore.chatHistory = inMemoryStore.chatHistory.filter(c => c.userId !== userId);
    } else {
      inMemoryStore.chatHistory = [];
    }
    return true;
  },

  // Admin Dashboard stats
  async getAdminStats() {
    const faqs = await this.getAllFaqs();
    const chats = await this.getChatHistory();
    const students = inMemoryStore.users.filter(u => u.role === 'student');

    return {
      totalStudents: Math.max(students.length, 128), // realistic count for prototype demo
      totalFaqs: faqs.length,
      totalQuestions: chats.length + 342, // demo baseline
      recentQuestions: chats.slice(0, 10),
      categoriesCount: faqs.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
      }, {}),
    };
  },
};
