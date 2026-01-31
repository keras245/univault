import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Building2, Shield, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { usersAPI } from '../../config/api';

const UserModal = ({ isOpen, onClose, user = null, onSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const isEditMode = !!user;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: user || {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            service: 'Scolarité',
            role: 'user',
            isActive: true
        }
    });

    useEffect(() => {
        if (user) {
            reset(user);
        } else {
            reset({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                service: 'Scolarité',
                role: 'user',
                isActive: true
            });
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            if (isEditMode) {
                await usersAPI.update(user._id, data);
                toast.success('Utilisateur modifié avec succès');
            } else {
                await usersAPI.create(data);
                toast.success('Utilisateur créé avec succès');
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

    const services = [
        'Scolarité',
        'Comptabilité',
        'Ressources Humaines',
        'Génie Informatique',
        'Droit',
        'Administration',
        'Autre'
    ];

    const roles = [
        { value: 'user', label: 'Utilisateur', color: 'purple' },
        { value: 'admin', label: 'Administrateur', color: 'blue' },
        { value: 'super-admin', label: 'Super Admin', color: 'red' }
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
                            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            {isEditMode ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                                        </h2>
                                        <p className="text-blue-100 text-sm">
                                            {isEditMode ? 'Mettez à jour les informations' : 'Créez un nouveau compte utilisateur'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            {/* Body */}
                            <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                                <div className="space-y-6">
                                    {/* Nom et Prénom */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Prénom *
                                            </label>
                                            <input
                                                {...register('firstName', { required: 'Le prénom est requis' })}
                                                type="text"
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                placeholder="John"
                                            />
                                            {errors.firstName && (
                                                <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Nom *
                                            </label>
                                            <input
                                                {...register('lastName', { required: 'Le nom est requis' })}
                                                type="text"
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                placeholder="Doe"
                                            />
                                            {errors.lastName && (
                                                <p className="mt-1 text-sm text-red-400">{errors.lastName.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                {...register('email', {
                                                    required: 'L\'email est requis',
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: 'Email invalide'
                                                    }
                                                })}
                                                type="email"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                placeholder="john.doe@unc.edu"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* Mot de passe (seulement en création) */}
                                    {!isEditMode && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Mot de passe *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    {...register('password', {
                                                        required: 'Le mot de passe est requis',
                                                        minLength: {
                                                            value: 6,
                                                            message: 'Minimum 6 caractères'
                                                        }
                                                    })}
                                                    type={showPassword ? 'text' : 'password'}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Service */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Service *
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <select
                                                {...register('service', { required: 'Le service est requis' })}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                                            >
                                                {services.map(service => (
                                                    <option key={service} value={service}>{service}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Rôle */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Rôle *
                                        </label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <select
                                                {...register('role', { required: 'Le rôle est requis' })}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                                            >
                                                {roles.map(role => (
                                                    <option key={role.value} value={role.value}>{role.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Statut actif */}
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
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-700/30 border-t border-gray-700 flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 text-gray-300 border border-gray-600 rounded-xl hover:bg-gray-700 transition-all duration-200"
                                >
                                    Annuler
                                </button>
                                <motion.button
                                    type="submit"
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={loading}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? 'Enregistrement...' : (isEditMode ? 'Modifier' : 'Créer')}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UserModal;
