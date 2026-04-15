import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './core/landing/pages/Home';
import Login from './core/auth/pages/Login';
import Register from './core/auth/pages/Register';
import DashboardLayout from './core/dashboard/components/DashboardLayout';
import DashboardHome from './core/dashboard/pages/DashboardHome';
import SelectModules from './core/onboarding/pages/SelectModules';
import { ProtectedRoute } from './core/auth/components/ProtectedRoute';

// ✅ Componente para redirección externa (SIN Navigate)
const ExternalRedirect = ({ to }) => {
  window.location.href = to;
  return null;
};

function App() {
  const hostname = window.location.hostname;
  const isAdmin = hostname.startsWith('admin.');

  if (isAdmin) {
    const tenant = JSON.parse(localStorage.getItem('tenant') || '{}');
    
    return (
      <Routes>
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <SelectModules />
          </ProtectedRoute>
        } />
        
        <Route path="/:slug/*" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
        </Route>
        
        {/* ✅ Usar ExternalRedirect en lugar de Navigate */}
        <Route path="/login" element={<ExternalRedirect to="https://jgsystemsgt.com/login" />} />
        <Route path="*" element={<ExternalRedirect to={`https://admin.jgsystemsgt.com/${tenant.slug || ''}`} />} />
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