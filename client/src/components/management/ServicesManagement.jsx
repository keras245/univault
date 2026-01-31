import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Building2,
    Users,
    FileText,
    TrendingUp,
    Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { servicesAPI } from '../../config/api';
import ServiceModal from './ServiceModal';

const ServicesManagement = ({ searchTerm }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await servicesAPI.getAll();
            setServices(response.data.data || []);
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors du chargement des services');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedService(null);
        setIsModalOpen(true);
    };

    const handleEdit = (service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const handleDelete = async (service) => {
        if (service.members && service.members.length > 0) {
            toast.error('Impossible de supprimer un service avec des membres');
            return;
        }

        if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${service.name}" ?`)) {
            try {
                await servicesAPI.delete(service._id);
                toast.success('Service supprimé avec succès');
                fetchServices();
            } catch (error) {
                console.error('Erreur:', error);
                toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
            }
        }
    };

    const filteredServices = services.filter(service =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalMembers = services.reduce((sum, s) => (s.members?.length || 0) + sum, 0);
    const activeServices = services.filter(s => s.isActive).length;

    const getColorClasses = (color) => {
        const colorMap = {
            '#3B82F6': 'from-blue-500 to-blue-600',
            '#8B5CF6': 'from-purple-500 to-purple-600',
            '#EC4899': 'from-pink-500 to-pink-600',
            '#10B981': 'from-green-500 to-green-600',
            '#F59E0B': 'from-orange-500 to-orange-600',
            '#EF4444': 'from-red-500 to-red-600',
            '#06B6D4': 'from-cyan-500 to-cyan-600',
            '#6366F1': 'from-indigo-500 to-indigo-600',
        };
        return colorMap[color] || 'from-gray-500 to-gray-600';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="w-12 h-12 text-blue-500" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* En-tête avec actions */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-gray-700 rounded-xl p-1">
                        <motion.button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${viewMode === 'grid'
                                    ? 'bg-gray-600 text-white shadow-sm'
                                    : 'text-gray-300'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Grille
                        </motion.button>
                        <motion.button
                            onClick={() => setViewMode('table')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${viewMode === 'table'
                                    ? 'bg-gray-600 text-white shadow-sm'
                                    : 'text-gray-300'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Tableau
                        </motion.button>
                    </div>
                </div>

                <motion.button
                    onClick={handleCreate}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nouveau service
                </motion.button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-400 text-sm font-medium">Total Services</p>
                            <p className="text-3xl font-bold text-emerald-100 mt-1">{services.length}</p>
                        </div>
                        <Building2 className="w-10 h-10 text-emerald-400" />
                    </div>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-400 text-sm font-medium">Actifs</p>
                            <p className="text-3xl font-bold text-blue-100 mt-1">{activeServices}</p>
                        </div>
                        <TrendingUp className="w-10 h-10 text-blue-400" />
                    </div>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-400 text-sm font-medium">Membres Total</p>
                            <p className="text-3xl font-bold text-purple-100 mt-1">{totalMembers}</p>
                        </div>
                        <Users className="w-10 h-10 text-purple-400" />
                    </div>
                </motion.div>
            </div>

            {/* Liste des services */}
            <AnimatePresence mode="wait">
                {filteredServices.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-16"
                    >
                        <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">Aucun service trouvé</p>
                        <p className="text-gray-500 text-sm mt-2">
                            {searchTerm ? 'Essayez une autre recherche' : 'Créez votre premier service'}
                        </p>
                    </motion.div>
                ) : viewMode === 'grid' ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredServices.map((service, index) => (
                            <motion.div
                                key={service._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 hover:shadow-lg hover:border-gray-600 transition-all duration-300 group"
                                whileHover={{ y: -4 }}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <motion.div
                                            className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(service.color)} rounded-xl flex items-center justify-center`}
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Building2 className="w-6 h-6 text-white" />
                                        </motion.div>
                                        <div>
                                            <h3 className="font-semibold text-white text-lg">{service.name}</h3>
                                            <p className="text-sm text-gray-400 line-clamp-1">{service.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-700/50 rounded-lg p-3">
                                        <div className="flex items-center space-x-2">
                                            <Users className="w-4 h-4 text-blue-400" />
                                            <span className="text-xs text-gray-400">Membres</span>
                                        </div>
                                        <p className="text-xl font-bold text-white mt-1">{service.members?.length || 0}</p>
                                    </div>
                                    <div className="bg-gray-700/50 rounded-lg p-3">
                                        <div className="flex items-center space-x-2">
                                            <FileText className="w-4 h-4 text-purple-400" />
                                            <span className="text-xs text-gray-400">Documents</span>
                                        </div>
                                        <p className="text-xl font-bold text-white mt-1">{service.documentCount || 0}</p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                    <span
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${service.isActive
                                                ? 'bg-green-500/20 text-green-300'
                                                : 'bg-red-500/20 text-red-300'
                                            }`}
                                    >
                                        {service.isActive ? 'Actif' : 'Inactif'}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <motion.button
                                            onClick={() => handleEdit(service)}
                                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDelete(service)}
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
                    </motion.div>
                ) : (
                    /* Vue en tableau */
                    <motion.div
                        key="table"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Service
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Membres
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
                                    {filteredServices.map((service, index) => (
                                        <motion.tr
                                            key={service._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="hover:bg-gray-700/50 transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div
                                                        className={`w-10 h-10 bg-gradient-to-r ${getColorClasses(service.color)} rounded-xl flex items-center justify-center mr-4`}
                                                    >
                                                        <Building2 className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="text-sm font-medium text-white">{service.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-300 max-w-xs truncate">{service.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-white font-medium">{service.members?.length || 0}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${service.isActive
                                                            ? 'bg-green-500/20 text-green-300'
                                                            : 'bg-red-500/20 text-red-300'
                                                        }`}
                                                >
                                                    {service.isActive ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <motion.button
                                                        onClick={() => handleEdit(service)}
                                                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleDelete(service)}
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
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal */}
            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedService(null);
                }}
                service={selectedService}
                onSuccess={fetchServices}
            />
        </div>
    );
};

export default ServicesManagement;
