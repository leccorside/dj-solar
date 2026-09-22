import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuditLogPage } from './pages/audit/AuditLogPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RolesPage } from './pages/roles/RolesPage';
import { UsersPage } from './pages/users/UsersPage';
import { useAuthStore } from './store/auth-store';

export default function App() {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/papeis" element={<RolesPage />} />
          <Route path="/auditoria" element={<AuditLogPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
