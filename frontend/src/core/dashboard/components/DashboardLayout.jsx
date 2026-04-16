import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import api from '../../../lib/api';
import { clearAuthCookies, parseSessionJSON } from '../../../lib/cookies';
import { getMainUrl } from '../../../config/domains';
import MODULES_REGISTRY from '../../../config/modules';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModules, setActiveModules] = useState([]);
  
  const user = parseSessionJSON('user', {});
  const tenant = parseSessionJSON('tenant', {});

  useEffect(() => {
    const fetchActiveModules = async () => {
      try {
        const response = await api.get('/modules/tenant/me');
        setActiveModules(response.data.modules);
      } catch (err) {
        console.error('Error al cargar módulos activos');
      }
    };
    fetchActiveModules();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      clearAuthCookies();
      localStorage.clear();
      window.location.href = getMainUrl();
    }
  };

  // 1. Menú Core (Siempre visible)
  const coreMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: `/dashboard` },
  ];

  // 2. Menú de Módulos (Dinámico)
  const moduleMenuItems = activeModules.flatMap(am => {
    // Buscar el manifiesto del módulo por su slug
    const moduleManifest = MODULES_REGISTRY.find(m => m.slug === am.moduleId.slug);
    if (!moduleManifest) return [];

    // Extraer las rutas marcadas como visibles para el menú
    return moduleManifest.routes
      .filter(route => !route.hidden)
      .map(route => ({
        icon: route.icon || moduleManifest.icon,
        label: route.label || moduleManifest.name,
        path: `/${route.path}`
      }));
  });

  // 3. Menú de Gestión (Al final)
  const managementMenuItems = [
    { icon: Users, label: 'Equipo', path: `/team` },
    { icon: Settings, label: 'Configuración', path: `/settings` },
  ];

  const menuItems = [...coreMenuItems, ...moduleMenuItems, ...managementMenuItems];

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 glass border-r border-primary/10
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-primary/10">
          <Link to={`/${tenant.slug}/dashboard`} className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-bold text-gradient text-sm">ModularBusiness</span>
          </Link>
          <button className="lg:hidden p-1 rounded-lg hover:bg-dark-800/50" onClick={() => setSidebarOpen(false)}>
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-4 border-b border-primary/10">
          <p className="text-xs text-slate-500 mb-1">Negocio</p>
          <p className="text-white font-medium truncate">{tenant.name || 'Mi Negocio'}</p>
          <p className="text-xs text-slate-500 mt-2 mb-1">Ecosistema</p>
          <span className="inline-flex items-center gap-1 bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">
            {activeModules.length} Módulos Activos
          </span>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={`/${tenant.slug}${item.path}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800/50 transition-all duration-200 group"
            >
              <item.icon size={20} className="group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 glass border-b border-primary/10 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-dark-800/50" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} className="text-slate-400" />
            </button>
            <h1 className="text-lg font-semibold text-white hidden sm:block">Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">{user.fullName}</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.fullName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default DashboardLayout;