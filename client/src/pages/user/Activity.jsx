import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, FileText, Upload, Download, Eye } from 'lucide-react';
import UserLayout from '../../components/layout/user/UserLayout';
import { documentsAPI, studentsAPI } from '../../config/api';
import useAuthStore from '../../store/authStore';
import '../super-admin/Administrateur.css';

const UserActivity = () => {
    const { user } = useAuthStore();
    const isScolarite = user?.service === 'Scolarité';
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivity();
    }, []);

    const fetchActivity = async () => {
        try {
            setLoading(true);
            let docs = [];

            if (isScolarite) {
                const response = await studentsAPI.getAllDocuments({ limit: 50 });
                docs = (response.data.data || []).map(doc => ({
                    _id: doc._id,
                    action: 'Upload',
                    description: `${doc.type} — ${doc.student?.firstName} ${doc.student?.lastName}`,
                    matricule: doc.student?.matricule,
                    date: doc.uploadedAt,
                    icon: 'upload'
                }));
            } else {
                const response = await documentsAPI.getAll({ limit: 50 });
                docs = (response.data.data?.documents || []).map(doc => ({
                    _id: doc._id,
                    action: 'Upload',
                    description: `${doc.category} — ${doc.title}`,
                    date: doc.createdAt,
                    icon: 'upload'
                }));
            }

            // Trier par date décroissante
            docs.sort((a, b) => new Date(b.date) - new Date(a.date));
            setActivities(docs);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const getIcon = (icon) => {
        switch (icon) {
            case 'upload': return <Upload size={18} />;
            case 'view': return <Eye size={18} />;
            case 'download': return <Download size={18} />;
            default: return <FileText size={18} />;
        }
    };

    return (
        <UserLayout>
            <div className="admin-page">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="admin-header">
                    <div className="admin-header-top">
                        <div>
                            <h1 className="admin-header-title">Mon Activité</h1>
                            <p className="admin-header-subtitle">Historique de vos documents uploadés</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="admin-stats">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-stat-card">
                        <div className="admin-stat-content">
                            <div>
                                <p className="admin-stat-label">Documents uploadés</p>
                                <p className="admin-stat-value">{activities.length}</p>
                            </div>
                            <div className="admin-stat-icon admin-stat-icon--blue">
                                <Activity size={24} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Timeline */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="admin-content">
                    {loading ? (
                        <div className="admin-loading">
                            <div className="admin-loading-spinner"></div>
                            <p className="admin-loading-text">Chargement...</p>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="admin-empty">
                            <Activity className="admin-empty-icon" size={64} />
                            <h3 className="admin-empty-title">Aucune activité</h3>
                            <p className="admin-empty-text">Votre historique apparaîtra ici</p>
                        </div>
                    ) : (
                        <div style={{ padding: '1rem' }}>
                            {activities.map((activity, index) => (
                                <motion.div
                                    key={activity._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '1rem',
                                        paddingBottom: '1.2rem',
                                        marginBottom: '1.2rem',
                                        borderBottom: index < activities.length - 1 ? '1px solid var(--color-border)' : 'none'
                                    }}
                                >
                                    {/* Icône */}
                                    <div className="admin-stat-icon admin-stat-icon--blue" style={{ width: '2.5rem', height: '2.5rem', flexShrink: 0 }}>
                                        {getIcon(activity.icon)}
                                    </div>

                                    {/* Contenu */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span className="admin-badge admin-badge--admin">{activity.action}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                                {formatDate(activity.date)}
                                            </span>
                                        </div>
                                        <p style={{ marginTop: '0.4rem', fontWeight: 500 }}>{activity.description}</p>
                                        {activity.matricule && (
                                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                                                Matricule : {activity.matricule}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </UserLayout>
    );
};

export default UserActivity;