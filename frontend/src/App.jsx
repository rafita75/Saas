import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Home } from './core/landing/pages/Home';
import Login from './core/auth/pages/Login';
import SelectTenant from './core/auth/pages/SelectTenant';
import Register from './core/auth/pages/Register';
import DashboardLayout from './core/dashboard/components/DashboardLayout';
import DashboardHome from './core/dashboard/pages/DashboardHome';
import SelectModules from './core/onboarding/pages/SelectModules';
import { ProtectedRoute } from './core/auth/components/ProtectedRoute';
import { parseSessionJSON } from './lib/cookies';
import { getMainUrl, getAdminUrl } from './config/domains';

const ExternalRedirect = ({ to }) => {
  window.location.href = to;
  return null;
};

// ✅ Componente para validar que el slug de la URL coincide con la sesión
const SlugValidator = ({ children }) => {
  const { slug } = useParams();
  const tenant = parseSessionJSON('tenant', {});
  
  if (tenant.slug && tenant.slug !== slug) {
    // Slug de URL no coincide con el tenant de sesión
    return <ExternalRedirect to={getAdminUrl(tenant.slug)} />;
  }
  
  return children;
};

function App() {
  const hostname = window.location.hostname;
  const isAdmin = hostname.startsWith('admin.');

  if (isAdmin) {
    const tenant = parseSessionJSON('tenant', {});
    const slug = tenant.slug || '';

    // Si no hay slug, redirigir al login (sesión corrupta)
    if (!slug) {
      return <ExternalRedirect to={`${getMainUrl()}/login`} />;
    }
    
    return (
      <Routes>
        {/* Onboarding - con slug en la URL */}
        <Route path="/:slug/onboarding" element={
          <ProtectedRoute>
            <SlugValidator>
              <SelectModules />
            </SlugValidator>
          </ProtectedRoute>
        } />
        
        {/* Dashboard - con slug en la URL */}
        <Route path="/:slug/*" element={
          <ProtectedRoute>
            <SlugValidator>
              <DashboardLayout />
            </SlugValidator>
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
        </Route>
        
        {/* Redirecciones */}
        <Route path="/" element={<ExternalRedirect to={`${getAdminUrl(slug)}/dashboard`} />} />
        <Route path="*" element={<ExternalRedirect to={`${getMainUrl()}/login`} />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/select-tenant" element={<SelectTenant />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;