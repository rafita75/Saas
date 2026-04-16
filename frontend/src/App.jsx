import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Home } from './core/landing/pages/Home';
import Login from './core/auth/pages/Login';
import SelectTenant from './core/auth/pages/SelectTenant';
import Register from './core/auth/pages/Register';
import DashboardLayout from './core/dashboard/components/DashboardLayout';
import DashboardHome from './core/dashboard/pages/DashboardHome';
import BusinessSettings from './core/dashboard/pages/BusinessSettings';
import TeamSettings from './core/dashboard/pages/TeamSettings';
import PublicLanding from './core/landing/pages/PublicLanding'; // ✅ Añadido
import SelectModules from './core/onboarding/pages/SelectModules';
import { ProtectedRoute } from './core/auth/components/ProtectedRoute';
import { AuthProvider } from './core/auth/context/AuthContext';
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
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

function AppRoutes() {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  const isAdmin = hostname.startsWith('admin.');
  const isLocalhost = hostname.includes('localhost');

  // Detectar Subdominio Público
  // En producción (3 partes): tienda.jgsystemsgt.com
  // En localhost (2 partes): tienda.localhost
  let publicSlug = null;
  if (!isAdmin) {
    if (isLocalhost && parts.length >= 2 && parts[0] !== 'localhost') {
      publicSlug = parts[0];
    } else if (!isLocalhost && parts.length >= 3 && parts[0] !== 'www') {
      publicSlug = parts[0];
    }
  }

  // 1. Si es subdominio de tienda, cargar la landing del cliente
  if (publicSlug) {
    return (
      <Routes>
        <Route path="/" element={<PublicLanding />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // 2. Si es subdominio admin, cargar el dashboard
  if (isAdmin) {
    const tenant = parseSessionJSON('tenant', {});
    const slug = tenant.slug || '';

    // Si no hay slug en la sesión, forzar login en el dominio principal
    if (!slug) {
      return <ExternalRedirect to={`${getMainUrl()}/login`} />;
    }
    
    return (
      <Routes>
        <Route path="/:slug/onboarding" element={
          <ProtectedRoute><SlugValidator><SelectModules /></SlugValidator></ProtectedRoute>
        } />
        
        <Route path="/:slug/*" element={
          <ProtectedRoute><SlugValidator><DashboardLayout /></SlugValidator></ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="team" element={<TeamSettings />} />
          <Route path="settings" element={<BusinessSettings />} />
        </Route>
        
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