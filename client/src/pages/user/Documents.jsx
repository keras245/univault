import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import UserLayout from '../../components/layout/user/UserLayout';
import '../../styles/Dashboard.css';

const UserDocuments = () => {
    return (
        <UserLayout>
            <div className="dashboard-page">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="dashboard-content"
                >
                    <h1 className="dashboard-title">
                        <FileText size={40} style={{ marginRight: '1rem' }} />
                        Mes Documents
                    </h1>
                    <p className="dashboard-subtitle">
                        Consultez vos documents
                    </p>
                </motion.div>
            </div>
        </UserLayout>
    );
};

export default UserDocuments;
