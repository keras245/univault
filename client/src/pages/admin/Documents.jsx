import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import '../../styles/Dashboard.css';

const AdminDocuments = () => {
    return (
        <AdminLayout>
            <div className="dashboard-page">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="dashboard-content"
                >
                    <h1 className="dashboard-title">
                        <FileText size={40} style={{ marginRight: '1rem' }} />
                        Documents
                    </h1>
                    <p className="dashboard-subtitle">
                        Gérez les documents de votre service
                    </p>
                </motion.div>
            </div>
        </AdminLayout>
    );
};

export default AdminDocuments;
