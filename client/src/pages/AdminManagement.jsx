import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, User, Mail, Building2, Shield, Eye, EyeOff, LogOut, Crown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { usersAPI } from '../config/api';
import useAuthStore from '../store/authStore';

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const currentUser = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const response = await usersAPI.getAll({ role: 'admin,super-admin' });
            setAdmins(response.data.data || []);
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors du chargement des administrateurs');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        reset({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            service: 'Administration',
            role: 'admin',
            isActive: true
        });
        setSelectedAdmin(null);
        setIsModalOpen(true);
    };

    const handleEdit = (admin) => {
        reset(admin);
        setSelectedAdmin(admin);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
            try {
                await usersAPI.delete(id);
                toast.success('Administrateur supprimé avec succès');
                fetchAdmins();
            } catch (error) {
                console.error('Erreur:', error);
                toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            if (selectedAdmin) {
                await usersAPI.update(selectedAdmin._id, data);
                toast.success('Administrateur modifié avec succès');
            } else {
                await usersAPI.create(data);
                toast.success('Administrateur créé avec succès');
            }
            setIsModalOpen(false);
            fetchAdmins();
            reset();
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error.response?.data?.message || 'Une erreur est survenue');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700/50 px-8 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Gestion des Administrateurs
                        </h1>
                        <p className="text-gray-400 text-sm mt-2">
                            Gérer les comptes administrateurs de la plateforme
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right mr-4">
                            <p className="text-sm text-gray-400">Connecté en tant que</p>
                            <p className="font-semibold">{currentUser?.firstName} {currentUser?.lastName}</p>
                        </div>
                        <motion.button
                            onClick={handleCreate}
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all shadow-lg hover:shadow-xl"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Nouvel administrateur
                        </motion.button>
                        <motion.button
                            onClick={logout}
                            className="flex items-center px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            Déconnexion
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto p-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-400 text-sm font-medium mb-1">Total Administrateurs</p>
                                <p className="text-4xl font-bold">{admins.length}</p>
                            </div>
                            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <Shield className="w-7 h-7 text-blue-400" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-400 text-sm font-medium mb-1">Comptes Actifs</p>
                                <p className="text-4xl font-bold">{admins.filter(a => a.isActive).length}</p>
                            </div>
                            <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <User className="w-7 h-7 text-green-400" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-400 text-sm font-medium mb-1">Super-Admins</p>
                                <p className="text-4xl font-bold">{admins.filter(a => a.role === 'super-admin').length}</p>
                            </div>
                            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <Crown className="w-7 h-7 text-purple-400" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl"
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700/50">
                            <thead className="bg-gray-700/30">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Administrateur
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Service
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Rôle
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/30">
                                {admins.map((admin, index) => (
                                    <motion.tr
                                        key={admin._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-700/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                                                    {admin.firstName?.charAt(0)}{admin.lastName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold">{admin.firstName} {admin.lastName}</div>
                                                    <div className="text-xs text-gray-400">ID: {admin._id.slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-300">
                                                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                                {admin.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-300">
                                                <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                                                {admin.service}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${admin.role === 'super-admin'
                                                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30'
                                                    : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30'
                                                }`}>
                                                {admin.role === 'super-admin' ? '👑 Super Admin' : '🛡️ Admin'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${admin.isActive
                                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                                }`}>
                                                {admin.isActive ? '✓ Actif' : '✗ Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <motion.button
                                                    onClick={() => handleEdit(admin)}
                                                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => handleDelete(admin._id)}
                                                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
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

                        {admins.length === 0 && (
                            <div className="text-center py-16">
                                <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg mb-2">Aucun administrateur trouvé</p>
                                <button
                                    onClick={handleCreate}
                                    className="mt-4 text-blue-400 hover:text-blue-300 font-medium"
                                >
                                    Créer le premier administrateur →
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                        />
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl"
                            >
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 rounded-t-2xl flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                            <User className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">
                                                {selectedAdmin ? 'Modifier' : 'Nouvel'} administrateur
                                            </h2>
                                            <p className="text-blue-100 text-sm">
                                                {selectedAdmin ? 'Mettez à jour les informations' : 'Créez un nouveau compte'}
                                            </p>
                                        </div>
                                    </div>
                                    <motion.button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <X className="w-6 h-6 text-white" />
                                    </motion.button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-300">Prénom *</label>
                                            <input
                                                {...register('firstName', { required: 'Requis' })}
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="John"
                                            />
                                            {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-300">Nom *</label>
                                            <input
                                                {...register('lastName', { required: 'Requis' })}
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Doe"
                                            />
                                            {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-300">Email *</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                {...register('email', { required: 'Requis', pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' } })}
                                                type="email"
                                                className="w-full pl-11 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="john.doe@unc.edu"
                                            />
                                        </div>
                                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                                    </div>

                                    {!selectedAdmin && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-300">Mot de passe *</label>
                                            <div className="relative">
                                                <input
                                                    {...register('password', { required: 'Requis', minLength: { value: 6, message: 'Min 6 caractères' } })}
                                                    type={showPassword ? 'text' : 'password'}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-300">Service *</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <select
                                                {...register('service', { required: 'Requis' })}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="Administration">Administration</option>
                                                <option value="Scolarité">Scolarité</option>
                                                <option value="Comptabilité">Comptabilité</option>
                                                <option value="Ressources Humaines">Ressources Humaines</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-300">Rôle *</label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <select
                                                {...register('role', { required: 'Requis' })}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="super-admin">Super Admin</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                                        <div>
                                            <p className="text-sm font-medium text-white">Compte actif</p>
                                            <p className="text-xs text-gray-400 mt-1">L'utilisateur peut se connecter</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                {...register('isActive')}
                                                type="checkbox"
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                                        <motion.button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Annuler
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all shadow-lg"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {selectedAdmin ? 'Modifier' : 'Créer'}
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminManagement;
