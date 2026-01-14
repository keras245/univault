import Letter from '../models/Letter.js';
import Document from '../models/Document.js';

/**
 * @route   POST /api/letters
 * @desc    Créer un nouveau courrier
 * @access  Private (RH)
 */
export const createLetter = async (req, res) => {
    try {
        const { subject, sender, recipient, documentId, notes } = req.body;

        // Vérifier que l'utilisateur appartient au service RH
        if (req.user.service !== 'Ressources Humaines' && req.user.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès réservé au service RH.',
            });
        }

        // Vérifier que le document existe
        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document non trouvé.',
            });
        }

        // Créer le courrier (la référence sera générée automatiquement)
        const letter = await Letter.create({
            subject,
            sender,
            recipient,
            document: documentId,
            notes,
        });

        await letter.populate('document');

        res.status(201).json({
            success: true,
            message: 'Courrier créé avec succès.',
            data: {
                letter,
            },
        });
    } catch (error) {
        console.error('Erreur createLetter:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du courrier.',
            error: error.message,
        });
    }
};

/**
 * @route   GET /api/letters
 * @desc    Obtenir la liste des courriers
 * @access  Private (RH)
 */
export const getLetters = async (req, res) => {
    try {
        // Vérifier que l'utilisateur appartient au service RH
        if (req.user.service !== 'Ressources Humaines' && req.user.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès réservé au service RH.',
            });
        }

        const { status, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (status) filter.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const letters = await Letter.find(filter)
            .populate('document')
            .populate('processedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Letter.countDocuments(filter);

        res.json({
            success: true,
            data: {
                letters,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        console.error('Erreur getLetters:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des courriers.',
            error: error.message,
        });
    }
};

/**
 * @route   GET /api/letters/:reference
 * @desc    Obtenir un courrier par référence
 * @access  Private (RH)
 */
export const getLetterByReference = async (req, res) => {
    try {
        // Vérifier que l'utilisateur appartient au service RH
        if (req.user.service !== 'Ressources Humaines' && req.user.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès réservé au service RH.',
            });
        }

        const { reference } = req.params;

        const letter = await Letter.findOne({ reference })
            .populate('document')
            .populate('processedBy', 'firstName lastName');

        if (!letter) {
            return res.status(404).json({
                success: false,
                message: 'Courrier non trouvé.',
            });
        }

        res.json({
            success: true,
            data: {
                letter,
            },
        });
    } catch (error) {
        console.error('Erreur getLetterByReference:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du courrier.',
            error: error.message,
        });
    }
};

/**
 * @route   PUT /api/letters/:id/process
 * @desc    Marquer un courrier comme traité
 * @access  Private (RH)
 */
export const processLetter = async (req, res) => {
    try {
        // Vérifier que l'utilisateur appartient au service RH
        if (req.user.service !== 'Ressources Humaines' && req.user.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès réservé au service RH.',
            });
        }

        const { id } = req.params;
        const { notes } = req.body;

        const letter = await Letter.findById(id);

        if (!letter) {
            return res.status(404).json({
                success: false,
                message: 'Courrier non trouvé.',
            });
        }

        letter.status = 'processed';
        letter.processedBy = req.user._id;
        letter.processedAt = new Date();
        if (notes) letter.notes = notes;

        await letter.save();
        await letter.populate('document');
        await letter.populate('processedBy', 'firstName lastName');

        res.json({
            success: true,
            message: 'Courrier marqué comme traité.',
            data: {
                letter,
            },
        });
    } catch (error) {
        console.error('Erreur processLetter:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du traitement du courrier.',
            error: error.message,
        });
    }
};

/**
 * @route   GET /api/letters/pending
 * @desc    Obtenir les courriers en attente
 * @access  Private (RH)
 */
export const getPendingLetters = async (req, res) => {
    try {
        // Vérifier que l'utilisateur appartient au service RH
        if (req.user.service !== 'Ressources Humaines' && req.user.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès réservé au service RH.',
            });
        }

        const letters = await Letter.find({ status: 'pending' })
            .populate('document')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                letters,
                total: letters.length,
            },
        });
    } catch (error) {
        console.error('Erreur getPendingLetters:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des courriers en attente.',
            error: error.message,
        });
    }
};
