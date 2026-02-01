import User from '../models/User.js';
import { createLog } from '../middleware/auditLog.js';

/**
 * @route   GET /api/users
 * @desc    Obtenir la liste des utilisateurs avec filtres
 * @access  Private (Admin/Super-Admin)
 */
export const getUsers = async (req, res) => {
    try {
        const { role, service, isActive, search, page = 1, limit = 50 } = req.query;

        // Construire le filtre
        const filter = {};

        if (role) {
            // Gérer les tableaux de rôles (ex: role[]=admin&role[]=super-admin)
            if (Array.isArray(role)) {
                filter.role = { $in: role };
            } else {
                filter.role = role;
            }
        }

        if (service) {
            filter.service = service;
        }

        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Récupérer les utilisateurs
        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(filter);

        res.json({
            success: true,
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('Erreur getUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des utilisateurs.',
            error: error.message,
        });
    }
};

/**
 * @route   GET /api/users/:id
 * @desc    Obtenir un utilisateur par ID
 * @access  Private (Admin/Super-Admin)
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé.',
            });
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error('Erreur getUserById:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'utilisateur.',
            error: error.message,
        });
    }
};

/**
 * @route   POST /api/users
 * @desc    Créer un nouvel utilisateur
 * @access  Private (Admin/Super-Admin)
 */
export const createUser = async (req, res) => {
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
            data: user,
        });
    } catch (error) {
        console.error('Erreur createUser:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de l\'utilisateur.',
            error: error.message,
        });
    }
};

/**
 * @route   PUT /api/users/:id
 * @desc    Mettre à jour un utilisateur
 * @access  Private (Admin/Super-Admin)
 */
export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, service, role, isActive, password } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé.',
            });
        }

        // Mettre à jour les champs
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (service) user.service = service;
        if (role) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;
        
        // Mettre à jour le mot de passe si fourni
        if (password && password.trim() !== '') {
            user.password = password;
        }

        await user.save();

        // Logger l'action
        await createLog(req.user._id, 'update_user', 'user', {
            updatedUserId: user._id,
            email: user.email,
        });

        res.json({
            success: true,
            message: 'Utilisateur mis à jour avec succès.',
            data: user,
        });
    } catch (error) {
        console.error('Erreur updateUser:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de l\'utilisateur.',
            error: error.message,
        });
    }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Supprimer un utilisateur
 * @access  Private (Super-Admin seulement)
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé.',
            });
        }

        // Empêcher la suppression de son propre compte
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Vous ne pouvez pas supprimer votre propre compte.',
            });
        }

        await user.deleteOne();

        // Logger l'action
        await createLog(req.user._id, 'delete_user', 'user', {
            deletedUserId: user._id,
            email: user.email,
        });

        res.json({
            success: true,
            message: 'Utilisateur supprimé avec succès.',
        });
    } catch (error) {
        console.error('Erreur deleteUser:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'utilisateur.',
            error: error.message,
        });
    }
};

/**
 * @route   GET /api/users/stats
 * @desc    Obtenir les statistiques des utilisateurs
 * @access  Private (Admin/Super-Admin)
 */
export const getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const adminUsers = await User.countDocuments({ role: { $in: ['admin', 'super-admin'] } });

        // Utilisateurs par service
        const usersByService = await User.aggregate([
            { $group: { _id: '$service', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        // Utilisateurs par rôle
        const usersByRole = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } },
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                adminUsers,
                usersByService,
                usersByRole,
            },
        });
    } catch (error) {
        console.error('Erreur getUserStats:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques.',
            error: error.message,
        });
    }
};
