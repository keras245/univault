import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <Sidebar />
            <main className="main-layout-content">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
