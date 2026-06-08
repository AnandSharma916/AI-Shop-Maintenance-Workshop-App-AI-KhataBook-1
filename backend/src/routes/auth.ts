import { Router } from 'express';
import { login, sendOtp, register, updateProfile } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/register', register);
router.put('/profile', updateProfile);

export default router;
