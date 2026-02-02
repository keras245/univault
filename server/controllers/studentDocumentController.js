import StudentDocument from '../models/StudentDocument.js';
import Student from '../models/Student.js';
import { uploadFile, deleteFile } from '../utils/fileStorage.js';
import fs from 'fs';

/**
 * @route   POST /api/students/:id/documents
 * @desc    Upload un document pour un étudiant
 * @access  Private (Scolarité uniquement)
 */
export const uploadDocument = async (req, res) => {
    try {
        const { type, note } = req.body;
        const studentId = req.params.id;

        // Vérifier que l'étudiant existe
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }

        // Vérifier qu'un fichier est fourni
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        // Utiliser la stratégie d'upload avec fallback
        const uploadResult = await uploadFile(req.file.path, {
            folder: `univault/students/${student.matricule}`,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype
        });

        // Créer le document en base
        const document = await StudentDocument.create({
            student: studentId,
            type,
            fileName: req.file.originalname,
            fileUrl: uploadResult.url,
            fileSize: uploadResult.bytes,
            fileType: req.file.mimetype,
            cloudinaryId: uploadResult.publicId,
            note: note || '',
            uploadedBy: req.user._id,
            uploadedAt: new Date()
        });

        // Populate pour renvoyer les infos complètes
        await document.populate('uploadedBy', 'firstName lastName');

        // Nettoyer le fichier temporaire
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(201).json({
            success: true,
            message: 'Document uploadé avec succès',
            data: document
        });

    } catch (error) {
        console.error('Erreur uploadDocument:', error);
        
        // Nettoyer le fichier temporaire en cas d'erreur
        try {
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        } catch (cleanError) {
            console.error('Erreur nettoyage fichier:', cleanError);
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload du document',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/students/:id/documents
 * @desc    Obtenir tous les documents d'un étudiant avec URLs signées
 * @access  Private (Scolarité uniquement)
 */
export const getStudentDocuments = async (req, res) => {
    try {
        const studentId = req.params.id;

        // Vérifier que l'étudiant existe
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }

        const documents = await StudentDocument.find({ student: studentId })
            .populate('uploadedBy', 'firstName lastName')
            .sort({ uploadedAt: -1 });

        // Retourner les documents avec leurs URLs Cloudinary directes
        const documentsWithUrls = documents.map(doc => {
            const docObj = doc.toObject();
            docObj.signedUrl = docObj.fileUrl; // URL Cloudinary publique
            return docObj;
        });

        res.json({
            success: true,
            data: documentsWithUrls
        });

    } catch (error) {
        console.error('Erreur getStudentDocuments:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des documents',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/students/:studentId/documents/:docId
 * @desc    Supprimer un document
 * @access  Private (Admin Scolarité uniquement)
 */
export const deleteDocument = async (req, res) => {
    try {
        const { studentId, docId } = req.params;

        const document = await StudentDocument.findOne({
            _id: docId,
            student: studentId
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document non trouvé'
            });
        }

        // Supprimer le fichier (Cloudinary ou local)
        try {
            await deleteFile(document);
        } catch (deleteError) {
            console.error('Erreur suppression fichier:', deleteError);
            // Continue quand même pour supprimer de la base
        }

        await document.deleteOne();

        res.json({
            success: true,
            message: 'Document supprimé avec succès'
        });

    } catch (error) {
        console.error('Erreur deleteDocument:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du document',
            error: error.message
        });
    }
};
