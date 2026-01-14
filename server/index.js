import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import connectDB from './config/database.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import fs from 'fs';
import path from 'path';

// Import des routes
import authRoutes from './routes/auth.js';
import documentRoutes from './routes/documents.js';
import studentRoutes from './routes/students.js';
import letterRoutes from './routes/letters.js';
import searchRoutes from './routes/search.js';

// Initialisation de l'application
const app = express();

// Connexion à la base de données
connectDB();

// Créer le dossier uploads/temp s'il n'existe pas
const uploadDir = './uploads/temp';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware de sécurité
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate limiting général
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/letters', letterRoutes);
app.use('/api/search', searchRoutes);

// Route de test
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API UniVault - Système d\'archivage numérique UNC',
        version: '1.0.0',
    });
});

// Route de santé
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
    });
});

// Gestion des routes non trouvées
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
    });
});

// Middleware de gestion des erreurs globale
app.use((err, req, res, next) => {
    console.error('Erreur globale:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erreur serveur interne',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏛️  UniVault API Server                                ║
║                                                           ║
║   📡 Serveur démarré sur le port ${PORT}                    ║
║   🌍 Environnement: ${process.env.NODE_ENV || 'development'}                      ║
║   📚 Documentation: http://localhost:${PORT}/                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
    console.error('❌ Erreur non gérée:', err);
    process.exit(1);
});

export default app;
