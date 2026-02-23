import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Mail, Building2, Lock, Check, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../../config/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import '../super-admin/Administrateur.css';
import AdminLayout from '../../components/layout/admin/AdminLayout';

const AdminProfile = () => {
    const { user } = useAuthStore();
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [saving, setSaving] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error('Les mots de passe ne correspondent pas');
        }
        if (passwords.newPassword.length < 6) {
            return toast.error('Le mot de passe doit contenir au moins 6 caractères');
        }

        try {
            setSaving(true);
            await authAPI.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            toast.success('Mot de passe modifié avec succès');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.message || 'Erreur lors du changement de mot de passe');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="admin-header">
                    <div className="admin-header-top">
                        <div>
                            <h1 className="admin-header-title">Mon Profil</h1>
                            <p className="admin-header-subtitle">Vos informations personnelles</p>
                        </div>
                    </div>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>

                    {/* Infos */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-stat-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 600 }}>Informations</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="admin-stat-icon admin-stat-icon--blue" style={{ width: '2.5rem', height: '2.5rem', flexShrink: 0 }}>
                                    <UserCircle size={20} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Nom complet</p>
                                    <p style={{ fontWeight: 600 }}>{user?.firstName} {user?.lastName}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="admin-stat-icon admin-stat-icon--blue" style={{ width: '2.5rem', height: '2.5rem', flexShrink: 0 }}>
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Email</p>
                                    <p style={{ fontWeight: 600 }}>{user?.email}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="admin-stat-icon admin-stat-icon--blue" style={{ width: '2.5rem', height: '2.5rem', flexShrink: 0 }}>
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Service</p>
                                    <p style={{ fontWeight: 600 }}>{user?.service}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Changer mot de passe */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-stat-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Lock size={18} /> Changer le mot de passe
                        </h3>

                        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <label className="input-label">Mot de passe actuel</label>
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
                                    placeholder="••••••••"
                                    className="admin-search-input"
                                    style={{ width: '100%' }}
                                />
                                <button type="button" onClick={() => setShowCurrentPassword(p => !p)}
                                    style={{ position: 'absolute', right: '0.75rem', top: '65%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 0, display: 'flex' }}>
                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <label className="input-label">Nouveau mot de passe</label>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                                    placeholder="••••••••"
                                    className="admin-search-input"
                                    style={{ width: '100%' }}
                                />
                                <button type="button" onClick={() => setShowNewPassword(p => !p)}
                                    style={{ position: 'absolute', right: '0.75rem', top: '65%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 0, display: 'flex' }}>
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <label className="input-label">Confirmer le mot de passe</label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
                                    placeholder="••••••••"
                                    className="admin-search-input"
                                    style={{ width: '100%' }}
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(p => !p)}
                                    style={{ position: 'absolute', right: '0.75rem', top: '65%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 0, display: 'flex' }}>
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: '0.5rem' }}>
                                <Check size={18} />
                                {saving ? 'Sauvegarde...' : 'Modifier le mot de passe'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProfile;