import rateLimit from 'express-rate-limit';

// Rate limiter login — par email (pas par IP)
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 👈 augmenté à 10 tentatives
    keyGenerator: (req) => req.body.email || req.ip, // 👈 par email, pas par IP
    message: {
        success: false,
        message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // 👈 ne compte pas les connexions réussies
});

// Rate limiter change-password — plus permissif
export const changePasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    keyGenerator: (req) => req.user?._id?.toString() || req.ip, // 👈 par utilisateur
    message: {
        success: false,
        message: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});

// Rate limiter uploads
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: 'Limite d\'uploads atteinte. Veuillez réessayer plus tard.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter général
export const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 200,
    message: {
        success: false,
        message: 'Trop de requêtes. Veuillez réessayer plus tard.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});