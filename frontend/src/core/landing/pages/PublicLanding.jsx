import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../lib/api';
import { Sparkles, Building2, Globe, ArrowRight } from 'lucide-react';

const PublicLanding = () => {
  const { publicSlug: paramSlug } = useParams();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Detectar slug desde el subdominio si no viene por params
  const getSlugFromHost = () => {
    if (paramSlug) return paramSlug;
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    const isLocalhost = hostname.includes('localhost');
    
    if (isLocalhost && parts.length >= 2 && parts[0] !== 'localhost') return parts[0];
    if (!isLocalhost && parts.length >= 3) return parts[0];
    return null;
  };

  const publicSlug = getSlugFromHost();

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const response = await api.get(`/tenants/public/${publicSlug}`);
        setTenant(response.data.tenant);
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo cargar la página');
      } finally {
        setLoading(false);
      }
    };

    if (publicSlug) fetchPublicData();
    else {
      setError('No se pudo identificar el negocio');
      setLoading(false);
    }
  }, [publicSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <Globe className="text-red-400 w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Página no disponible</h1>
        <p className="text-slate-400 max-w-md mb-8">{error || 'El negocio solicitado no existe o no tiene una página pública habilitada.'}</p>
        <Link to="/" className="px-6 py-2 bg-dark-800 border border-slate-700 text-white rounded-xl hover:bg-dark-700 transition-all">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-primary/30">
      {/* Navegación Minimalista */}
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-12 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dark-800 border border-white/10 flex items-center justify-center overflow-hidden">
            {tenant.logo ? (
              <img src={tenant.logo} alt={tenant.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="text-primary w-6 h-6" />
            )}
          </div>
          <span className="font-bold text-xl tracking-tight">{tenant.name}</span>
        </div>
        <button className="hidden md:block px-6 py-2 bg-primary text-white rounded-full font-medium hover:glow-effect transition-all text-sm">
          Contactar Negocio
        </button>
      </nav>

      {/* Hero de Prueba */}
      <main className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-8">
            <Sparkles size={14} /> Módulo Landing Page Activo
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1]">
            Bienvenido a la página de <br />
            <span className="text-gradient">{tenant.name}</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Esta es una landing page de prueba generada automáticamente por ModularBusiness. 
            Próximamente podrás personalizar cada sección, colores y contenido desde tu panel de control.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
              Ver Catálogo <ArrowRight size={20} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all">
              Saber más
            </button>
          </div>
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
          Potenciado por <Sparkles size={14} className="text-primary" /> <span className="font-bold text-slate-400">ModularBusiness</span>
        </p>
      </footer>
    </div>
  );
};

export default PublicLanding;