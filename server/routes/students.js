import express from 'express';
import multer from 'multer';
import * as studentController from '../controllers/studentController.js';
import * as studentDocumentController from '../controllers/studentDocumentController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Configuration Multer pour upload fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB max
    },
    fileFilter: (req, file, cb) => {
        // Accepter seulement PDF et images
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Format de fichier non autorisé. Seulement PDF, JPG, PNG acceptés.'));
        }
    }
});

// Configuration Multer pour import Excel
const uploadExcel = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB max
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
            'text/plain',
            'text/tab-separated-values'
        ];
        if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(xlsx|xls|csv|txt)$/)) {
            cb(null, true);
        } else {
            cb(new Error('Format de fichier non autorisé. Seulement Excel (.xls, .xlsx) ou CSV acceptés.'));
        }
    }
});

// Toutes les routes nécessitent authentification + service Scolarité
router.use(authenticate);

// Routes étudiants
router.get('/', studentController.getStudents);
router.get('/stats', studentController.getStudentStats);
router.get('/:id', studentController.getStudentById);

// Routes admin uniquement (admin du service Scolarité)
router.post('/', authorize('admin', 'super-admin'), studentController.createStudent);
router.put('/:id', authorize('admin', 'super-admin'), studentController.updateStudent);
router.delete('/:id', authorize('admin', 'super-admin'), studentController.deleteStudent);

// Import Excel (admin uniquement)
router.post(
    '/import/excel',
    authorize('admin', 'super-admin'),
    uploadExcel.single('file'),
    studentController.importStudents
);

// Routes documents
router.get('/:id/documents', studentDocumentController.getStudentDocuments);
router.post(
    '/:id/documents',
    upload.single('file'),
    studentDocumentController.uploadDocument
);
router.delete(
    '/:studentId/documents/:docId',
    authorize('admin', 'super-admin'),
    studentDocumentController.deleteDocument
);

export default router;
