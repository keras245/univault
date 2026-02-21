import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Pencil, Trash2, UserCheck, UserX } from 'lucide-react';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { usersAPI } from '../../config/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import '../super-admin/Administrateur.css';

const AdminTeam = () => {
    const { user } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', role: 'user'
    });

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchUsers();
    }, [debouncedSearch]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await usersAPI.getAll({
                service: user?.service, // 👈 filtre automatique par service
                search: debouncedSearch,
                role: 'user' // l'admin gère uniquement les users, pas les autres admins
            });
            setUsers(response.data.data || []);
        } catch (error) {
            toast.error('Erreur lors du chargement de l\'équipe');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.email) {
            return toast.error('Prénom, nom et email sont requis');
        }
        if (!editingUser && !formData.password) {
            return toast.error('Le mot de passe est requis');
        }

        try {
            setSaving(true);
            if (editingUser) {
                await usersAPI.update(editingUser._id, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    ...(formData.password && { password: formData.password })
                });
                toast.success('Utilisateur modifié');
            } else {
                await usersAPI.create({
                    ...formData,
                    service: user?.service, // 👈 service automatique
                    role: 'user'
                });
                toast.success('Utilisateur créé');
            }
            handleCancel();
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (u) => {
        setEditingUser(u);
        setFormData({
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            password: '',
            role: u.role
        });
        setShowForm(true);
    };

    const handleToggleActive = async (u) => {
        try {
            await usersAPI.update(u._id, { isActive: !u.isActive });
            toast.success(u.isActive ? 'Compte désactivé' : 'Compte activé');
            fetchUsers();
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const handleDelete = async (u) => {
        if (!window.confirm(`Supprimer ${u.firstName} ${u.lastName} ?`)) return;
        try {
            await usersAPI.delete(u._id);
            toast.success('Utilisateur supprimé');
            fetchUsers();
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingUser(null);
        setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="admin-header">
                    <div className="admin-header-top">
                        <div>
                            <h1 className="admin-header-title">Mon Équipe</h1>
                            <p className="admin-header-subtitle">
                                Gérez les membres du service {user?.service}
                            </p>
                        </div>
                        {!showForm && (
                            <button className="btn-primary" onClick={() => setShowForm(true)}>
                                <Plus size={20} />
                                Ajouter un membre
                            </button>
                        )}
                    </div>

                    {/* Formulaire */}
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="admin-stat-card"
                            style={{ marginTop: '1rem', padding: '1.5rem' }}
                        >
                            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
                                {editingUser ? 'Modifier le membre' : 'Nouveau membre'}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div className="input-wrapper" style={{ marginBottom: 0 }}>
                                        <label className="input-label">Prénom *</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
                                            placeholder="Prénom"
                                            className="admin-search-input"
                                        />
                                    </div>
                                    <div className="input-wrapper" style={{ marginBottom: 0 }}>
                                        <label className="input-label">Nom *</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
                                            placeholder="Nom"
                                            className="admin-search-input"
                                        />
                                    </div>
                                    <div className="input-wrapper" style={{ marginBottom: 0 }}>
                                        <label className="input-label">Email *</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                                            placeholder="Email"
                                            className="admin-search-input"
                                            disabled={!!editingUser}
                                        />
                                    </div>
                                    <div className="input-wrapper" style={{ marginBottom: 0 }}>
                                        <label className="input-label">
                                            {editingUser ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe *'}
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                                            placeholder={editingUser ? 'Laisser vide pour ne pas changer' : 'Mot de passe'}
                                            className="admin-search-input"
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={handleCancel} className="admin-action-btn admin-action-btn--delete" style={{ padding: '0.6rem 1.2rem' }}>
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn-primary" disabled={saving}>
                                        {saving ? 'Sauvegarde...' : editingUser ? 'Modifier' : 'Créer'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* Recherche */}
                    <div className="admin-search" style={{ marginTop: '1rem' }}>
                        <Search className="admin-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher un membre..."
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
                                <p className="admin-stat-label">Membres de l'équipe</p>
                                <p className="admin-stat-value">{users.length}</p>
                            </div>
                            <div className="admin-stat-icon admin-stat-icon--blue">
                                <Users size={24} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Table */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="admin-content">
                    {loading ? (
                        <div className="admin-loading">
                            <div className="admin-loading-spinner"></div>
                            <p className="admin-loading-text">Chargement...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="admin-empty">
                            <Users className="admin-empty-icon" size={64} />
                            <h3 className="admin-empty-title">Aucun membre</h3>
                            <p className="admin-empty-text">Ajoutez des membres à votre équipe</p>
                        </div>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead className="admin-table-header">
                                    <tr>
                                        <th>Membre</th>
                                        <th>Email</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="admin-table-body">
                                    {users.map((u) => (
                                        <tr key={u._id}>
                                            <td>
                                                <div className="admin-table-user">
                                                    <div className="admin-table-avatar">
                                                        {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                                                    </div>
                                                    <p className="admin-table-user-name">{u.firstName} {u.lastName}</p>
                                                </div>
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`admin-badge ${u.isActive ? 'admin-badge--active' : 'admin-badge--inactive'}`}>
                                                    {u.isActive ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="admin-table-actions">
                                                    <button className="admin-action-btn admin-action-btn--edit" onClick={() => handleEdit(u)} title="Modifier">
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        className={`admin-action-btn ${u.isActive ? 'admin-action-btn--delete' : 'admin-action-btn--view'}`}
                                                        onClick={() => handleToggleActive(u)}
                                                        title={u.isActive ? 'Désactiver' : 'Activer'}
                                                    >
                                                        {u.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                                                    </button>
                                                    <button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDelete(u)} title="Supprimer">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </AdminLayout>
    );
};

export default AdminTeam;