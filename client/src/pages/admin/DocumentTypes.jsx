import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tags, Plus, Pencil, Trash2, Search, X, Check } from 'lucide-react';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { documentTypesAPI } from '../../config/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import '../super-admin/Administrateur.css';

const AdminDocumentTypes = () => {
    const { user } = useAuthStore();
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [formName, setFormName] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        try {
            setLoading(true);
            const response = await documentTypesAPI.getAll();
            setTypes(response.data.data || []);
        } catch (error) {
            toast.error('Erreur lors du chargement des types');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formName.trim()) return;

        try {
            setSaving(true);
            if (editingType) {
                await documentTypesAPI.update(editingType._id, { name: formName });
                toast.success('Type modifié avec succès');
            } else {
                await documentTypesAPI.create({ name: formName });
                toast.success('Type créé avec succès');
            }
            setFormName('');
            setEditingType(null);
            setShowForm(false);
            fetchTypes();
        } catch (error) {
            toast.error(error.message || 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (type) => {
        setEditingType(type);
        setFormName(type.name);
        setShowForm(true);
    };

    const handleDelete = async (type) => {
        if (!window.confirm(`Supprimer le type "${type.name}" ?`)) return;
        try {
            await documentTypesAPI.delete(type._id);
            toast.success('Type supprimé');
            fetchTypes();
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingType(null);
        setFormName('');
    };

    const filtered = types.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            <h1 className="admin-header-title">Types de documents</h1>
                            <p className="admin-header-subtitle">
                                Gérez les types de documents du service {user?.service}
                            </p>
                        </div>
                        {!showForm && (
                            <button className="btn-primary" onClick={() => setShowForm(true)}>
                                <Plus size={20} />
                                Nouveau type
                            </button>
                        )}
                    </div>

                    {/* Formulaire ajout/modification */}
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="admin-stat-card"
                            style={{ marginTop: '1rem' }}
                        >
                            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div className="admin-search" style={{ flex: 1, marginBottom: 0 }}>
                                    <input
                                        type="text"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        placeholder="Nom du type de document..."
                                        className="admin-search-input"
                                        autoFocus
                                    />
                                </div>
                                <button type="submit" className="btn-primary" disabled={saving}>
                                    <Check size={18} />
                                    {editingType ? 'Modifier' : 'Ajouter'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="admin-action-btn admin-action-btn--delete"
                                    style={{ padding: '0.6rem' }}
                                >
                                    <X size={18} />
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* Recherche */}
                    <div className="admin-search" style={{ marginTop: '1rem' }}>
                        <Search className="admin-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher un type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-search-input"
                        />
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="admin-stats">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="admin-stat-card"
                    >
                        <div className="admin-stat-content">
                            <div>
                                <p className="admin-stat-label">Total types</p>
                                <p className="admin-stat-value">{types.length}</p>
                            </div>
                            <div className="admin-stat-icon admin-stat-icon--blue">
                                <Tags size={24} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Liste */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="admin-content"
                >
                    {loading ? (
                        <div className="admin-loading">
                            <div className="admin-loading-spinner"></div>
                            <p className="admin-loading-text">Chargement...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="admin-empty">
                            <Tags className="admin-empty-icon" size={64} />
                            <h3 className="admin-empty-title">Aucun type de document</h3>
                            <p className="admin-empty-text">Créez votre premier type de document</p>
                        </div>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead className="admin-table-header">
                                    <tr>
                                        <th>Nom du type</th>
                                        <th>Service</th>
                                        <th>Date de création</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="admin-table-body">
                                    {filtered.map((type) => (
                                        <tr key={type._id}>
                                            <td>
                                                <div className="admin-table-user">
                                                    <div className="admin-stat-icon admin-stat-icon--blue" style={{ width: '2rem', height: '2rem' }}>
                                                        <Tags size={16} />
                                                    </div>
                                                    <p className="admin-table-user-name">{type.name}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="admin-badge admin-badge--admin">
                                                    {type.service}
                                                </span>
                                            </td>
                                            <td>
                                                {new Date(type.createdAt).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td>
                                                <div className="admin-table-actions">
                                                    <button
                                                        className="admin-action-btn admin-action-btn--edit"
                                                        onClick={() => handleEdit(type)}
                                                        title="Modifier"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        className="admin-action-btn admin-action-btn--delete"
                                                        onClick={() => handleDelete(type)}
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
                        </div>
                    )}
                </motion.div>
            </div>
        </AdminLayout>
    );
};

export default AdminDocumentTypes;