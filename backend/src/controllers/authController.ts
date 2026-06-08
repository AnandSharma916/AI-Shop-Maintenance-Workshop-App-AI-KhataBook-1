import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';
import { sendOtpEmail } from '../utils/emailService';

const JWT_SECRET = process.env.JWT_SECRET || 'shivshakti_super_secret_key';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, photo: user.photo }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await prisma.otpRecord.upsert({
      where: { email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt }
    });

    const emailSent = await sendOtpEmail(email, otp);
    
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP email. Please check server configuration.' });
    }

    res.json({ message: 'OTP sent successfully to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, otp } = req.body;
    
    if (!otp) return res.status(400).json({ message: 'OTP is required' });

    const storedOtpData = await prisma.otpRecord.findUnique({ where: { email } });
    if (!storedOtpData) {
      return res.status(400).json({ message: 'No OTP found or expired. Please request a new one.' });
    }

    if (new Date() > storedOtpData.expiresAt) {
      await prisma.otpRecord.delete({ where: { email } });
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name: name || email.split('@')[0],
        email,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    await prisma.otpRecord.delete({ where: { email } });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({ 
      message: 'Account created successfully', 
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create account' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
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
};
