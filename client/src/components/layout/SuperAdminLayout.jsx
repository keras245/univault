import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { 
    chevronLeft,
    LogOut,
    BarChart3,
    Users,
    GraduationCap,
    Calendar,
    CheckSquare,
    MessageSquare,
    Bell,
    User,
    Settings
} from 'lucide-react';

const menuItems = [
    { title: 'Tableau de bord', path: '/superadmin/dashboard', icon: BarChart3, color: 'from-blue-500 to-blue-600' },
    { title: 'Utilisateurs', path: '/superadmin/management', icon: Users, color: 'from-purple-500 to-purple-600' },
    { title: 'Settings', path: '/superadmin/settings', icon: Settings, color: 'from-purple-500 to-purple-600' }, 
];

export default function SuperAdminLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem?.title || 'Tableau de bord';
  };

  const handleSettingsClick = () => {
    navigate('/superadmin/settings');
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  
}