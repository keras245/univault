import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <AdminSidebar />
            <main className="main-layout-content">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
