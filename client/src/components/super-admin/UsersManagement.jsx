import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    Users as UsersIcon,
    Mail,
    Building2,
    Shield,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { usersAPI } from '../../config/api';
import toast from 'react-hot-toast';
import UserModal from './UserModal';
import Button from '../ui/Button';
import './UsersManagement.css';

const UsersManagement = ({ searchTerm }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await usersAPI.getAll({ role: 'user' });
            setUsers(response.data.data || []);
        } catch (error) {
            console.error('Erreur:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        setSelectedUser(null);
        setShowModal(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.lastName} ?`)) {
            return;
        }

        try {
            await usersAPI.delete(user._id);
            toast.success('Utilisateur supprimé avec succès');
            fetchUsers();
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error.message || 'Erreur lors de la suppression');
        }
    };

    const handleModalSuccess = () => {
        setShowModal(false);
        setSelectedUser(null);
        fetchUsers();
    };

    return (
        <div className="users-management">
            {/* Stats + Button */}
            <div className="users-header">
                <div className="users-stats">
                    <div className="users-stat-card">
                        <div className="users-stat-content">
                            <div>
                                <p className="users-stat-label">Total</p>
                                <p className="users-stat-value">{users.length}</p>
                            </div>
                            <div className="users-stat-icon users-stat-icon--green">
                                <UsersIcon size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="users-stat-card">
                        <div className="users-stat-content">
                            <div>
                                <p className="users-stat-label">Actifs</p>
                                <p className="users-stat-value" style={{ color: 'var(--color-success)' }}>
                                    {users.filter(u => u.isActive).length}
                                </p>
                            </div>
                            <div className="users-stat-icon users-stat-icon--green">
                                <CheckCircle size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="users-stat-card">
                        <div className="users-stat-content">
                            <div>
                                <p className="users-stat-label">Inactifs</p>
                                <p className="users-stat-value" style={{ color: 'var(--color-error)' }}>
                                    {users.filter(u => !u.isActive).length}
                                </p>
                            </div>
                            <div className="users-stat-icon users-stat-icon--red">
                                <XCircle size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="medium"
                    onClick={handleCreate}
                    leftIcon={<Plus size={18} />}
                >
                    Nouvel Utilisateur
                </Button>
            </div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="users-table-container"
            >
                {loading ? (
                    <div className="users-loading">
                        <div className="users-loading-spinner"></div>
                        <p className="users-loading-text">Chargement...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="users-empty">
                        <UsersIcon className="users-empty-icon" size={48} />
                        <p className="users-empty-text">
                            {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur'}
                        </p>
                    </div>
                ) : (
                    <table className="users-table">
                        <thead className="users-table-header">
                            <tr>
                                <th>Utilisateur</th>
                                <th>Service</th>
                                <th>Statut</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="users-table-body">
                            <AnimatePresence>
                                {filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <td>
                                            <div className="users-table-user">
                                                <div className="users-table-avatar">
                                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                </div>
                                                <div className="users-table-user-info">
                                                    <p className="users-table-user-name">
                                                        {user.firstName} {user.lastName}
                                                    </p>
                                                    <p className="users-table-user-email">
                                                        <Mail size={14} />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="users-table-service">
                                                <Building2 size={16} />
                                                <span>{user.service}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`users-badge ${
                                                user.isActive ? 'users-badge--active' : 'users-badge--inactive'
                                            }`}>
                                                {user.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                {user.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="users-table-actions">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="users-action-btn users-action-btn--edit"
                                                    title="Modifier"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    className="users-action-btn users-action-btn--delete"
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

            <UserModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
};

export default UsersManagement;
