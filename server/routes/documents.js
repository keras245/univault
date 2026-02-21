import express from 'express';
import {
    uploadDocument,
    getDocuments,
    getDocument,
    getAllDocumentsGlobal,
    updateDocument,
    deleteDocument,
    addDocumentVersion,
} from '../controllers/documentController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeService } from '../middleware/authorize.js';
import upload, { handleUploadError } from '../middleware/upload.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { logAction } from '../middleware/auditLog.js';

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticate);

// Upload de document
router.post(
    '/upload',
    uploadLimiter,
    upload.single('file'),
    handleUploadError,
    logAction('upload', 'document'),
    uploadDocument
);

// Liste des documents
router.get('/all', getAllDocumentsGlobal);
router.get('/', getDocuments);

// Détails d'un document
router.get(
    '/:id',
    logAction('view', 'document'),
    getDocument
);

// Mise à jour d'un document
router.put(
    '/:id',
    logAction('update', 'document'),
    updateDocument
);

// Suppression d'un document
router.delete(
    '/:id',
    logAction('delete', 'document'),
    deleteDocument
);

// Ajouter une nouvelle version
router.post(
    '/:id/version',
    uploadLimiter,
    upload.single('file'),
    handleUploadError,
    logAction('upload', 'document'),
    addDocumentVersion
);

export default router;
