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
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const coreMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: `/dashboard` },
  ];

  const moduleMenuItems = activeModules.flatMap(am => {
    const moduleManifest = MODULES_REGISTRY.find(m => m.slug === am.moduleId.slug);
    if (!moduleManifest) return [];
    return moduleManifest.routes
      .filter(route => !route.hidden)
      .map(route => ({
        icon: route.icon || moduleManifest.icon,
        label: route.label || moduleManifest.name,
        path: `/${route.path}`
      }));
  });

  const managementMenuItems = [
    { icon: Users, label: 'Equipo', path: `/team` },
    { icon: Settings, label: 'Configuración', path: `/settings` },
  ];

  const menuItems = [...coreMenuItems, ...moduleMenuItems, ...managementMenuItems];

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden selection:bg-primary/30">
      {/* Sidebar - Premium Dark Design */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-slate-950 border-r border-white/[0.05]
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
      `}>
        <div className="h-20 flex items-center justify-between px-6">
          <Link to={`/${tenant.slug}/dashboard`} className={`flex items-center gap-3 transition-all duration-500 ${isCollapsed ? 'opacity-0 scale-50' : 'opacity-100'}`}>
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-white text-lg tracking-tighter uppercase italic">Modular</span>
          </Link>
          <button 
            className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
             {isCollapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="mx-6 mb-8 p-4 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/10 animate-in fade-in slide-in-from-top-4">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Empresa</p>
            <p className="text-white font-bold truncate text-sm mb-1">{tenant.name || 'Mi Negocio'}</p>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{activeModules.length} módulos activos</span>
            </div>
          </div>
        )}

        <nav className={`px-4 space-y-1.5 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={`/${tenant.slug}${item.path}`}
              className={`
                flex items-center gap-4 py-3 rounded-xl transition-all duration-300 group
                ${isCollapsed ? 'px-0 w-12 justify-center' : 'px-4'}
                hover:bg-white/[0.05] relative overflow-hidden
              `}
              title={isCollapsed ? item.label : ''}
            >
              <item.icon size={20} className="text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
              )}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 -translate-x-full group-hover:translate-x-0 transition-transform" />
            </Link>
          ))}
        </nav>

        <div className={`absolute bottom-8 left-0 right-0 px-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-4 py-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300
              ${isCollapsed ? 'w-12 justify-center' : 'w-full px-4 border border-white/[0.03]'}
            `}
            title={isCollapsed ? 'Cerrar sesión' : ''}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-900/50">
        <header className="h-20 border-b border-white/[0.05] flex items-center justify-between px-8 shrink-0 backdrop-blur-3xl bg-slate-950/50">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
            <h1 className="text-sm font-black text-slate-200 uppercase tracking-[0.3em]">Centro de Control</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <span className="text-xs font-black text-white leading-none uppercase tracking-tighter">{user.fullName}</span>
               <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1 opacity-70">Admin Mode</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center shadow-2xl shadow-indigo-500/10">
              <span className="text-indigo-400 text-sm font-black">
                {user.fullName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default DashboardLayout;