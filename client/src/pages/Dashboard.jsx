import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <MainLayout>
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
        </MainLayout>
    );
};

export default Dashboard;
