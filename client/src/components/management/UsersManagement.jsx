import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    MoreVertical,
    Mail,
    Users as UsersIcon,
    Filter,
    Download,
    Calendar,
    Building2
} from 'lucide-react';
import { usersAPI } from '../../config/api';
import toast from 'react-hot-toast';
import UserModal from './UserModal';
import FilterPanel from './FilterPanel';

const UsersManagement = ({ searchTerm }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filters, setFilters] = useState({
        service: 'all',
        status: 'all'
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // TODO: Créer endpoint /api/users?role=user
            const response = await usersAPI.getAll({ role: 'user' });
            setUsers(response.data.data || []);
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors du chargement des utilisateurs');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await usersAPI.delete(id);
                toast.success('Utilisateur supprimé avec succès');
                fetchUsers();
            } catch (error) {
                console.error('Erreur:', error);
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setShowModal(true);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleResetFilters = () => {
        setFilters({ service: 'all', status: 'all' });
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.service?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesService = filters.service === 'all' || user.service === filters.service;
        const matchesStatus = filters.status === 'all' ||
            (filters.status === 'active' && user.isActive) ||
            (filters.status === 'inactive' && !user.isActive);

        return matchesSearch && matchesService && matchesStatus;
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* En-tête avec actions */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-gray-700 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${viewMode === 'grid'
                                ? 'bg-gray-600 text-white shadow-sm'
                                : 'text-gray-300'
                                }`}
                        >
                            Grille
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${viewMode === 'table'
                                ? 'bg-gray-600 text-white shadow-sm'
                                : 'text-gray-300'
                                }`}
                        >
                            Tableau
                        </button>
                    </div>
                    <button className="flex items-center px-4 py-2 border border-gray-600 rounded-xl hover:bg-gray-700 transition-colors duration-200">
                        <Filter className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-gray-300">Filtres</span>
                    </button>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="flex items-center px-4 py-2 text-gray-300 border border-gray-600 rounded-xl hover:bg-gray-700 transition-colors duration-200">
                        <Download className="w-5 h-5 mr-2" />
                        Exporter
                    </button>
                    <motion.button
                        onClick={handleCreate}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Nouvel utilisateur
                    </motion.button>
                </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-400 text-sm font-medium">Total</p>
                            <p className="text-2xl font-bold text-purple-100">{users.length}</p>
                        </div>
                        <UsersIcon className="w-8 h-8 text-purple-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-400 text-sm font-medium">Actifs</p>
                            <p className="text-2xl font-bold text-green-100">{users.filter(u => u.isActive).length}</p>
                        </div>
                        <UsersIcon className="w-8 h-8 text-green-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-400 text-sm font-medium">Services</p>
                            <p className="text-2xl font-bold text-blue-100">{[...new Set(users.map(u => u.service))].length}</p>
                        </div>
                        <Building2 className="w-8 h-8 text-blue-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-400 text-sm font-medium">Ce mois</p>
                            <p className="text-2xl font-bold text-orange-100">+5</p>
                        </div>
                        <Calendar className="w-8 h-8 text-orange-400" />
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            {viewMode === 'grid' ? (
                /* Vue en grille */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user, index) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 hover:shadow-lg hover:border-gray-600 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{user.firstName} {user.lastName}</h3>
                                        <p className="text-xs text-gray-400">{user.service}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-sm text-gray-300">
                                    <Mail className="w-4 h-4 mr-3 text-gray-500" />
                                    {user.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-300">
                                    <Building2 className="w-4 h-4 mr-3 text-gray-500" />
                                    {user.service}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.isActive
                                    ? 'bg-green-500/20 text-green-300'
                                    : 'bg-red-500/20 text-red-300'
                                    }`}>
                                    {user.isActive ? 'Actif' : 'Inactif'}
                                </span>
                                <div className="flex items-center space-x-2">
                                    <motion.button
                                        onClick={() => handleEdit(user)}
                                        className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors duration-200"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                        onClick={() => handleDelete(user._id)}
                                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                /* Vue en tableau */
                <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Utilisateur
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Service
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-700/50 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-4">
                                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-400">{user.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-white">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-500/20 text-purple-300">
                                                {user.service}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive
                                                ? 'bg-green-500/20 text-green-300'
                                                : 'bg-red-500/20 text-red-300'
                                                }`}>
                                                {user.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <motion.button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors duration-200"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Message si aucun résultat */}
            {filteredUsers.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <UsersIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Aucun utilisateur trouvé</h3>
                    <p className="text-gray-400 mb-6">
                        {searchTerm ? 'Aucun résultat pour votre recherche.' : 'Commencez par ajouter votre premier utilisateur.'}
                    </p>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Ajouter un utilisateur
                    </button>
                </motion.div>
            )}

            {/* Modale */}
            <UserModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                onSuccess={fetchUsers}
            />

            {/* Panneau de filtres */}
            <div className="fixed top-24 right-6 z-40">
                <FilterPanel
                    isOpen={showFilters}
                    onClose={() => setShowFilters(false)}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                />
            </div>
        </div>
    );
};

export default UsersManagement;
