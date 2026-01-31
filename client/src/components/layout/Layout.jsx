
import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Files,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Search,
    Bell
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import './Layout.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
        { path: '/documents', label: 'Documents', icon: Files },
        { path: '/management', label: 'Gestion', icon: Users, role: ['admin', 'super-admin'] },
        { path: '/settings', label: 'Paramètres', icon: Settings },
    ];

    return (
        <motion.aside
            className={`sidebar ${isOpen ? 'open' : ''}`}
            initial={false}
        >
            <div className="sidebar-header">
                <div className="sidebar-logo-icon">🏛️</div>
                <h1 className="sidebar-logo-text gradient-text">UniVault</h1>
                <button className="md:hidden ml-auto" onClick={toggleSidebar}>
                    <X size={24} />
                </button>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    if (item.role && !item.role.includes(user?.role)) return null;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                        >
                            <item.icon className="nav-item-icon" />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <div className="user-info">
                        <div className="user-name">{user?.firstName} {user?.lastName}</div>
                        <div className="user-role">{user?.role}</div>
                    </div>
                </div>
                <button className="btn btn--ghost btn--full-width text-error" onClick={handleLogout}>
                    <LogOut size={18} className="mr-2" />
                    Déconnexion
                </button>
            </div>
        </motion.aside>
    );
};

const Topbar = ({ toggleSidebar }) => {
    const { user } = useAuthStore();

    return (
        <header className="topbar">
            <div className="flex items-center gap-4">
                <button className="lg:hidden text-gray-400" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <div className="hidden md:flex relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 w-64"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative text-gray-400 hover:text-white transition-colors">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="text-sm text-right hidden md:block">
                    <div className="text-gray-200 font-medium">{user?.service}</div>
                    <div className="text-gray-500 text-xs">Université Nongo Conakry</div>
                </div>
            </div>
        </header>
    );
};

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="layout">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="main-content">
                <Topbar toggleSidebar={toggleSidebar} />
                <main className="page-content">
                    {children}
                </main>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[1020] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default Layout;
