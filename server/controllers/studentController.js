import Document from '../models/Document.js';

/**
 * @route   GET /api/students/:matricule
 * @desc    Rechercher un étudiant par matricule
 * @access  Private (Scolarité)
 */
export const getStudentByMatricule = async (req, res) => {
    try {
        const { matricule } = req.params;

        // Vérifier que l'utilisateur appartient au service Scolarité
        if (req.user.service !== 'Scolarité' && req.user.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès réservé au service Scolarité.',
            });
        }

        // Rechercher les documents de l'étudiant
        const documents = await Document.find({
            service: 'Scolarité',
            'metadata.studentMatricule': matricule,
        })
            .populate('uploadedBy', 'firstName lastName')
            .sort({ createdAt: -1 });

        if (documents.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aucun document trouvé pour ce matricule.',
            });
        }

        // Extraire les informations de l'étudiant du premier document
        const studentInfo = {
            matricule: matricule,
            name: documents[0].metadata.studentName || 'Non renseigné',
            documentCount: documents.length,
        };

        res.json({
            success: true,
            data: {
                student: studentInfo,
                documents,
            },
        });
    } catch (error) {
        console.error('Erreur getStudentByMatricule:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la recherche de l\'étudiant.',
            error: error.message,
        });
    }
};

/**
 * @route   GET /api/students/:matricule/documents
 * @desc    Obtenir tous les documents d'un étudiant
 * @access  Private (Scolarité)
 */
export const getStudentDocuments = async (req, res) => {
    try {
        const { matricule } = req.params;
        const { category } = req.query;

        // Vérifier que l'utilisateur appartient au service Scolarité
        if (req.user.service !== 'Scolarité' && req.user.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès réservé au service Scolarité.',
            });
        }

        const filter = {
            service: 'Scolarité',
            'metadata.studentMatricule': matricule,
        };

        if (category) {
            filter.category = category;
        }

        const documents = await Document.find(filter)
            .populate('uploadedBy', 'firstName lastName')
            .sort({ category: 1, createdAt: -1 });

        res.json({
            success: true,
            data: {
                documents,
                total: documents.length,
            },
        });
    } catch (error) {
        console.error('Erreur getStudentDocuments:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des documents.',
            error: error.message,
        });
    }
};
