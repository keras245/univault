import Document from '../models/Document.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import fs from 'fs/promises';

/**
 * @route   POST /api/documents/upload
 * @desc    Upload un nouveau document
 * @access  Private
 */
export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni.',
            });
        }

        const { title, description, service, category, metadata, tags, status } = req.body;

        // Vérifier que l'utilisateur a accès au service
        if (req.user.role !== 'super-admin' && req.user.service !== service) {
            // Supprimer le fichier temporaire
            await fs.unlink(req.file.path);

            return res.status(403).json({
                success: false,
                message: 'Vous ne pouvez pas uploader de documents pour ce service.',
            });
        }

        // Upload vers Cloudinary
        const cloudinaryResult = await uploadToCloudinary(
            req.file.path,
            `univault/${service}`
        );

        // Supprimer le fichier temporaire
        await fs.unlink(req.file.path);

        // Parser les métadonnées si c'est une string JSON
        let parsedMetadata = {};
        if (metadata) {
            try {
                parsedMetadata = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
            } catch (error) {
                console.error('Erreur parsing metadata:', error);
            }
        }

        // Parser les tags si c'est une string JSON
        let parsedTags = [];
        if (tags) {
            try {
                parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
            } catch (error) {
                console.error('Erreur parsing tags:', error);
            }
        }

        // Créer le document dans la base de données
        const document = await Document.create({
            title,
            description,
            service,
            category,
            fileUrl: cloudinaryResult.url,
            fileType: cloudinaryResult.format,
            fileSize: cloudinaryResult.size,
            cloudinaryId: cloudinaryResult.publicId,
            metadata: parsedMetadata,
            tags: parsedTags,
            status: status || 'draft',
            uploadedBy: req.user._id,
            versions: [{
                version: 1,
                fileUrl: cloudinaryResult.url,
                cloudinaryId: cloudinaryResult.publicId,
                uploadedBy: req.user._id,
            }],
        });

        // Peupler les informations de l'utilisateur
        await document.populate('uploadedBy', 'firstName lastName email');

        res.status(201).json({
            success: true,
            message: 'Document uploadé avec succès.',
            data: {
                document,
            },
        });
    } catch (error) {
        console.error('Erreur uploadDocument:', error);

        // Supprimer le fichier temporaire en cas d'erreur
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Erreur suppression fichier temporaire:', unlinkError);
            }
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload du document.',
            error: error.message,
        });
    }
};

/**
 * @route   GET /api/documents
 * @desc    Obtenir la liste des documents (avec filtres)
 * @access  Private
 */
export const getDocuments = async (req, res) => {
    try {
        const {
            service,
            category,
            status,
            search,
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;

        // Construire le filtre
        const filter = {};

        // Filtrer par service (sauf pour super-admin)
        if (req.user.role !== 'super-admin') {
            filter.service = req.user.service;
        } else if (service) {
            filter.service = service;
        }

        if (category) filter.category = category;
        if (status) filter.status = status;

        // Recherche textuelle
        if (search) {
            filter.$text = { $search: search };
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Tri
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Requête
        const documents = await Document.find(filter)
            .populate('uploadedBy', 'firstName lastName email')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Document.countDocuments(filter);

        res.json({
            success: true,
            data: {
                documents,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        console.error('Erreur getDocuments:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des documents.',
            error: error.message,
        });
    }
};

/**
 * @route   GET /api/documents/:id
 * @desc    Obtenir les détails d'un document
 * @access  Private
 */
export const getDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate('uploadedBy', 'firstName lastName email')
            .populate('versions.uploadedBy', 'firstName lastName email');

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document non trouvé.',
            });
        }

        // Vérifier l'accès au service
        if (req.user.role !== 'super-admin' && document.service !== req.user.service) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé à ce document.',
            });
        }

        res.json({
            success: true,
            data: {
                document,
            },
        });
    } catch (error) {
        console.error('Erreur getDocument:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du document.',
            error: error.message,
        });
    }
};

