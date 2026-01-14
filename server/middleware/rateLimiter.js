import rateLimit from 'express-rate-limit';

// Rate limiter pour les tentatives de connexion
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives maximum
    message: {
        success: false,
        message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter pour les uploads
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 20, // 20 uploads maximum par heure
    message: {
        success: false,
        message: 'Limite d\'uploads atteinte. Veuillez réessayer plus tard.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter général pour l'API
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes maximum
    message: {
        success: false,
        message: 'Trop de requêtes. Veuillez réessayer plus tard.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
