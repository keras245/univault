import express from 'express';
import {
    register,
    login,
    getMe,
    changePassword,
    logout,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { loginLimiter, changePasswordLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Routes publiques
router.post('/login', loginLimiter, login);
router.put('/change-password', authenticate, changePasswordLimiter, changePassword);

// Routes protégées
router.get('/me', authenticate, getMe);
router.put('/change-password', authenticate, changePassword);
router.post('/logout', authenticate, logout);

// Routes admin
router.post('/register', authenticate, authorize('admin', 'super-admin'), register);

export default router;
