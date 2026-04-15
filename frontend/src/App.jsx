import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './core/landing/pages/Home';
import Login from './core/auth/pages/Login';
import Register from './core/auth/pages/Register';
import DashboardLayout from './core/dashboard/components/DashboardLayout';
import DashboardHome from './core/dashboard/pages/DashboardHome';
import SelectModules from './core/onboarding/pages/SelectModules';
import { ProtectedRoute } from './core/auth/components/ProtectedRoute';

const ExternalRedirect = ({ to }) => {
  window.location.href = to;
  return null;
};

function App() {
  const hostname = window.location.hostname;
  const isAdmin = hostname.startsWith('admin.');

  if (isAdmin) {
    const tenant = JSON.parse(localStorage.getItem('tenant') || '{}');
    const slug = tenant.slug || '';
    
    // ✅ Si no hay slug, redirigir al login (sesión corrupta)
    if (!slug) {
      localStorage.clear();
      return <ExternalRedirect to="https://jgsystemsgt.com/login" />;
    }
    
    return (
      <Routes>
        {/* Onboarding - con slug en la URL */}
        <Route path="/:slug/onboarding" element={
          <ProtectedRoute>
            <SelectModules />
          </ProtectedRoute>
        } />
        
        {/* Dashboard - con slug en la URL */}
        <Route path="/:slug/*" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
        </Route>
        
        {/* Redirecciones */}
        <Route path="/" element={<ExternalRedirect to={`https://admin.jgsystemsgt.com/${slug}/dashboard`} />} />
        <Route path="*" element={<ExternalRedirect to="https://jgsystemsgt.com/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;