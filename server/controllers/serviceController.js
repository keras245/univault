import Service from '../models/Service.js';
import User from '../models/User.js';

/**
 * Get all services
 */
export const getAllServices = async (req, res) => {
    try {
        const { isActive } = req.query;

        const filter = {};
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        const services = await Service.find(filter)
            .populate('responsable', 'firstName lastName email')
            .populate('members', 'firstName lastName email')
            .sort({ name: 1 });

        res.json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des services',
            error: error.message
        });
    }
};

/**
 * Get single service
 */
export const getService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('responsable', 'firstName lastName email')
            .populate('members', 'firstName lastName email');

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }

        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du service',
            error: error.message
        });
    }
};

/**
 * Create new service
 */
export const createService = async (req, res) => {
    try {
        const { name, code, description, responsable, members, documentTypes } = req.body;

        // Check if service with same code already exists
        const existingService = await Service.findOne({ code });
        if (existingService) {
            return res.status(400).json({
                success: false,
                message: 'Un service avec ce code existe déjà'
            });
        }

        // Verify responsable exists if provided
        if (responsable) {
            const responsableUser = await User.findById(responsable);
            if (!responsableUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Responsable non trouvé'
                });
            }
        }

        const service = await Service.create({
            name,
            code,
            description,
            responsable,
            members: members || [],
            documentTypes: documentTypes || []
        });

        const populatedService = await Service.findById(service._id)
            .populate('responsable', 'firstName lastName email')
            .populate('members', 'firstName lastName email');

        res.status(201).json({
            success: true,
            data: populatedService
        });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du service',
            error: error.message
        });
    }
};

/**
 * Update service
 */
export const updateService = async (req, res) => {
    try {
        const { name, code, description, responsable, members, documentTypes, isActive } = req.body;

        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }

        // Check if new code conflicts with existing service
        if (code && code !== service.code) {
            const existingService = await Service.findOne({ code });
            if (existingService) {
                return res.status(400).json({
                    success: false,
                    message: 'Un service avec ce code existe déjà'
                });
            }
        }

        // Verify responsable exists if provided
        if (responsable) {
            const responsableUser = await User.findById(responsable);
            if (!responsableUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Responsable non trouvé'
                });
            }
        }

        // Update fields
        if (name) service.name = name;
        if (code) service.code = code;
        if (description !== undefined) service.description = description;
        if (responsable !== undefined) service.responsable = responsable;
        if (members !== undefined) service.members = members;
        if (documentTypes !== undefined) service.documentTypes = documentTypes;
        if (isActive !== undefined) service.isActive = isActive;

        await service.save();

        const updatedService = await Service.findById(service._id)
            .populate('responsable', 'firstName lastName email')
            .populate('members', 'firstName lastName email');

        res.json({
            success: true,
            data: updatedService
        });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du service',
            error: error.message
        });
    }
};

/**
 * Delete service
 */
export const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }

        await service.deleteOne();

        res.json({
            success: true,
            message: 'Service supprimé avec succès'
        });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du service',
            error: error.message
        });
    }
};

/**
 * Add member to service
 */
export const addMember = async (req, res) => {
    try {
        const { userId } = req.body;

        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Check if already a member
        if (service.members.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Cet utilisateur est déjà membre du service'
            });
        }

        service.members.push(userId);
        await service.save();

        const updatedService = await Service.findById(service._id)
            .populate('responsable', 'firstName lastName email')
            .populate('members', 'firstName lastName email');

        res.json({
            success: true,
            data: updatedService
        });
    } catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout du membre',
            error: error.message
        });
    }
};

/**
 * Remove member from service
 */
export const removeMember = async (req, res) => {
    try {
        const { userId } = req.params;

        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }

        service.members = service.members.filter(
            member => member.toString() !== userId
        );

        await service.save();

        const updatedService = await Service.findById(service._id)
            .populate('responsable', 'firstName lastName email')
            .populate('members', 'firstName lastName email');

        res.json({
            success: true,
            data: updatedService
        });
    } catch (error) {
        console.error('Error removing member:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du membre',
            error: error.message
        });
    }
};
