import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Building2, ArrowRight, LogOut, LayoutDashboard } from 'lucide-react';
import { parseSessionJSON, setCookie } from '../../../lib/cookies';
import { getAdminUrl, getMainUrl } from '../../../config/domains';

export default function SelectTenant() {
  const [tenants, setTenants] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedTenants = parseSessionJSON('tenants', []);
    const storedUser = parseSessionJSON('user', null);
    
    if (!storedUser || storedTenants.length === 0) {
      window.location.href = '/login';
      return;
    }
    
    setTenants(storedTenants);
    setUser(storedUser);
  }, []);

  const handleSelect = (tenant) => {
    setCookie('tenant', JSON.stringify(tenant));
    localStorage.setItem('tenant', JSON.stringify(tenant));
    
    const targetUrl = tenant.hasCompletedOnboarding 
      ? `${getAdminUrl(tenant.slug)}/dashboard`
      : `${getAdminUrl(tenant.slug)}/onboarding`;
      
    window.location.href = targetUrl;
  };

  const handleLogout = () => {
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href = '/login';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="max-w-2xl w-full relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
              <Sparkles className="relative w-8 h-8 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gradient">ModularBusiness</span>
            </div>
          </Link>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm px-4 py-2 rounded-xl glass border border-white/5"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>

        <div className="glass rounded-3xl p-8 border border-primary/20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">¡Hola, {user.fullName.split(' ')[0]}!</h2>
            <p className="text-slate-400">Selecciona el negocio con el que deseas trabajar hoy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tenants.map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => handleSelect(tenant)}
                className="group relative flex items-center gap-4 p-5 rounded-2xl bg-dark-800/50 border border-slate-700/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-dark-700 flex items-center justify-center border border-slate-600 group-hover:border-primary/30 overflow-hidden">
                  {tenant.logo ? (
                    <img src={tenant.logo} alt={tenant.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="text-slate-500 group-hover:text-primary transition-colors" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                    {tenant.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{tenant.slug}.jgsystemsgt.com</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                      {tenant.role}
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowRight size={16} />
                </div>
              </button>
            ))}

            <Link
              to="/register"
              className="flex items-center justify-center gap-3 p-5 rounded-2xl border border-dashed border-slate-700 hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center border border-slate-700 group-hover:border-primary/30">
                <span className="text-2xl text-slate-500 group-hover:text-primary">+</span>
              </div>
              <span className="text-slate-400 group-hover:text-white font-medium">Registrar nuevo negocio</span>
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-500 text-xs">
          ¿Necesitas ayuda? Contacta con <a href="#" className="text-primary hover:underline">Soporte Técnico</a>
        </p>
      </div>
    </div>
  );
}