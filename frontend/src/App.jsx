import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Home } from './modules/landing/pages/Home';
import Login from './modules/auth/pages/Login';
import Register from './modules/auth/pages/Register';
import DashboardLayout from './modules/dashboard/components/DashboardLayout';
import DashboardHome from './modules/dashboard/pages/DashboardHome';
import ChooseModules from './modules/onboarding/pages/ChooseModules';

const PlaceholderPage = ({ title }) => (
  <div className="glass rounded-2xl p-8 border border-primary/20">
    <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
    <p className="text-slate-400">Esta sección estará disponible próximamente.</p>
  </div>
);

// Componente para rutas de admin
const AdminRoutes = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [tenantSlug, setTenantSlug] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setAuthenticated(true);
        const slug = localStorage.getItem('tenant_slug');
        setTenantSlug(slug);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-slate-400">Cargando...</div>
      </div>
    );
  }

  // ✅ Si no está autenticado, redirigir al login PRINCIPAL
  if (!authenticated) {
    window.location.href = 'https://jgsystemsgt.com/login';
    return null;
  }

  return (
    <Routes>
      {/* Dashboard protegido */}
      <Route 
        path="/:slug" 
        element={<DashboardLayout />}
      >
        <Route index element={<DashboardHome />} />
        <Route path="products" element={<PlaceholderPage title="Productos" />} />
        <Route path="inventory" element={<PlaceholderPage title="Inventario" />} />
        <Route path="accounting" element={<PlaceholderPage title="Contabilidad" />} />
        <Route path="settings" element={<PlaceholderPage title="Configuración" />} />
        <Route path="/onboarding" element={<ChooseModules />} />
      </Route>
      
      {/* Redirigir raíz de admin al dashboard del tenant */}
      <Route 
        path="/" 
        element={<Navigate to={`/${tenantSlug}`} replace />} 
      />
      
      {/* Cualquier otra ruta */}
      <Route path="*" element={<Navigate to={`/${tenantSlug}`} replace />} />
    </Routes>
  );
};

function App() {
  const hostname = window.location.hostname;
  const isAdmin = hostname.startsWith('admin.');

  // Si es admin.jgsystemsgt.com
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/*" element={<AdminRoutes />} />
      </Routes>
    );
  }

  // Si es jgsystemsgt.com (dominio principal)
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