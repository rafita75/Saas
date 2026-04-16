import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, LogIn } from 'lucide-react';
import api from '../../../lib/api';
import { setCookie } from '../../../lib/cookies';
import { getAdminUrl } from '../../../config/domains';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { user, tenants, tenant } = response.data;

      setCookie('user', JSON.stringify(user));
      setCookie('tenants', JSON.stringify(tenants));
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('tenants', JSON.stringify(tenants));

      // Si tiene múltiples negocios, ir a la pantalla de selección
      if (tenants.length > 1) {
        window.location.href = '/select-tenant';
        return;
      }

      // Si solo tiene uno, guardar como tenant actual y redirigir
      const selectedTenant = tenants[0] || tenant;
      setCookie('tenant', JSON.stringify(selectedTenant));
      localStorage.setItem('tenant', JSON.stringify(selectedTenant));
      
      if (selectedTenant.hasCompletedOnboarding) {
        window.location.href = `${getAdminUrl(selectedTenant.slug)}/dashboard`;
      } else {
        window.location.href = `${getAdminUrl(selectedTenant.slug)}/onboarding`;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float animation-delay-1000" />
      
      <div className="max-w-md w-full relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
            <Sparkles className="relative w-8 h-8 text-primary group-hover:animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-gradient">ModularBusiness</span>
            <span className="text-xs text-slate-400 -mt-1 text-center">by J&H Systems</span>
          </div>
        </Link>

        <div className="flex justify-center mb-4">
          <span className="glass-light px-4 py-1.5 rounded-full text-xs flex items-center gap-2 border border-primary/30">
            <LogIn size={12} className="text-primary" />
            <span className="text-slate-300">¡Qué gusto verte de nuevo!</span>
          </span>
        </div>

        <div className="glass rounded-2xl p-8 border border-primary/20">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Iniciar Sesión</h2>
          <p className="text-slate-400 text-center mb-6">Ingresa a tu cuenta para continuar</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="juan@empresa.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-medium hover:glow-effect transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="relative flex items-center gap-2">
                {loading ? 'Iniciando...' : (
                  <>
                    Iniciar sesión
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 py-1 bg-dark-900/80 backdrop-blur-sm rounded-full text-xs text-slate-400 border border-slate-700/30">
                ¿Nuevo en ModularBusiness?
              </span>
            </div>
          </div>

          <Link to="/register" className="block w-full text-center py-3 rounded-xl border border-slate-700 text-white font-medium hover:bg-dark-800/50 transition">
            Crear una cuenta gratis
          </Link>
        </div>
      </div>
    </div>
  );
}