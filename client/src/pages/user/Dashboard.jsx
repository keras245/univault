import { motion } from 'framer-motion';
import { FileText, Search, Bell, TrendingUp } from 'lucide-react';
import UserLayout from '../../components/layout/user/UserLayout';
import '../../styles/Dashboard.css';

const UserDashboard = () => {
    return (
        <UserLayout>
            <div className="dashboard-page">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="dashboard-content"
                >
                    <h1 className="dashboard-title">Tableau de Bord Utilisateur</h1>
                    <p className="dashboard-subtitle">
                        Bienvenue dans votre espace personnel
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem',
                        marginTop: '2rem'
                    }}>
                        {[
                            { icon: FileText, label: 'Mes Documents', value: '0', color: '#3b82f6' },
                            { icon: Search, label: 'Recherches', value: '0', color: '#10b981' },
                            { icon: Bell, label: 'Notifications', value: '0', color: '#f59e0b' },
                            { icon: TrendingUp, label: 'Activité', value: '0', color: '#8b5cf6' }
                        ].map(({ icon: Icon, label, value, color }) => (
                            <motion.div
                                key={label}
                                whileHover={{ scale: 1.02 }}
                                style={{
                                    padding: '1.5rem',
                                    background: 'var(--color-bg-elevated)',
                                    borderRadius: 'var(--radius-xl)',
                                    border: '1px solid var(--color-border)',
                                    boxShadow: 'var(--shadow-md)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '3rem',
                                        height: '3rem',
                                        background: color + '20',
                                        borderRadius: 'var(--radius-lg)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Icon size={24} color={color} />
                                    </div>
                                    <div>
                                        <p style={{ 
                                            fontSize: '0.875rem', 
                                            color: 'var(--color-text-secondary)',
                                            margin: 0
                                        }}>
                                            {label}
                                        </p>
                                        <p style={{ 
                                            fontSize: '2rem', 
                                            fontWeight: 'bold',
                                            color: 'var(--color-text-primary)',
                                            margin: 0
                                        }}>
                                            {value}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </UserLayout>
    );
};

export default UserDashboard;
