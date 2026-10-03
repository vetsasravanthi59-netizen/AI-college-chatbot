import jwt from 'jsonwebtoken';
import { storageService } from '../services/storageService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ai_college_chatbot_jwt_secret_key_2026_cse_project';

export async function register(req, res) {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // Check if email already exists
    const existing = await storageService.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const assignedRole = role === 'admin' ? 'admin' : 'student';
    const newUser = await storageService.createUser({
      name,
      email,
      password,
      role: assignedRole,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'An unexpected error occurred during registration.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await storageService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await storageService.verifyPassword(user, password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'An unexpected error occurred during login.' });
  }
}

export async function getMe(req, res) {
  try {
    const user = await storageService.findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving user profile.' });
  }
}
