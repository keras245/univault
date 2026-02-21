import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';

// Public Pages
import Login from './pages/public/Login';

// Super Admin Pages
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import Administrateur from './pages/super-admin/Administrateur';
import Gestion from './pages/super-admin/Gestion';
import SuperAdminDocuments from './pages/super-admin/Documents';

// Admin Pages (Chefs de service)
import AdminDashboard from './pages/admin/Dashboard';
import AdminDocuments from './pages/admin/Documents';
import AdminDocumentTypes from './pages/admin/DocumentTypes';
import AdminTeam from './pages/admin/Team';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import UserDocuments from './pages/user/Documents';
import UserSearch from './pages/user/Search';
import UserNotifications from './pages/user/Notifications';

// Scolarité Pages (partagées Admin & User)
import Students from './pages/scolarite/Students';
import StudentFolder from './pages/scolarite/StudentFolder';
import SuperAdminLayout from './components/layout/super-admin/SuperAdminLayout';
import AdminLayout from './components/layout/admin/AdminLayout';
import UserLayout from './components/layout/user/UserLayout';

import './index.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si allowedRoles est spécifié, vérifier le rôle
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    // Redirection basée sur le rôle
    if (user?.role === 'super-admin') {
      return <Navigate to="/super-admin/dashboard" replace />;
    }
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user?.role === 'user') {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return children;
};

function App() {
  const { theme } = useThemeStore();

  // Appliquer le thème au montage
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* ========== SUPER ADMIN ROUTES ========== */}
          <Route
            path="/super-admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['super-admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/administrateur"
            element={
              <ProtectedRoute allowedRoles={['super-admin']}>
                <Administrateur />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestion"
            element={
              <ProtectedRoute allowedRoles={['super-admin']}>
                <Gestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/students"
            element={
              <ProtectedRoute allowedRoles={['super-admin']}>
                <Students Layout={SuperAdminLayout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/students/:id"
            element={
              <ProtectedRoute allowedRoles={['super-admin']}>
                <StudentFolder Layout={SuperAdminLayout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/documents"
            element={
              <ProtectedRoute allowedRoles={['super-admin']}>
                <SuperAdminDocuments />
              </ProtectedRoute>
            }
          />

          {/* ========== ADMIN ROUTES (Chefs de service) ========== */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Students Layout={AdminLayout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <StudentFolder Layout={AdminLayout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/documents"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDocuments />
              </ProtectedRoute>
            }
          />
          <Route
              path="/admin/document-types"
              element={
                  <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDocumentTypes />
                  </ProtectedRoute>
              }
          />
          <Route
            path="/admin/team"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminTeam />
              </ProtectedRoute>
            }
          />

          {/* ========== USER ROUTES ========== */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/students"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Students Layout={UserLayout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/students/:id"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <StudentFolder Layout={UserLayout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/documents"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDocuments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/search"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/notifications"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserNotifications />
              </ProtectedRoute>
            }
          />

          {/* ========== DEFAULT REDIRECTS ========== */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Backward compatibility */}
          <Route path="/dashboard" element={<Navigate to="/super-admin/dashboard" replace />} />

          {/* ========== UNAUTHORIZED ========== */}
          <Route
            path="/unauthorized"
            element={
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</h1>
                <h2>Accès non autorisé</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                </p>
              </div>
            }
          />

          {/* ========== 404 ========== */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
