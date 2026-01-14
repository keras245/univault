import express from 'express';
import {
    searchDocuments,
    getSuggestions,
} from '../controllers/searchController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticate);

// Recherche avancée
router.get('/', searchDocuments);

// Suggestions pour auto-complétion
router.get('/suggestions', getSuggestions);

export default router;
