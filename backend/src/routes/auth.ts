import { Router } from 'express';
import { login, sendOtp, register, updateProfile, forgotPassword, resetPassword } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/register', register);
router.put('/profile', updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
