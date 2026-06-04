import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';

import { sendOtpEmail } from '../utils/emailService';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'shivshakti_super_secret_key';

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, photo: user.photo }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// In-memory OTP store (email -> OTP data)
const otpStore = new Map<string, { otp: string, expiresAt: number }>();

// Send OTP Route
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP for 10 minutes
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    // Send Real Email OTP
    const emailSent = await sendOtpEmail(email, otp);
    
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP email. Please check server configuration.' });
    }

    res.json({ message: 'OTP sent successfully to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    
    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    const storedOtpData = otpStore.get(email);
    if (!storedOtpData) {
      return res.status(400).json({ message: 'No OTP found or expired. Please request a new one.' });
    }

    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name: name || email.split('@')[0],
        email,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    // Clear OTP after successful registration
    otpStore.delete(email);

    // Generate Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'Account created successfully', 
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create account' });
  }
});

// Update Profile Route
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    const { name, email, password, photo } = req.body;
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (photo) updateData.photo = photo;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    
    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: updateData
    });

    res.json({ message: 'Profile updated successfully', user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, photo: updatedUser.photo } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
