import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    UserCog,
    Mail,
    Building2,
    Shield,
    CheckCircle,
    XCircle
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { usersAPI } from '../config/api';
import toast from 'react-hot-toast';
import AdminModal from '../components/modals/AdminModal';
import Button from '../components/ui/Button';
import './Administrateur.css';

const Administrateur = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    // Charger les administrateurs
    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const response = await usersAPI.getAll({ role: ['admin', 'super-admin'] });
            setAdmins(response.data.data || []);
        } catch (error) {
            console.error('Erreur:', error);
            setAdmins([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    // Filtrer les admins
    const filteredAdmins = admins.filter(admin =>
        admin.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handlers CRUD
    const handleCreate = () => {
        setSelectedAdmin(null);
        setShowModal(true);
    };

    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        setShowModal(true);
    };

    const handleDelete = async (admin) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${admin.firstName} ${admin.lastName} ?`)) {
            return;
        }

        try {
            await usersAPI.delete(admin._id);
            toast.success('Administrateur supprimé avec succès');
            fetchAdmins();
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error.message || 'Erreur lors de la suppression');
        }
    };

    const handleModalSuccess = () => {
        setShowModal(false);
        setSelectedAdmin(null);
        fetchAdmins();
    };

    return (
        <MainLayout>
            <div className="admin-page">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="admin-header"
                >
                    <div className="admin-header-top">
                        <div>
                            <h1 className="admin-header-title">
                                Gestion des Administrateurs
                            </h1>
                            <p className="admin-header-subtitle">
                                Créer, modifier et supprimer les comptes administrateurs
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            size="medium"
                            onClick={handleCreate}
                            leftIcon={<Plus size={18} />}
                        >
                            Nouvel Administrateur
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <div className="admin-search">
                        <Search className="admin-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher un administrateur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-search-input"
                        />
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="admin-stats">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="admin-stat-card"
                    >
                        <div className="admin-stat-content">
                            <div>
                                <p className="admin-stat-label">Total</p>
                                <p className="admin-stat-value">{admins.length}</p>
                            </div>
                            <div className="admin-stat-icon admin-stat-icon--blue">
                                <UserCog size={24} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="admin-stat-card"
                    >
                        <div className="admin-stat-content">
                            <div>
                                <p className="admin-stat-label">Actifs</p>
                                <p className="admin-stat-value" style={{ color: 'var(--color-success)' }}>
                                    {admins.filter(a => a.isActive).length}
                                </p>
                            </div>
                            <div className="admin-stat-icon admin-stat-icon--green">
                                <CheckCircle size={24} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="admin-stat-card"
                    >
                        <div className="admin-stat-content">
                            <div>
                                <p className="admin-stat-label">Inactifs</p>
                                <p className="admin-stat-value" style={{ color: 'var(--color-error)' }}>
                                    {admins.filter(a => !a.isActive).length}
                                </p>
                            </div>
                            <div className="admin-stat-icon admin-stat-icon--red">
                                <XCircle size={24} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="admin-table-container"
                >
                    {loading ? (
                        <div className="admin-loading">
                            <div className="admin-loading-spinner"></div>
                            <p className="admin-loading-text">Chargement...</p>
                        </div>
                    ) : filteredAdmins.length === 0 ? (
                        <div className="admin-empty">
                            <UserCog className="admin-empty-icon" size={48} />
                            <p className="admin-empty-text">
                                {searchTerm ? 'Aucun administrateur trouvé' : 'Aucun administrateur'}
                            </p>
                        </div>
                    ) : (
                        <table className="admin-table">
                            <thead className="admin-table-header">
                                <tr>
                                    <th>Administrateur</th>
                                    <th>Service</th>
                                    <th>Rôle</th>
                                    <th>Statut</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="admin-table-body">
                                <AnimatePresence>
                                    {filteredAdmins.map((admin, index) => (
                                        <motion.tr
                                            key={admin._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <td>
                                                <div className="admin-table-user">
                                                    <div className="admin-table-avatar">
                                                        {admin.firstName?.charAt(0)}{admin.lastName?.charAt(0)}
                                                    </div>
                                                    <div className="admin-table-user-info">
                                                        <p className="admin-table-user-name">
                                                            {admin.firstName} {admin.lastName}
                                                        </p>
                                                        <p className="admin-table-user-email">
                                                            <Mail size={14} />
                                                            {admin.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="admin-table-service">
                                                    <Building2 size={16} />
                                                    <span>{admin.service}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`admin-badge ${
                                                    admin.role === 'super-admin'
                                                        ? 'admin-badge--super-admin'
                                                        : 'admin-badge--admin'
                                                }`}>
                                                    <Shield size={12} />
                                                    {admin.role === 'super-admin' ? 'Super Admin' : 'Admin'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`admin-badge ${
                                                    admin.isActive
                                                        ? 'admin-badge--active'
                                                        : 'admin-badge--inactive'
                                                }`}>
                                                    {admin.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                    {admin.isActive ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="admin-table-actions">
                                                    <button
                                                        onClick={() => handleEdit(admin)}
                                                        className="admin-action-btn admin-action-btn--edit"
                                                        title="Modifier"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(admin)}
                                                        className="admin-action-btn admin-action-btn--delete"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    )}
                </motion.div>
            </div>

            {/* Modal */}
            <AdminModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedAdmin(null);
                }}
                admin={selectedAdmin}
                onSuccess={handleModalSuccess}
            />
        </MainLayout>
    );
};

export default Administrateur;
