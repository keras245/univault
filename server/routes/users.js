import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { logAction } from '../middleware/auditLog.js';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserStats,
} from '../controllers/userController.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes pour les admins et super-admins
router.get('/', authorize('admin', 'super-admin'), logAction('list_users', 'user'), getUsers);
router.get('/stats', authorize('admin', 'super-admin'), getUserStats);
router.get('/:id', authorize('admin', 'super-admin'), getUserById);
router.post('/', authorize('admin', 'super-admin'), logAction('create_user', 'user'), createUser);
router.put('/:id', authorize('admin', 'super-admin'), logAction('update_user', 'user'), updateUser);

// Route pour super-admin seulement
router.delete('/:id', authorize('super-admin'), logAction('delete_user', 'user'), deleteUser);

export default router;
