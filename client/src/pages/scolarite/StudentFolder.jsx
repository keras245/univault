import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    Plus, 
    FileText, 
    Download, 
    Trash2, 
    Eye,
    User,
    Hash
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentsAPI, studentDocumentsAPI } from '../../config/api';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';
import UploadDocumentModal from '../../components/scolarite/UploadDocumentModal';
import './StudentFolder.css';

const StudentFolder = ({ Layout }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

    const [student, setStudent] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const fetchStudent = async () => {
        try {
            setLoading(true);
            const response = await studentsAPI.getById(id);
            setStudent(response.data.data);
            setDocuments(response.data.data.documents || []);
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors du chargement du dossier');
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const handleDelete = async (doc) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
            return;
        }

        try {
            await studentDocumentsAPI.delete(id, doc._id);
            toast.success('Document supprimé avec succès');
            fetchStudent();
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error.message || 'Erreur lors de la suppression');
        }
    };

    const handleDownload = (doc) => {
        console.log('📥 Téléchargement:', doc.fileName);
        
        // Télécharger depuis l'URL Cloudinary
        const link = document.createElement('a');
        link.href = doc.signedUrl || doc.fileUrl;
        link.setAttribute('download', doc.fileName);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Téléchargement lancé');
    };

    const handlePreview = (doc) => {
        console.log('👁️ Prévisualisation:', doc.fileName);
        window.open(doc.signedUrl || doc.fileUrl, '_blank');
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <Layout>
                <div className="student-folder-loading">
                    <div className="students-loading-spinner"></div>
                    <p>Chargement du dossier...</p>
                </div>
            </Layout>
        );
    }

    if (!student) {
        return null;
    }

    return (
        <Layout>
            <div className="student-folder-page">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="student-folder-header"
                >
                    <Button
                        variant="secondary"
                        size="medium"
                        onClick={() => navigate(-1)}
                        leftIcon={<ArrowLeft size={18} />}
                    >
                        Retour
                    </Button>

                    <div className="student-folder-info">
                        <div className="student-folder-avatar">
                            {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="student-folder-name">
                                {student.firstName} {student.lastName}
                            </h1>
                            <p className="student-folder-matricule">
                                <Hash size={16} />
                                Matricule: {student.matricule}
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        size="medium"
                        onClick={() => setShowUploadModal(true)}
                        leftIcon={<Plus size={18} />}
                    >
                        Ajouter un document
                    </Button>
                </motion.div>

                {/* Documents */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="student-folder-documents"
                >
                    <h2 className="student-folder-section-title">
                        <FileText size={24} />
                        Documents ({documents.length})
                    </h2>

                    {documents.length === 0 ? (
                        <div className="student-folder-empty">
                            <FileText size={48} />
                            <p>Aucun document pour cet étudiant</p>
                        </div>
                    ) : (
                        <div className="student-documents-grid">
                            <AnimatePresence>
                                {documents.map((doc, index) => (
                                    <motion.div
                                        key={doc._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="document-card"
                                    >
                                        <div className="document-card-header">
                                            <div className="document-card-icon">
                                                <FileText size={24} />
                                            </div>
                                            <span className="document-card-type">{doc.type}</span>
                                        </div>

                                        <div className="document-card-body">
                                            <p className="document-card-filename">{doc.fileName}</p>
                                            <p className="document-card-size">{formatFileSize(doc.fileSize)}</p>
                                            {doc.note && (
                                                <p className="document-card-note">{doc.note}</p>
                                            )}
                                            <p className="document-card-meta">
                                                Uploadé le {formatDate(doc.uploadedAt)}
                                            </p>
                                            <p className="document-card-meta">
                                                Par {doc.uploadedBy?.firstName} {doc.uploadedBy?.lastName}
                                            </p>
                                        </div>

                                        <div className="document-card-actions">
                                            <button
                                                onClick={() => handlePreview(doc)}
                                                className="document-action-btn document-action-btn--view"
                                                title="Prévisualiser"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDownload(doc)}
                                                className="document-action-btn document-action-btn--download"
                                                title="Télécharger"
                                            >
                                                <Download size={18} />
                                            </button>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDelete(doc)}
                                                    className="document-action-btn document-action-btn--delete"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>

                <UploadDocumentModal
                    isOpen={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    studentId={id}
                    onSuccess={() => {
                        setShowUploadModal(false);
                        fetchStudent();
                    }}
                />
            </div>
        </Layout>
    );
};

export default StudentFolder;
