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
  const isOfficialDomain = hostname === 'jgsystemsgt.com' || hostname.endsWith('.jgsystemsgt.com');
  const isAdminSubdomain = hostname.startsWith('admin.');
  // Entornos como Render, Vercel o Localhost (cuando no es el dominio oficial)
  const isAlternativeEnv = !isOfficialDomain;

  const tenant = parseSessionJSON('tenant', {});
  const slug = tenant.slug || '';

  // Determinar si debemos mostrar el Dashboard o la Landing
  // Mostramos Dashboard si:
  // 1. Estamos en el subdominio admin.
  // 2. O estamos en un entorno alternativo (Render) Y la ruta no es de la landing.
  const isDashboardPath = window.location.pathname !== '/' && 
                         window.location.pathname !== '/login' && 
                         window.location.pathname !== '/register' &&
                         window.location.pathname !== '/select-tenant';

  if (isAdminSubdomain || (isAlternativeEnv && isDashboardPath && slug)) {
    return (
      <Routes>
        {/* Onboarding */}
        <Route path="/:slug/onboarding" element={
          <ProtectedRoute>
            <SlugValidator>
              <SelectModules />
            </SlugValidator>
          </ProtectedRoute>
        } />
        
        {/* Dashboard */}
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
        
        {/* Rutas de autenticación (accesibles por si acaso) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/select-tenant" element={<SelectTenant />} />
        
        {/* Redirecciones base del dashboard */}
        <Route path="/" element={<ExternalRedirect to={getAdminUrl(slug ? `${slug}/dashboard` : '')} />} />
        <Route path="*" element={<ExternalRedirect to={`${getMainUrl()}/login`} />} />
      </Routes>
    );
  }

  // Rutas de la Landing / Auth Principal
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/select-tenant" element={<SelectTenant />} />
      {/* Capturar rutas de dashboard que se escapen (ej. links directos en Render) */}
      <Route path="/:slug/*" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;