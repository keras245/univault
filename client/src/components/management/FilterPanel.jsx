import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter as FilterIcon, RotateCcw } from 'lucide-react';

const FilterPanel = ({ isOpen, onClose, filters, onFilterChange, onReset }) => {
    const services = [
        'Scolarité',
        'Comptabilité',
        'Ressources Humaines',
        'Génie Informatique',
        'Droit',
        'Administration',
        'Autre'
    ];

    const statuses = [
        { value: 'all', label: 'Tous' },
        { value: 'active', label: 'Actifs' },
        { value: 'inactive', label: 'Inactifs' }
    ];

    const roles = [
        { value: 'all', label: 'Tous' },
        { value: 'user', label: 'Utilisateurs' },
        { value: 'admin', label: 'Administrateurs' },
        { value: 'super-admin', label: 'Super Admins' }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ type: "spring", duration: 0.4 }}
                    className="bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <FilterIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Filtres avancés</h3>
                                <p className="text-sm text-gray-400">Affinez votre recherche</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="space-y-6">
                        {/* Service Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Service
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {services.map(service => (
                                    <motion.button
                                        key={service}
                                        onClick={() => onFilterChange('service', service)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filters.service === service
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {service}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Statut
                            </label>
                            <div className="flex space-x-2">
                                {statuses.map(status => (
                                    <motion.button
                                        key={status.value}
                                        onClick={() => onFilterChange('status', status.value)}
                                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filters.status === status.value
                                                ? 'bg-green-600 text-white shadow-lg'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {status.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Role Filter (optional) */}
                        {filters.hasOwnProperty('role') && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Rôle
                                </label>
                                <div className="flex space-x-2">
                                    {roles.map(role => (
                                        <motion.button
                                            key={role.value}
                                            onClick={() => onFilterChange('role', role.value)}
                                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filters.role === role.value
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {role.label}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-gray-700 flex items-center justify-between">
                        <button
                            onClick={onReset}
                            className="flex items-center px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Réinitialiser
                        </button>
                        <motion.button
                            onClick={onClose}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Appliquer
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FilterPanel;
