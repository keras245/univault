import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    Users,
    GraduationCap,
    Tags,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import ThemeToggle from '../../ui/ThemeToggle';
import './AdminSidebar.css';

const AdminSidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        {
            path: '/admin/dashboard',
            icon: LayoutDashboard,
            label: 'Tableau de bord',
        },
        {
            path: '/admin/students',
            icon: GraduationCap,
            label: 'Étudiants',
        },
        {
            path: '/admin/documents',
            icon: FileText,
            label: 'Documents',
        },
        {
            path: '/admin/document-types',
            icon: Tags,
            label: 'Types de documents',
        },
        {
            path: '/admin/team',
            icon: Users,
            label: 'Mon Équipe',
        }
    ];

    return (
        <aside className={`sidebar ${isExpanded ? 'sidebar--expanded' : 'sidebar--collapsed'}`}>
            {/* Header */}
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <AnimatePresence mode="wait">
                        {isExpanded ? (
                            <motion.div
                                key="expanded"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="sidebar-logo-content"
                            >
                                <div className="sidebar-logo-icon">🏛️</div>
                                <div className="sidebar-logo-text">
                                    <h2 className="sidebar-logo-title">UniVault</h2>
                                    <p className="sidebar-logo-subtitle">Portail Admin</p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="sidebar-logo-icon">🏛️</div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="sidebar-toggle"
                aria-label={isExpanded ? 'Réduire' : 'Étendre'}
            >
                {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`
                        }
                    >
                        <span className="sidebar-nav-icon">
                            <item.icon size={22} />
                        </span>
                        <AnimatePresence mode="wait">
                            {isExpanded && (
                                <motion.span
                                    key="label"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="sidebar-nav-label"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </NavLink>
                ))}
            </nav>

            {/* User Profile */}
            <div className="sidebar-profile">
                {/* Theme Toggle */}
                <div className="sidebar-theme-toggle">
                    <ThemeToggle />
                </div>

                <div className="sidebar-user">
                    <div className="sidebar-user-avatar">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <AnimatePresence mode="wait">
                        {isExpanded && (
                            <motion.div
                                key="user-info"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="sidebar-user-info"
                            >
                                <p className="sidebar-user-name">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="sidebar-user-email">{user?.service}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button onClick={handleLogout} className="sidebar-logout">
                    <LogOut size={20} />
                    <AnimatePresence mode="wait">
                        {isExpanded && (
                            <motion.span
                                key="logout-label"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                Déconnexion
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
