import express from 'express';
import {
    createDocumentType,
    getAllDocumentTypes,
    getDocumentTypeById,
    updateDocumentType,
    deleteDocumentType,
    getDocumentTypeStats
} from '../controllers/documentTypeController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes publiques (tous les utilisateurs authentifiés)
router.get('/', getAllDocumentTypes);
router.get('/stats', getDocumentTypeStats);
router.get('/:id', getDocumentTypeById);

// Routes admin uniquement
router.post('/', authorize(['admin', 'super-admin']), createDocumentType);
router.put('/:id', authorize(['admin', 'super-admin']), updateDocumentType);
router.delete('/:id', authorize(['admin', 'super-admin']), deleteDocumentType);

export default router;
