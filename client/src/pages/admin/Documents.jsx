import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, Download, Eye, Trash2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { studentDocumentsAPI, studentsAPI } from '../../config/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import UploadDocumentModal from '../../components/scolarite/UploadDocumentModal';
import '../super-admin/Administrateur.css';

const AdminDocuments = () => {
    const { user } = useAuthStore();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [stats, setStats] = useState({ total: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Debounce de la recherche
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    
    const fetchAllDocuments = async (page = 1) => {
    try {
        setLoading(true);
        const response = await studentsAPI.getAllDocuments({ 
            search: debouncedSearch,
            page,
            limit: 20
        });
        
        setDocuments(response.data.data || []);
        setTotalPages(response.data.pagination.pages);
        setStats({ total: response.data.pagination.total });
    } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement des documents');
    } finally {
        setLoading(false);
    }
};

    // Réinitialiser la page quand la recherche change
    useEffect(() => {
        setCurrentPage(1);
        fetchAllDocuments(1);
    }, [debouncedSearch]);

    const handleDelete = async (doc) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;

        try {
            await studentDocumentsAPI.delete(doc.student._id, doc._id);
            toast.success('Document supprimé');
            fetchAllDocuments();
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors de la suppression');
        }
    };

    const handlePreview = (doc) => {
        window.open(doc.signedUrl || doc.fileUrl, '_blank');
    };

    const handleDownload = (doc) => {
        const link = document.createElement('a');
        link.href = doc.signedUrl || doc.fileUrl;
        link.download = doc.fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Téléchargement lancé');
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="admin-header"
                >
                    <div className="admin-header-top">
                        <div>
                            <h1 className="admin-header-title">
                                Documents Étudiants
                            </h1>
                            <p className="admin-header-subtitle">
                                Gérez les documents des étudiants
                            </p>
                        </div>
                        <button className="btn-primary" onClick={() => setShowUploadModal(true)}>
                            <Plus size={20} />
                            Ajouter un document
                        </button>
                    </div>

                    <div className="admin-search">
                        <Search className="admin-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher par matricule ou nom..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-search-input"
                        />
                    </div>
                </motion.div>

                <div className="admin-stats">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="admin-stat-card"
                    >
                        <div className="admin-stat-content">
                            <div>
                                <p className="admin-stat-label">Total Documents</p>
                                <p className="admin-stat-value">{stats.total}</p>
                            </div>
                            <div className="admin-stat-icon admin-stat-icon--blue">
                                <FileText size={24} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="admin-content"
                >
                    {loading ? (
                        <div className="admin-loading">
                            <div className="admin-loading-spinner"></div>
                            <p className="admin-loading-text">Chargement...</p>
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="admin-empty">
                            <FileText className="admin-empty-icon" size={64} />
                            <h3 className="admin-empty-title">Aucun document</h3>
                            <p className="admin-empty-text">Aucun document étudiant trouvé</p>
                        </div>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead className="admin-table-header">
                                    <tr>
                                        <th>Matricule</th>
                                        <th>Étudiant</th>
                                        <th>Type</th>
                                        <th>Taille</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="admin-table-body">
                                    {documents.map((doc) => (
                                        <tr key={doc._id}>
                                            <td>
                                                <span className="admin-badge admin-badge--admin">{doc.student.matricule}</span>
                                            </td>
                                            <td>
                                                <div className="admin-table-user">
                                                    <div className="admin-table-avatar">
                                                        {doc.student.firstName.charAt(0)}{doc.student.lastName.charAt(0)}
                                                    </div>
                                                    <div className="admin-table-user-info">
                                                        <p className="admin-table-user-name">{doc.student.firstName} {doc.student.lastName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{doc.type}</td>
                                            <td>{formatFileSize(doc.fileSize)}</td>
                                            <td>{formatDate(doc.uploadedAt)}</td>
                                            <td>
                                                <div className="admin-table-actions">
                                                    <button
                                                        className="admin-action-btn admin-action-btn--view"
                                                        onClick={() => handlePreview(doc)}
                                                        title="Prévisualiser"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        className="admin-action-btn admin-action-btn--edit"
                                                        onClick={() => handleDownload(doc)}
                                                        title="Télécharger"
                                                    >
                                                        <Download size={18} />
                                                    </button>
                                                    <button
                                                        className="admin-action-btn admin-action-btn--delete"
                                                        onClick={() => handleDelete(doc)}
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {totalPages > 1 && (
                            <div className="admin-pagination">
                                <button
                                    onClick={() => { setCurrentPage(1); fetchAllDocuments(1); }}
                                    disabled={currentPage === 1}
                                    className="admin-pagination-btn"
                                    title="Première page"
                                >
                                    <ChevronsLeft size={16} />
                                </button>
                                <button
                                    onClick={() => { setCurrentPage(p => p - 1); fetchAllDocuments(currentPage - 1); }}
                                    disabled={currentPage === 1}
                                    className="admin-pagination-btn"
                                    title="Page précédente"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="admin-pagination-info">{currentPage} / {totalPages}</span>
                                <button
                                    onClick={() => { setCurrentPage(p => p + 1); fetchAllDocuments(currentPage + 1); }}
                                    disabled={currentPage === totalPages}
                                    className="admin-pagination-btn"
                                    title="Page suivante"
                                >
                                    <ChevronRight size={16} />
                                </button>
                                <button
                                    onClick={() => { setCurrentPage(totalPages); fetchAllDocuments(totalPages); }}
                                    disabled={currentPage === totalPages}
                                    className="admin-pagination-btn"
                                    title="Dernière page"
                                >
                                    <ChevronsRight size={16} />
                                </button>
                            </div>
                        )}


                        </div>
                    )}
                </motion.div>

                {showUploadModal && (
                    <UploadDocumentModal
                        isOpen={showUploadModal}
                        onClose={() => setShowUploadModal(false)}
                        onSuccess={() => {
                            setShowUploadModal(false);
                            fetchAllDocuments();
                        }}
                        showSearch={true}
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminDocuments;
