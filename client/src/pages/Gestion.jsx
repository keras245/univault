import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Building2, 
  Search, 
  Filter,
  Download,
  Upload,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import UsersManagement from '../components/management/UsersManagement';
import ServicesManagement from '../components/management/ServicesManagement';
import './Gestion.css';

const Gestion = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { 
      id: 'users', 
      label: 'Utilisateurs', 
      icon: Users,
      count: 0,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: 'Gérer les comptes utilisateurs'
    },
    { 
      id: 'services', 
      label: 'Services', 
      icon: Building2,
      count: 0,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      description: 'Gérer les services'
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <MainLayout>
      <div className="gestion-page">
        {/* En-tête avec statistiques */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gestion-header"
        >
          <div className="gestion-header-content">
            <div>
              <h1 className="gestion-title">
                Gestion
              </h1>
              <p className="gestion-subtitle">
                Gérer les utilisateurs et les services de la plateforme
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="gestion-search">
            <Search className="gestion-search-icon" size={20} />
            <input
              type="text"
              placeholder={`Rechercher ${currentTab?.label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="gestion-search-input"
            />
          </div>
        </motion.div>

        {/* Onglets */}
        <div className="gestion-tabs">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`gestion-tab ${activeTab === tab.id ? 'gestion-tab--active' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="gestion-tab-icon">
                <tab.icon size={20} />
              </div>
              <div className="gestion-tab-content">
                <span className="gestion-tab-label">{tab.label}</span>
                <span className="gestion-tab-description">{tab.description}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Contenu des onglets */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'users' && <UsersManagement searchTerm={searchTerm} />}
            {activeTab === 'services' && <ServicesManagement searchTerm={searchTerm} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default Gestion;
