import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { createLog } from '../middleware/auditLog.js';

/**
 * @route   POST /api/auth/register
 * @desc    Créer un nouvel utilisateur (admin seulement)
 * @access  Private (Admin/Super-Admin)
 */
export const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, service, role } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Cet email est déjà utilisé.',
            });
        }

        // Créer l'utilisateur
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            service,
            role: role || 'user',
        });

        // Logger l'action
        await createLog(req.user._id, 'create_user', 'user', {
            createdUserId: user._id,
            email: user.email,
        });

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès.',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    service: user.service,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error('Erreur register:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de l\'utilisateur.',
            error: error.message,
        });
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Connexion utilisateur
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe requis.',
            });
        }

        // Récupérer l'utilisateur avec le mot de passe
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect.',
            });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect.',
            });
        }

        // Vérifier si le compte est actif
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Compte désactivé. Contactez l\'administrateur.',
            });
        }

        // Mettre à jour la dernière connexion
        user.lastLogin = new Date();
        await user.save();

        // Générer le token
        const token = generateToken(user._id);

        // Logger la connexion
        await createLog(user._id, 'login', 'auth', {
            email: user.email,
        });

        res.json({
            success: true,
            message: 'Connexion réussie.',
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    service: user.service,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la connexion.',
            error: error.message,
        });
    }
};

/**
 * @route   GET /api/auth/me
 * @desc    Obtenir le profil de l'utilisateur connecté
 * @access  Private
 */
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            data: {
                user,
            },
        });
    } catch (error) {
        console.error('Erreur getMe:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du profil.',
            error: error.message,
        });
    }
};

/**
 * @route   PUT /api/auth/change-password
 * @desc    Changer le mot de passe
 * @access  Private
 */
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Mot de passe actuel et nouveau mot de passe requis.',
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Le nouveau mot de passe doit contenir au moins 6 caractères.',
            });
        }

        // Récupérer l'utilisateur avec le mot de passe
        const user = await User.findById(req.user._id).select('+password');

        // Vérifier le mot de passe actuel
        const isPasswordValid = await user.comparePassword(currentPassword);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Mot de passe actuel incorrect.',
            });
        }

        // Mettre à jour le mot de passe
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Mot de passe modifié avec succès.',
        });
    } catch (error) {
        console.error('Erreur changePassword:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du changement de mot de passe.',
            error: error.message,
        });
    }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Déconnexion (côté client principalement)
 * @access  Private
 */
export const logout = async (req, res) => {
    try {
        // Logger la déconnexion
        await createLog(req.user._id, 'logout', 'auth', {
            email: req.user.email,
        });

        res.json({
            success: true,
            message: 'Déconnexion réussie.',
        });
    } catch (error) {
        console.error('Erreur logout:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la déconnexion.',
            error: error.message,
        });
    }
};
