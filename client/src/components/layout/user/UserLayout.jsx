import UserSidebar from './UserSidebar';
import './UserLayout.css';

const UserLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <UserSidebar />
            <main className="main-layout-content">
                {children}
            </main>
        </div>
    );
};

export default UserLayout;
