import express from 'express';
import {
    getStudentByMatricule,
    getStudentDocuments,
} from '../controllers/studentController.js';
import { authenticate } from '../middleware/auth.js';
import { logAction } from '../middleware/auditLog.js';

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticate);

// Rechercher un étudiant par matricule
router.get(
    '/:matricule',
    logAction('view', 'student'),
    getStudentByMatricule
);

// Obtenir les documents d'un étudiant
router.get(
    '/:matricule/documents',
    logAction('view', 'student'),
    getStudentDocuments
);

export default router;
