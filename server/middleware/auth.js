import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware d'authentification JWT
 * Vérifie le token et attache l'utilisateur à la requête
 */
export const authenticate = async (req, res, next) => {
    try {
        // Récupérer le token du header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Accès non autorisé. Token manquant.',
            });
        }

        const token = authHeader.split(' ')[1];

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Récupérer l'utilisateur
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé.',
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Compte désactivé.',
            });
        }

        // Attacher l'utilisateur à la requête
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token invalide.',
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expiré.',
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erreur d\'authentification.',
        });
    }
};

/**
 * Génère un token JWT pour un utilisateur
 */
export const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};
