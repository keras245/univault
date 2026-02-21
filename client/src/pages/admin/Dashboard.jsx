import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Tags, Clock, GraduationCap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { studentsAPI, documentsAPI, usersAPI } from '../../config/api';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import '../super-admin/Administrateur.css';

const AdminDashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const isScolarite = user?.service === 'Scolarité';

    const [time, setTime] = useState(new Date());
    const [stats, setStats] = useState({
        totalDocuments: 0,
        totalTeam: 0,
        recentDocuments: []
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Horloge
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // Équipe
            const teamResponse = await usersAPI.getAll({ service: user?.service, role: 'user' });
            const totalTeam = teamResponse.data.pagination?.total || 0;

            // Documents
            let totalDocuments = 0;
            let recentDocuments = [];

            if (isScolarite) {
                const docsResponse = await studentsAPI.getAllDocuments({ limit: 5 });
                totalDocuments = docsResponse.data.pagination?.total || 0;
                recentDocuments = docsResponse.data.data || [];
            } else {
                const docsResponse = await documentsAPI.getAll({ limit: 5 });
                totalDocuments = docsResponse.data.data?.pagination?.total || 0;
                recentDocuments = docsResponse.data.data?.documents || [];
            }

            setStats({ totalDocuments, totalTeam, recentDocuments });

            // Générer données courbe (7 derniers jours)
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                return {
                    jour: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
                    documents: Math.floor(Math.random() * (totalDocuments > 0 ? Math.min(totalDocuments, 10) : 5)) // simulé
                };
            });
            setChartData(last7Days);

        } catch (error) {
            console.error('Erreur stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (date) => date.toLocaleTimeString('fr-FR', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    const formatDate = (date) => date.toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    const formatDocDate = (date) => new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    const cards = [
        {
            label: 'Documents',
            value: stats.totalDocuments,
            icon: FileText,
            color: '#3b82f6',
            path: '/admin/documents'
        },
        {
            label: 'Mon Équipe',
            value: stats.totalTeam,
            icon: Users,
            color: '#10b981',
            path: '/admin/team'
        },
        {
            label: 'Types de documents',
            value: '→',
            icon: Tags,
            color: '#8b5cf6',
            path: '/admin/document-types'
        },
        ...(isScolarite ? [{
            label: 'Étudiants',
            value: '→',
            icon: GraduationCap,
            color: '#f59e0b',
            path: '/admin/students'
        }] : [])
    ];

    return (
        <AdminLayout>
            <div className="admin-page">

                {/* Header + Horloge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '2rem',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}
                >
                    <div>
                        <h1 className="admin-header-title">
                            Bonjour, {user?.firstName} 👋
                        </h1>
                        <p className="admin-header-subtitle">
                            Service {user?.service} — Portail Admin
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="admin-stat-card"
                        style={{ padding: '1rem 1.5rem', textAlign: 'right', minWidth: '220px' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <Clock size={20} color="var(--color-primary)" />
                            <div>
                                <p style={{
                                    fontSize: '1.6rem',
                                    fontWeight: 700,
                                    color: 'var(--color-primary)',
                                    fontVariantNumeric: 'tabular-nums',
                                    margin: 0,
                                    letterSpacing: '0.05em'
                                }}>
                                    {formatTime(time)}
                                </p>
                                <p style={{
                                    fontSize: '0.78rem',
                                    color: 'var(--color-text-secondary)',
                                    margin: 0,
                                    textTransform: 'capitalize'
                                }}>
                                    {formatDate(time)}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    {cards.map(({ label, value, icon: Icon, color, path }, index) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            whileHover={{ scale: 1.03, translateY: -4 }}
                            onClick={() => navigate(path)}
                            style={{
                                padding: '1.5rem',
                                background: 'var(--color-bg-elevated)',
                                borderRadius: 'var(--radius-xl)',
                                border: '1px solid var(--color-border)',
                                boxShadow: 'var(--shadow-md)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{
                                width: '3rem',
                                height: '3rem',
                                background: color + '20',
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1rem'
                            }}>
                                <Icon size={24} color={color} />
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                                {label}
                            </p>
                            <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                                {value}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Courbe + Documents récents */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                    {/* Courbe */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="admin-stat-card"
                        style={{ padding: '1.5rem' }}
                    >
                        <h3 style={{ marginBottom: '1.2rem', fontSize: '1rem', fontWeight: 600 }}>
                            Activité — 7 derniers jours
                        </h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis
                                    dataKey="jour"
                                    tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--color-bg-elevated)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.85rem'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="documents"
                                    stroke="#3b82f6"
                                    strokeWidth={2.5}
                                    dot={{ fill: '#3b82f6', r: 4 }}
                                    activeDot={{ r: 6 }}
                                    name="Documents"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Documents récents */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="admin-stat-card"
                        style={{ padding: '1.5rem' }}
                    >
                        <h3 style={{ marginBottom: '1.2rem', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={18} /> Documents récents
                        </h3>

                        {loading ? (
                            <div className="admin-loading"><div className="admin-loading-spinner"></div></div>
                        ) : stats.recentDocuments.length === 0 ? (
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                Aucun document pour le moment
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {stats.recentDocuments.map((doc) => (
                                    <div key={doc._id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.6rem 0.8rem',
                                        background: 'var(--color-surface)',
                                        borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--color-border)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div style={{
                                                width: '2rem', height: '2rem',
                                                background: '#3b82f620',
                                                borderRadius: 'var(--radius-md)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <FileText size={14} color="#3b82f6" />
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 500, fontSize: '0.85rem' }}>
                                                    {isScolarite
                                                        ? `${doc.student?.firstName} ${doc.student?.lastName}`
                                                        : doc.title}
                                                </p>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                                    {isScolarite ? doc.type : doc.category}
                                                </p>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                                            {formatDocDate(isScolarite ? doc.uploadedAt : doc.createdAt)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;