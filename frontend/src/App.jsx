import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './modules/landing/pages/Home';
import Login from './modules/auth/pages/Login';
import Register from './modules/auth/pages/Register';
import DashboardLayout from './modules/dashboard/components/DashboardLayout';
import DashboardHome from './modules/dashboard/pages/DashboardHome';
import ChooseModules from './modules/onboarding/pages/ChooseModules';
import { ProtectedRoute } from './modules/auth/components/ProtectedRoute';

const PlaceholderPage = ({ title }) => (
  <div className="glass rounded-2xl p-8 border border-primary/20">
    <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
    <p className="text-slate-400">Esta sección estará disponible próximamente.</p>
  </div>
);

function App() {
  const hostname = window.location.hostname;
  const isAdmin = hostname.startsWith('admin.');

  if (isAdmin) {
    return (
      <Routes>
        {/* Onboarding con slug */}
        <Route path="/:slug/onboarding" element={<ChooseModules />} />
        
        {/* Dashboard con slug */}
        <Route
          path="/:slug/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="products" element={<PlaceholderPage title="Productos" />} />
          <Route path="inventory" element={<PlaceholderPage title="Inventario" />} />
          <Route path="accounting" element={<PlaceholderPage title="Contabilidad" />} />
          <Route path="settings" element={<PlaceholderPage title="Configuración" />} />
        </Route>
        
        {/* Redirigir raíz de admin al login principal si no está autenticado */}
        <Route path="/" element={<Navigate to="https://jgsystemsgt.com/login" replace />} />
        <Route path="*" element={<Navigate to="https://jgsystemsgt.com/login" replace />} />
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