import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Users as UsersIcon,
    FileText,
    Upload,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronsLeft,
    ChevronRight,
    ChevronsRight
} from 'lucide-react';
import { studentsAPI } from '../../config/api';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';
import StudentModal from '../../components/scolarite/StudentModal';
import ImportExcelModal from '../../components/scolarite/ImportExcelModal';
import { useNavigate } from 'react-router-dom';
import './Students.css';

const Students = ({ Layout }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [stats, setStats] = useState({ totalStudents: 0, totalDocuments: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { user } = useAuthStore();
    const navigate = useNavigate();
    const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

    // Debounce recherche
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Réinitialiser page et recharger quand la recherche change
    useEffect(() => {
        setCurrentPage(1);
        fetchStudents(1);
    }, [debouncedSearch]);

    const fetchStudents = async (page = 1) => {
        try {
            setLoading(true);
            const response = await studentsAPI.getAll({
                search: debouncedSearch,
                page,
                limit: 20
            });
            setStudents(response.data.data || []);
            setTotalPages(response.data.pagination?.pages || 1);
        } catch (error) {
            console.error('Erreur:', error);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await studentsAPI.getStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('Erreur stats:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleCreate = () => {
        setSelectedStudent(null);
        setShowStudentModal(true);
    };

    const handleEdit = (student) => {
        setSelectedStudent(student);
        setShowStudentModal(true);
    };

    const handleDelete = async (student) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${student.firstName} ${student.lastName} et tous ses documents ?`)) return;
        try {
            await studentsAPI.delete(student._id);
            toast.success('Étudiant supprimé avec succès');
            fetchStudents(currentPage);
            fetchStats();
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error.message || 'Erreur lors de la suppression');
        }
    };

    const handleViewDossier = (student) => {
        const basePath = user?.role === 'super-admin' ? '/super-admin' :
            user?.role === 'admin' ? '/admin' : '/user';
        navigate(`${basePath}/students/${student._id}`);
    };

    const handleModalSuccess = () => {
        setShowStudentModal(false);
        setShowImportModal(false);
        setSelectedStudent(null);
        fetchStudents(currentPage);
        fetchStats();
    };

    return (
        <Layout>
            <div className="students-page">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="students-header"
                >
                    <div>
                        <h1 className="students-title">Gestion des Étudiants</h1>
                        <p className="students-subtitle">Service Scolarité - Archivage numérique</p>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="students-stats">
                    <div className="students-stat-card">
                        <div className="students-stat-content">
                            <div>
                                <p className="students-stat-label">Total Étudiants</p>
                                <p className="students-stat-value">{stats.totalStudents}</p>
                            </div>
                            <div className="students-stat-icon students-stat-icon--blue">
                                <UsersIcon size={20} />
                            </div>
                        </div>
                    </div>
                    <div className="students-stat-card">
                        <div className="students-stat-content">
                            <div>
                                <p className="students-stat-label">Total Documents</p>
                                <p className="students-stat-value">{stats.totalDocuments}</p>
                            </div>
                            <div className="students-stat-icon students-stat-icon--green">
                                <FileText size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="students-actions">
                    <div className="students-search">
                        <Search className="students-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher par matricule, nom ou prénom..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="students-search-input"
                        />
                    </div>
                    {isAdmin && (
                        <div className="students-action-buttons">
                            <Button variant="secondary" size="medium" onClick={() => setShowImportModal(true)} leftIcon={<Upload size={18} />}>
                                Importer Excel
                            </Button>
                            <Button variant="primary" size="medium" onClick={handleCreate} leftIcon={<Plus size={18} />}>
                                Nouvel Étudiant
                            </Button>
                        </div>
                    )}
                </div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="students-table-container"
                >
                    {loading ? (
                        <div className="students-loading">
                            <div className="students-loading-spinner"></div>
                            <p className="students-loading-text">Chargement...</p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="students-empty">
                            <UsersIcon className="students-empty-icon" size={48} />
                            <p className="students-empty-text">
                                {searchTerm ? 'Aucun étudiant trouvé' : 'Aucun étudiant'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <table className="students-table">
                                <thead className="students-table-header">
                                    <tr>
                                        <th>Matricule</th>
                                        <th>Nom Complet</th>
                                        <th>Documents</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="students-table-body">
                                    <AnimatePresence>
                                        {students.map((student, index) => (
                                            <motion.tr
                                                key={student._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <td>
                                                    <span className="students-matricule">{student.matricule}</span>
                                                </td>
                                                <td>
                                                    <div className="students-name">
                                                        <div className="students-avatar">
                                                            {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                                                        </div>
                                                        <span>{student.firstName} {student.lastName}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="students-doc-count">
                                                        <FileText size={16} />
                                                        {student.documentCount || 0}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="students-table-actions">
                                                        <button onClick={() => handleViewDossier(student)} className="students-action-btn students-action-btn--view" title="Voir le dossier">
                                                            <FileText size={18} />
                                                        </button>
                                                        {isAdmin && (
                                                            <>
                                                                <button onClick={() => handleEdit(student)} className="students-action-btn students-action-btn--edit" title="Modifier">
                                                                    <Edit2 size={18} />
                                                                </button>
                                                                <button onClick={() => handleDelete(student)} className="students-action-btn students-action-btn--delete" title="Supprimer">
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="admin-pagination">
                                    <button onClick={() => { setCurrentPage(1); fetchStudents(1); }} disabled={currentPage === 1} className="admin-pagination-btn" title="Première page"><ChevronsLeft size={16} /></button>
                                    <button onClick={() => { setCurrentPage(p => p - 1); fetchStudents(currentPage - 1); }} disabled={currentPage === 1} className="admin-pagination-btn" title="Précédent"><ChevronLeft size={16} /></button>
                                    <span className="admin-pagination-info">{currentPage} / {totalPages}</span>
                                    <button onClick={() => { setCurrentPage(p => p + 1); fetchStudents(currentPage + 1); }} disabled={currentPage === totalPages} className="admin-pagination-btn" title="Suivant"><ChevronRight size={16} /></button>
                                    <button onClick={() => { setCurrentPage(totalPages); fetchStudents(totalPages); }} disabled={currentPage === totalPages} className="admin-pagination-btn" title="Dernière page"><ChevronsRight size={16} /></button>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>

                <StudentModal
                    isOpen={showStudentModal}
                    onClose={() => { setShowStudentModal(false); setSelectedStudent(null); }}
                    student={selectedStudent}
                    onSuccess={handleModalSuccess}
                />
                <ImportExcelModal
                    isOpen={showImportModal}
                    onClose={() => setShowImportModal(false)}
                    onSuccess={handleModalSuccess}
                />
            </div>
        </Layout>
    );
};

export default Students;