import multer from 'multer';
import path from 'path';

// Types de fichiers autorisés
const ALLOWED_FILE_TYPES = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
};

// Configuration du stockage temporaire
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/temp/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// Filtre de validation des fichiers
const fileFilter = (req, file, cb) => {
    const allowedExtensions = Object.values(ALLOWED_FILE_TYPES).flat();
    const fileExtension = path.extname(file.originalname).toLowerCase();

    // Vérifier l'extension
    if (!allowedExtensions.includes(fileExtension)) {
        return cb(new Error(`Type de fichier non autorisé: ${fileExtension}`), false);
    }

    // Vérifier le MIME type
    if (!ALLOWED_FILE_TYPES[file.mimetype]) {
        return cb(new Error(`MIME type non autorisé: ${file.mimetype}`), false);
    }

    cb(null, true);
};

// Configuration de Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB par défaut
    },
    fileFilter: fileFilter,
});

// Middleware de gestion des erreurs d'upload
export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Fichier trop volumineux. Taille maximale: 10MB',
            });
        }
        return res.status(400).json({
            success: false,
            message: `Erreur d'upload: ${err.message}`,
        });
    }

    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    next();
};

export default upload;