/**
 * @route   PUT /api/documents/:id
 * @desc    Mettre à jour les métadonnées d'un document
 * @access  Private
 */
export const updateDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document non trouvé.',
            });
        }

        // Vérifier l'accès
        if (
            req.user.role !== 'super-admin' &&
            req.user.role !== 'admin' &&
            document.uploadedBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé.',
            });
        }

        const { title, description, category, metadata, tags, status } = req.body;

        // Mettre à jour les champs
        if (title) document.title = title;
        if (description) document.description = description;
        if (category) document.category = category;
        if (metadata) document.metadata = { ...document.metadata, ...metadata };
        if (tags) document.tags = tags;
        if (status) document.status = status;

        await document.save();

        res.json({
            success: true,
            message: 'Document mis à jour avec succès.',
            data: {
                document,
            },
        });
    } catch (error) {
        console.error('Erreur updateDocument:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du document.',
            error: error.message,
        });
    }
};

/**
 * @route   DELETE /api/documents/:id
 * @desc    Supprimer un document
 * @access  Private (Admin ou propriétaire)
 */
export const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document non trouvé.',
            });
        }

        // Vérifier l'accès
        if (
            req.user.role !== 'super-admin' &&
            req.user.role !== 'admin' &&
            document.uploadedBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé.',
            });
        }

        // Supprimer de Cloudinary
        try {
            await deleteFromCloudinary(document.cloudinaryId);

            // Supprimer aussi toutes les versions
            for (const version of document.versions) {
                if (version.cloudinaryId !== document.cloudinaryId) {
                    await deleteFromCloudinary(version.cloudinaryId);
                }
            }
        } catch (cloudinaryError) {
            console.error('Erreur suppression Cloudinary:', cloudinaryError);
        }

        // Supprimer de la base de données
        await document.deleteOne();

        res.json({
            success: true,
            message: 'Document supprimé avec succès.',
        });
    } catch (error) {
        console.error('Erreur deleteDocument:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du document.',
            error: error.message,
        });
    }
};

/**
 * @route   POST /api/documents/:id/version
 * @desc    Ajouter une nouvelle version d'un document
 * @access  Private
 */
export const addDocumentVersion = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni.',
            });
        }

        const document = await Document.findById(req.params.id);

        if (!document) {
            await fs.unlink(req.file.path);
            return res.status(404).json({
                success: false,
                message: 'Document non trouvé.',
            });
        }

        // Vérifier l'accès
        if (req.user.role !== 'super-admin' && document.service !== req.user.service) {
            await fs.unlink(req.file.path);
            return res.status(403).json({
                success: false,
                message: 'Accès refusé.',
            });
        }

        // Upload vers Cloudinary
        const cloudinaryResult = await uploadToCloudinary(
            req.file.path,
            `univault/${document.service}`
        );

        // Supprimer le fichier temporaire
        await fs.unlink(req.file.path);

        // Calculer le numéro de version
        const newVersionNumber = document.versions.length + 1;

        // Ajouter la nouvelle version
        document.versions.push({
            version: newVersionNumber,
            fileUrl: cloudinaryResult.url,
            cloudinaryId: cloudinaryResult.publicId,
            uploadedBy: req.user._id,
        });

        // Mettre à jour le fichier principal
        document.fileUrl = cloudinaryResult.url;
        document.cloudinaryId = cloudinaryResult.publicId;
        document.fileType = cloudinaryResult.format;
        document.fileSize = cloudinaryResult.size;

        await document.save();

        res.json({
            success: true,
            message: 'Nouvelle version ajoutée avec succès.',
            data: {
                document,
            },
        });
    } catch (error) {
        console.error('Erreur addDocumentVersion:', error);

        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Erreur suppression fichier temporaire:', unlinkError);
            }
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout de la version.',
            error: error.message,
        });
    }
};
