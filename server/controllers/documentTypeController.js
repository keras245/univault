import DocumentType from '../models/DocumentType.js';
import Service from '../models/Service.js';

// Créer un type de document
export const createDocumentType = async (req, res) => {
    try {
        const { name, service } = req.body;

        // Vérifier que le service existe
        const serviceExists = await Service.findById(service);
        if (!serviceExists) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }

        // Vérifier si le type existe déjà pour ce service
        const existingType = await DocumentType.findOne({ name, service });
        if (existingType) {
            return res.status(400).json({
                success: false,
                message: 'Ce type de document existe déjà pour ce service'
            });
        }

        const documentType = await DocumentType.create({
            name,
            service
        });

        await documentType.populate('service', 'name code');

        res.status(201).json({
            success: true,
            message: 'Type de document créé avec succès',
            data: documentType
        });
    } catch (error) {
        console.error('Erreur création type de document:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du type de document'
        });
    }
};

// Obtenir tous les types de documents
export const getAllDocumentTypes = async (req, res) => {
    try {
        const { service, search } = req.query;
        const query = { isActive: true };

        // Filtrer par service si fourni
        if (service) {
            query.service = service;
        }

        // Recherche par nom
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const documentTypes = await DocumentType.find(query)
            .populate('service', 'name code')
            .sort({ name: 1 });

        res.json({
            success: true,
            data: documentTypes,
            count: documentTypes.length
        });
    } catch (error) {
        console.error('Erreur récupération types de documents:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des types de documents'
        });
    }
};

// Obtenir un type de document par ID
export const getDocumentTypeById = async (req, res) => {
    try {
        const documentType = await DocumentType.findById(req.params.id)
            .populate('service', 'name code');

        if (!documentType) {
            return res.status(404).json({
                success: false,
                message: 'Type de document non trouvé'
            });
        }

        res.json({
            success: true,
            data: documentType
        });
    } catch (error) {
        console.error('Erreur récupération type de document:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du type de document'
        });
    }
};

// Mettre à jour un type de document
export const updateDocumentType = async (req, res) => {
    try {
        const { name, service } = req.body;

        // Vérifier que le service existe si fourni
        if (service) {
            const serviceExists = await Service.findById(service);
            if (!serviceExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Service non trouvé'
                });
            }
        }

        const documentType = await DocumentType.findByIdAndUpdate(
            req.params.id,
            { name, service },
            { new: true, runValidators: true }
        ).populate('service', 'name code');

        if (!documentType) {
            return res.status(404).json({
                success: false,
                message: 'Type de document non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Type de document mis à jour avec succès',
            data: documentType
        });
    } catch (error) {
        console.error('Erreur mise à jour type de document:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du type de document'
        });
    }
};

// Supprimer un type de document (soft delete)
export const deleteDocumentType = async (req, res) => {
    try {
        const documentType = await DocumentType.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!documentType) {
            return res.status(404).json({
                success: false,
                message: 'Type de document non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Type de document supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur suppression type de document:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du type de document'
        });
    }
};

// Obtenir les statistiques des types de documents
export const getDocumentTypeStats = async (req, res) => {
    try {
        const total = await DocumentType.countDocuments({ isActive: true });
        const byService = await DocumentType.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$service',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'services',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'service'
                }
            },
            { $unwind: '$service' },
            {
                $project: {
                    serviceName: '$service.name',
                    count: 1
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                total,
                byService
            }
        });
    } catch (error) {
        console.error('Erreur statistiques types de documents:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques'
        });
    }
};
