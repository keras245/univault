import Document from '../models/Document.js';

/**
 * @route   GET /api/search
 * @desc    Recherche avancée multi-critères
 * @access  Private
 */
export const searchDocuments = async (req, res) => {
    try {
        const {
            query,
            service,
            category,
            status,
            dateFrom,
            dateTo,
            tags,
            studentMatricule,
            letterReference,
            page = 1,
            limit = 20,
        } = req.query;

        // Construire le filtre
        const filter = {};

        // Filtrer par service (sauf pour super-admin)
        if (req.user.role !== 'super-admin') {
            filter.service = req.user.service;
        } else if (service) {
            filter.service = service;
        }

        // Filtres de base
        if (category) filter.category = category;
        if (status) filter.status = status;

        // Recherche textuelle
        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
            ];
        }

        // Filtres de date
        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) filter.createdAt.$lte = new Date(dateTo);
        }

        // Filtres par tags
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : tags.split(',');
            filter.tags = { $in: tagArray };
        }

        // Filtres spécifiques par service
        if (studentMatricule) {
            filter['metadata.studentMatricule'] = studentMatricule;
        }

        if (letterReference) {
            filter['metadata.letterReference'] = letterReference;
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Requête
        const documents = await Document.find(filter)
            .populate('uploadedBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
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
        console.error('Erreur searchDocuments:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la recherche.',
            error: error.message,
        });
    }
};

/**
 * @route   GET /api/search/suggestions
 * @desc    Suggestions pour l'auto-complétion
 * @access  Private
 */
export const getSuggestions = async (req, res) => {
    try {
        const { query, type = 'title' } = req.query;

        if (!query || query.length < 2) {
            return res.json({
                success: true,
                data: {
                    suggestions: [],
                },
            });
        }

        const filter = {};

        // Filtrer par service
        if (req.user.role !== 'super-admin') {
            filter.service = req.user.service;
        }

        let suggestions = [];

        if (type === 'title') {
            suggestions = await Document.find({
                ...filter,
                title: { $regex: query, $options: 'i' },
            })
                .select('title')
                .limit(10)
                .lean();

            suggestions = suggestions.map(doc => doc.title);
        } else if (type === 'tags') {
            const docs = await Document.find(filter)
                .select('tags')
                .lean();

            const allTags = docs.flatMap(doc => doc.tags || []);
            const uniqueTags = [...new Set(allTags)];
            suggestions = uniqueTags.filter(tag =>
                tag.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 10);
        }

        res.json({
            success: true,
            data: {
                suggestions,
            },
        });
    } catch (error) {
        console.error('Erreur getSuggestions:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des suggestions.',
            error: error.message,
        });
    }
};
