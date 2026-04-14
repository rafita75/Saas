import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Home } from './modules/landing/pages/Home';
import {Login} from './modules/auth/pages/Login';
import {Register} from './modules/auth/pages/Register';
import DashboardLayout from './modules/dashboard/components/DashboardLayout';
import DashboardHome from './modules/dashboard/pages/DashboardHome';
import { useSubdomain } from './hooks/useSubdomain';

// Placeholder para páginas
const PlaceholderPage = ({ title }) => (
  <div className="glass rounded-2xl p-8 border border-primary/20">
    <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
    <p className="text-slate-400">Esta sección estará disponible próximamente.</p>
  </div>
);

// Componente para tienda pública del tenant
const TenantStore = ({ subdomain }) => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const { data, error } = await supabase
          .from('tenants')
          .select('*')
          .eq('slug', subdomain)
          .single();

        if (error) throw error;
        setTenant(data);
      } catch (err) {
        setError('Tienda no encontrada');
      } finally {
        setLoading(false);
      }
    };

    if (subdomain) {
      fetchTenant();
    }
  }, [subdomain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-slate-400">Cargando...</div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="glass rounded-2xl p-8 border border-red-500/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">🏗️ Tienda no encontrada</h2>
          <p className="text-slate-400 mb-6">
            El subdominio <strong>{subdomain}</strong> no está registrado.
          </p>
          <a 
            href="http://modularbusiness.local:5173"
            className="text-primary hover:underline"
          >
            Ir a ModularBusiness
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="glass p-4 border-b border-primary/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">{tenant.name}</h1>
          <span className="text-slate-400 text-sm">{subdomain}.modularbusiness.local</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="glass rounded-2xl p-8 border border-primary/20 text-center">
          <h2 className="text-xl text-white mb-4">🏗️ Tienda en construcción</h2>
          <p className="text-slate-400">
            La tienda de <strong>{tenant.name}</strong> estará disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { subdomain, isMainDomain } = useSubdomain();

  // Si es un subdominio, mostrar la tienda del tenant
  if (!isMainDomain && subdomain) {
    return <TenantStore subdomain={subdomain} />;
  }

  // Si es dominio principal, mostrar rutas normales
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="store" element={<PlaceholderPage title="Tienda" />} />
        <Route path="products" element={<PlaceholderPage title="Productos" />} />
        <Route path="orders" element={<PlaceholderPage title="Órdenes" />} />
        <Route path="customers" element={<PlaceholderPage title="Clientes" />} />
        <Route path="bookings" element={<PlaceholderPage title="Reservas" />} />
        <Route path="finance" element={<PlaceholderPage title="Finanzas" />} />
        <Route path="settings" element={<PlaceholderPage title="Configuración" />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;