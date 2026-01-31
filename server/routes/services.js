import express from 'express';
import * as serviceController from '../controllers/serviceController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all services (accessible by all authenticated users)
router.get('/', serviceController.getAllServices);

// Get single service (accessible by all authenticated users)
router.get('/:id', serviceController.getService);

// Admin and super-admin only routes
router.post('/', authorize('admin', 'super-admin'), serviceController.createService);
router.put('/:id', authorize('admin', 'super-admin'), serviceController.updateService);
router.delete('/:id', authorize('admin', 'super-admin'), serviceController.deleteService);

// Member management (admin and super-admin only)
router.post('/:id/members', authorize('admin', 'super-admin'), serviceController.addMember);
router.delete('/:id/members/:userId', authorize('admin', 'super-admin'), serviceController.removeMember);

export default router;
