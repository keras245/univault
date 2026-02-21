import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, Download, Eye, Trash2, Upload as UploadIcon, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import SuperAdminLayout from '../../components/layout/super-admin/SuperAdminLayout';
import { documentsAPI, studentDocumentsAPI, servicesAPI } from '../../config/api';
import toast from 'react-hot-toast';
import UploadDocumentModal from '../../components/scolarite/UploadDocumentModal';
import '../super-admin/Administrateur.css';

const SuperAdminDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [stats, setStats] = useState({ total: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState('Tous');
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await servicesAPI.getAll();
                setServices(response.data.data || []);
            } catch (error) {
                console.error('Erreur services:', error);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
        fetchDocuments(1);
    }, [debouncedSearch, activeTab]);

    const fetchDocuments = async (page = 1) => {
        try {
            setLoading(true);
            const response = await documentsAPI.getAllGlobal({
                search: debouncedSearch,
                page,
                limit: 20,
                service: activeTab !== 'Tous' ? activeTab : undefined
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

    const handleDelete = async (doc) => {
        if (!window.confirm('Supprimer ce document ?')) return;
        try {
            if (doc.source === 'scolarite') {
                await studentDocumentsAPI.delete(doc.studentId, doc.originalId);
            } else {
                await documentsAPI.delete(doc.originalId);
            }
            toast.success('Document supprimé');
            fetchDocuments(currentPage);
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handlePreview = (doc) => window.open(doc.fileUrl, '_blank');

    const handleDownload = (doc) => {
        const link = document.createElement('a');
        link.href = doc.fileUrl;
        link.download = doc.displayName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Téléchargement lancé');
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '-';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    const tabs = ['Tous', ...services.map(s => s.name)];

    return (
        <SuperAdminLayout>
            <div className="admin-page">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="admin-header">
                    <div className="admin-header-top">
                        <div>
                            <h1 className="admin-header-title">Documents</h1>
                            <p className="admin-header-subtitle">Vue globale de tous les documents archivés</p>
                        </div>
                        <button className="btn-primary" onClick={() => setShowUploadModal(true)}>
                            <Plus size={20} />
                            Ajouter un document
                        </button>
                    </div>

                    {/* Onglets */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '0.4rem 1rem',
                                    borderRadius: '2rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    background: activeTab === tab ? 'var(--color-primary)' : 'var(--color-surface)',
                                    color: activeTab === tab ? '#fff' : 'var(--color-text-secondary)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Recherche */}
                    <div className="admin-search" style={{ marginTop: '1rem' }}>
                        <Search className="admin-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher un document..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-search-input"
                        />
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="admin-stats">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-stat-card">
                        <div className="admin-stat-content">
                            <div>
                                <p className="admin-stat-label">
                                    {activeTab === 'Tous' ? 'Total Documents' : `Documents — ${activeTab}`}
                                </p>
                                <p className="admin-stat-value">{stats.total}</p>
                            </div>
                            <div className="admin-stat-icon admin-stat-icon--blue">
                                <FileText size={24} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Table */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="admin-content">
                    {loading ? (
                        <div className="admin-loading">
                            <div className="admin-loading-spinner"></div>
                            <p className="admin-loading-text">Chargement...</p>
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="admin-empty">
                            <FileText className="admin-empty-icon" size={64} />
                            <h3 className="admin-empty-title">Aucun document</h3>
                            <p className="admin-empty-text">Aucun document trouvé</p>
                        </div>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead className="admin-table-header">
                                    <tr>
                                        <th>Service</th>
                                        <th>Nom / Étudiant</th>
                                        {activeTab === 'Scolarité' && <th>Matricule</th>}
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
                                                <span className="admin-badge admin-badge--admin">{doc.service}</span>
                                            </td>
                                            <td>
                                                <div className="admin-table-user">
                                                    <div className="admin-table-avatar">
                                                        {doc.displayName?.charAt(0)}
                                                    </div>
                                                    <p className="admin-table-user-name">{doc.displayName}</p>
                                                </div>
                                            </td>
                                            {activeTab === 'Scolarité' && (
                                                <td>
                                                    <span className="admin-badge admin-badge--admin">{doc.matricule}</span>
                                                </td>
                                            )}
                                            <td>{doc.type}</td>
                                            <td>{formatFileSize(doc.fileSize)}</td>
                                            <td>{formatDate(doc.date)}</td>
                                            <td>
                                                <div className="admin-table-actions">
                                                    <button className="admin-action-btn admin-action-btn--view" onClick={() => handlePreview(doc)} title="Prévisualiser">
                                                        <Eye size={18} />
                                                    </button>
                                                    <button className="admin-action-btn admin-action-btn--edit" onClick={() => handleDownload(doc)} title="Télécharger">
                                                        <Download size={18} />
                                                    </button>
                                                    <button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDelete(doc)} title="Supprimer">
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
                                    <button onClick={() => { setCurrentPage(1); fetchDocuments(1); }} disabled={currentPage === 1} className="admin-pagination-btn"><ChevronsLeft size={16} /></button>
                                    <button onClick={() => { setCurrentPage(p => p - 1); fetchDocuments(currentPage - 1); }} disabled={currentPage === 1} className="admin-pagination-btn"><ChevronLeft size={16} /></button>
                                    <span className="admin-pagination-info">{currentPage} / {totalPages}</span>
                                    <button onClick={() => { setCurrentPage(p => p + 1); fetchDocuments(currentPage + 1); }} disabled={currentPage === totalPages} className="admin-pagination-btn"><ChevronRight size={16} /></button>
                                    <button onClick={() => { setCurrentPage(totalPages); fetchDocuments(totalPages); }} disabled={currentPage === totalPages} className="admin-pagination-btn"><ChevronsRight size={16} /></button>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                {showUploadModal && (
                    <UploadDocumentModal
                        isOpen={showUploadModal}
                        onClose={() => setShowUploadModal(false)}
                        onSuccess={() => { setShowUploadModal(false); fetchDocuments(); }}
                        showSearch={true}
                    />
                )}
            </div>
        </SuperAdminLayout>
    );
};

export default SuperAdminDocuments;