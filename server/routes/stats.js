import express from 'express';
import * as statsController from '../controllers/statsController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { getDashboardStats } from '../controllers/statsController.js';

const router = express.Router();

// All stats routes require authentication
router.use(authenticate);

// Dashboard statistics (accessible by all authenticated users)
router.get('/dashboard', statsController.getDashboardStats);

// Document statistics (admin and super-admin only)
router.get('/documents', authorize('admin', 'super-admin'), statsController.getDocumentStats);

// User statistics (admin and super-admin only)
router.get('/users', authorize('admin', 'super-admin'), statsController.getUserStats);

// Storage statistics (admin and super-admin only)
router.get('/storage', authorize('admin', 'super-admin'), statsController.getStorageStats);

export default router;
