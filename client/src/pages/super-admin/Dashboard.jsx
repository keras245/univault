import { motion } from 'framer-motion';
import SuperAdminLayout from '../../components/layout/super-admin/SuperAdminLayout';
import '../../styles/Dashboard.css';

const Dashboard = () => {
    return (
        <SuperAdminLayout>
            <div className="dashboard-page">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="dashboard-content"
                >
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Cette page sera développée prochainement
                    </p>
                </motion.div>
            </div>
        </SuperAdminLayout>
    );
};

export default Dashboard;
