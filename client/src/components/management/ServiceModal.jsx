import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, FileText, Users, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { servicesAPI } from '../../config/api';

const ServiceModal = ({ isOpen, onClose, service = null, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const isEditMode = !!service;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: service || {
            name: '',
            description: '',
            color: '#3B82F6',
            isActive: true
        }
    });

    useEffect(() => {
        if (service) {
            reset(service);
        } else {
            reset({
                name: '',
                description: '',
                color: '#3B82F6',
                isActive: true
            });
        }
    }, [service, reset]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            if (isEditMode) {
                await servicesAPI.update(service._id, data);
                toast.success('Service modifié avec succès');
            } else {
                await servicesAPI.create(data);
                toast.success('Service créé avec succès');
            }

            onSuccess();
            onClose();
            reset();
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const predefinedColors = [
        { name: 'Bleu', value: '#3B82F6' },
        { name: 'Violet', value: '#8B5CF6' },
        { name: 'Rose', value: '#EC4899' },
        { name: 'Vert', value: '#10B981' },
        { name: 'Orange', value: '#F59E0B' },
        { name: 'Rouge', value: '#EF4444' },
        { name: 'Cyan', value: '#06B6D4' },
        { name: 'Indigo', value: '#6366F1' }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-5 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <motion.div
                                        className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <Building2 className="w-6 h-6 text-white" />
                                    </motion.div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            {isEditMode ? 'Modifier le service' : 'Nouveau service'}
                                        </h2>
                                        <p className="text-emerald-100 text-sm">
                                            {isEditMode ? 'Mettez à jour les informations' : 'Créez un nouveau service'}
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="w-6 h-6 text-white" />
                                </motion.button>
                            </div>

                            {/* Body */}
                            <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                                <div className="space-y-6">
                                    {/* Nom du service */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Nom du service *
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                {...register('name', { required: 'Le nom est requis' })}
                                                type="text"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                                placeholder="Ex: Génie Informatique"
                                            />
                                        </div>
                                        {errors.name && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="mt-1 text-sm text-red-400"
                                            >
                                                {errors.name.message}
                                            </motion.p>
                                        )}
                                    </motion.div>

                                    {/* Description */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Description
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                            <textarea
                                                {...register('description')}
                                                rows={4}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
                                                placeholder="Description du service..."
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Couleur */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-3">
                                            Couleur du service
                                        </label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {predefinedColors.map((color, index) => (
                                                <motion.label
                                                    key={color.value}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.3 + index * 0.05 }}
                                                    className="relative cursor-pointer group"
                                                >
                                                    <input
                                                        {...register('color')}
                                                        type="radio"
                                                        value={color.value}
                                                        className="sr-only peer"
                                                    />
                                                    <div
                                                        className="w-full h-12 rounded-xl border-2 border-gray-600 peer-checked:border-white peer-checked:ring-4 peer-checked:ring-white/30 transition-all duration-200 flex items-center justify-center group-hover:scale-105"
                                                        style={{ backgroundColor: color.value }}
                                                    >
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="hidden peer-checked:block"
                                                        >
                                                            <Sparkles className="w-5 h-5 text-white" />
                                                        </motion.div>
                                                    </div>
                                                    <p className="text-xs text-gray-400 text-center mt-1">{color.name}</p>
                                                </motion.label>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Statut actif */}
                                    <motion.div
                                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-white">Service actif</p>
                                            <p className="text-xs text-gray-400 mt-1">Le service est visible et utilisable</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                {...register('isActive')}
                                                type="checkbox"
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                        </label>
                                    </motion.div>
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-700/30 border-t border-gray-700 flex items-center justify-end space-x-3">
                                <motion.button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 text-gray-300 border border-gray-600 rounded-xl hover:bg-gray-700 transition-all duration-200"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Annuler
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={loading}
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? (
                                        <span className="flex items-center space-x-2">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            <span>Enregistrement...</span>
                                        </span>
                                    ) : (
                                        isEditMode ? 'Modifier' : 'Créer'
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ServiceModal;
