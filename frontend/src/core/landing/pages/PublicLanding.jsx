import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../lib/api';
import { Sparkles, Building2, Globe, ArrowRight } from 'lucide-react';

const PublicLanding = () => {
  const { publicSlug: paramSlug } = useParams();
  const [tenant, setTenant] = useState(null);
  const [page, setPage] = useState(null); // ✅ Cargar la página real
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
        // 1. Obtener datos del tenant
        const tenantRes = await api.get(`/tenants/public/${publicSlug}`);
        setTenant(tenantRes.data.tenant);

        // 2. Obtener la landing page principal (path: /)
        const pageRes = await api.get(`/landings/public/path/root`);
        setPage(pageRes.data.landing);
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

  // Renderizador de Secciones Dinámicas
  const renderSection = (section, idx) => {
    switch (section.type) {
      case 'hero':
        return (
          <section key={idx} className="relative pt-20 pb-32 px-6 overflow-hidden">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1] text-white">
                {section.content.title}
              </h1>
              <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                {section.content.description}
              </p>
              {section.content.ctaText && (
                <button className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:glow-effect transition-all">
                  {section.content.ctaText}
                </button>
              )}
              {section.content.image && (
                <div className="mt-16 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src={section.content.image} alt="Hero" className="w-full h-auto" />
                </div>
              )}
            </div>
          </section>
        );
      case 'features':
        return (
          <section key={idx} className="py-24 px-6 bg-dark-900/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-16 text-white">{section.content.title || 'Nuestros Beneficios'}</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {section.content.items?.map((item, i) => (
                  <div key={i} className="p-8 rounded-3xl bg-dark-800 border border-white/5 hover:border-primary/30 transition-all">
                    <h4 className="text-xl font-bold text-white mb-4">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'contact':
        return (
          <section key={idx} className="py-24 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">{section.content.title}</h2>
              <p className="text-slate-400 mb-12">{section.content.description}</p>
              <div className="grid gap-4">
                {section.content.email && <div className="p-4 bg-dark-800 rounded-2xl border border-white/5 text-primary font-medium">{section.content.email}</div>}
                {section.content.phone && <div className="p-4 bg-dark-800 rounded-2xl border border-white/5 text-slate-300 font-medium">{section.content.phone}</div>}
              </div>
            </div>
          </section>
        );
      case 'cta':
        return (
          <section key={idx} className="py-20 px-6 bg-primary/10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl font-bold text-white">{section.content.title}</h2>
              <p className="text-slate-300 text-lg">{section.content.description}</p>
              <button className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:scale-105 transition-all">
                {section.content.buttonText || 'Contactar'}
              </button>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-primary/30">
      {/* Navbar */}
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
      </nav>

      {/* Contenido Dinámico */}
      <main>
        {!page || page.sections.length === 0 ? (
          <div className="py-40 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Bienvenido a {tenant.name}</h2>
            <p className="text-slate-400">Página en construcción.</p>
          </div>
        ) : (
          page.sections.map((section, idx) => renderSection(section, idx))
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
          Potenciado por <Sparkles size={14} className="text-primary" /> <span className="font-bold text-slate-400">ModularBusiness</span>
        </p>
      </footer>
    </div>
  );
};

export default PublicLanding;