import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const UnderDevelopment = ({ pageName = "cette page" }) => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl"
        >
          {/* Icône animée */}
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="inline-block mb-8"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Construction className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          {/* Titre */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Page en cours de développement
          </h1>
          
          {/* Description */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {pageName} sera bientôt disponible. Nous travaillons activement sur cette fonctionnalité.
          </p>

          {/* Liste des fonctionnalités à venir */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🚀 Fonctionnalités à venir
            </h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Interface utilisateur moderne et intuitive
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Gestion avancée des données
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                Statistiques et rapports détaillés
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                Export et import de données
              </li>
            </ul>
          </div>

          {/* Bouton retour */}
          <motion.button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au tableau de bord
          </motion.button>

          {/* Note en bas */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
            💡 En attendant, vous pouvez gérer les utilisateurs depuis la section <strong>Gestion</strong>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default UnderDevelopment;
