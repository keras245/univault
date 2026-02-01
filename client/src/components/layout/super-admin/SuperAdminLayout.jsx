import SuperAdminSidebar from './SuperAdminSidebar';
import './SuperAdminLayout.css';

const SuperAdminLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <SuperAdminSidebar />
            <main className="main-layout-content">
                {children}
            </main>
        </div>
    );
};

export default SuperAdminLayout;
