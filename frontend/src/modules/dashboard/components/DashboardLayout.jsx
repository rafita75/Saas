import { useState} from "react";
import { Link, Outlet } from "react-router-dom";
import { clearAuthCookies } from '../../../lib/cookies';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Store,
  Calendar,
  Calculator,
} from "lucide-react";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userEmail = localStorage.getItem("user_email") || "usuario@email.com";
  const tenantName = localStorage.getItem("tenant_name") || "Mi Negocio";
  const tenantSlug = localStorage.getItem("tenant_slug") || "";

  const handleLogout = () => {
    // Limpiar cookies
    clearAuthCookies();
    
    // Limpiar localStorage
    localStorage.clear();
    
    // Redirigir a login
    window.location.href = 'https://jgsystemsgt.com/login';
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: `/dashboard` },
    { icon: Store, label: "Tienda", path: `/dashboard/store` },
    { icon: Package, label: "Productos", path: `/dashboard/products` },
    { icon: ShoppingBag, label: "Órdenes", path: `/dashboard/orders` },
    { icon: Users, label: "Clientes", path: `/dashboard/customers` },
    { icon: Calendar, label: "Reservas", path: `/dashboard/bookings` },
    { icon: Calculator, label: "Finanzas", path: `/dashboard/finance` },
    { icon: Settings, label: "Configuración", path: `/dashboard/settings` },
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 glass border-r border-primary/10
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-primary/10">
          <Link to={`/${tenantSlug}/dashboard`} className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-bold text-gradient text-sm">
              ModularBusiness
            </span>
          </Link>
          <button
            className="lg:hidden p-1 rounded-lg hover:bg-dark-800/50"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Tenant Info */}
        <div className="p-4 border-b border-primary/10">
          <p className="text-xs text-slate-500 mb-1">Negocio</p>
          <p className="text-white font-medium truncate">{tenantName}</p>
          <p className="text-xs text-slate-500 mt-2 mb-1">Plan</p>
          <span className="inline-flex items-center gap-1 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
            <Sparkles size={10} />
            Trial (3 días)
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={`/${tenantSlug}${item.path}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800/50 transition-all duration-200 group"
            >
              <item.icon
                size={20}
                className="group-hover:text-primary transition-colors"
              />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
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
        {/* Header */}
        <header className="h-16 glass border-b border-primary/10 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-dark-800/50"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} className="text-slate-400" />
            </button>
            <h1 className="text-lg font-semibold text-white hidden sm:block">
              Dashboard
            </h1>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-800/50 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 glass rounded-xl border border-primary/20 shadow-xl animate-fade-in-up">
                <div className="p-2">
                  <p className="text-xs text-slate-500 px-3 py-1">
                    {userEmail}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <LogOut size={14} />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;