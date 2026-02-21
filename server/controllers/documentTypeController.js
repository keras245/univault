import DocumentType from '../models/DocumentType.js';

export const createDocumentType = async (req, res) => {
    try {
        const { name } = req.body;
        const service = req.user.role === 'super-admin' ? req.body.service : req.user.service;

        if (!name || !service) {
            return res.status(400).json({ success: false, message: 'Nom et service requis' });
        }

        const existing = await DocumentType.findOne({ name: name.trim(), service });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Ce type existe déjà pour ce service'
            });
        }

        const documentType = await DocumentType.create({ name: name.trim(), service });

        res.status(201).json({ success: true, data: documentType });
    } catch (error) {
        console.error('Erreur création type:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllDocumentTypes = async (req, res) => {
    try {
        const { search } = req.query;
        const filter = { isActive: true };

        // Admin voit uniquement son service, super-admin voit tout
        if (req.user.role !== 'super-admin') {
            filter.service = req.user.service;
        }

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        const types = await DocumentType.find(filter).sort({ service: 1, name: 1 });

        res.json({ success: true, data: types, count: types.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getDocumentTypeById = async (req, res) => {
    try {
        const type = await DocumentType.findById(req.params.id);
        if (!type) return res.status(404).json({ success: false, message: 'Type non trouvé' });

        res.json({ success: true, data: type });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateDocumentType = async (req, res) => {
    try {
        const type = await DocumentType.findById(req.params.id);
        if (!type) return res.status(404).json({ success: false, message: 'Type non trouvé' });

        // Admin ne peut modifier que les types de son service
        if (req.user.role !== 'super-admin' && type.service !== req.user.service) {
            return res.status(403).json({ success: false, message: 'Accès refusé' });
        }

        const { name, isActive } = req.body;
        if (name) type.name = name.trim();
        if (isActive !== undefined) type.isActive = isActive;

        await type.save();

        res.json({ success: true, data: type });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteDocumentType = async (req, res) => {
    try {
        const type = await DocumentType.findById(req.params.id);
        if (!type) return res.status(404).json({ success: false, message: 'Type non trouvé' });

        if (req.user.role !== 'super-admin' && type.service !== req.user.service) {
            return res.status(403).json({ success: false, message: 'Accès refusé' });
        }

        // Soft delete
        type.isActive = false;
        await type.save();

        res.json({ success: true, message: 'Type supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};