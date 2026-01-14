import express from 'express';
import {
    createLetter,
    getLetters,
    getLetterByReference,
    processLetter,
    getPendingLetters,
} from '../controllers/letterController.js';
import { authenticate } from '../middleware/auth.js';
import { logAction } from '../middleware/auditLog.js';

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticate);

// Obtenir les courriers en attente (doit être avant /:reference)
router.get('/pending', getPendingLetters);

// Créer un courrier
router.post(
    '/',
    logAction('create', 'letter'),
    createLetter
);

// Liste des courriers
router.get('/', getLetters);

// Obtenir un courrier par référence
router.get(
    '/:reference',
    logAction('view', 'letter'),
    getLetterByReference
);

// Marquer un courrier comme traité
router.put(
    '/:id/process',
    logAction('update', 'letter'),
    processLetter
);

export default router;
