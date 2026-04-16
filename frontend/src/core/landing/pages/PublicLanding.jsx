import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../lib/api';
import { Sparkles, Building2, Globe, ArrowRight, Menu as MenuIcon, X } from 'lucide-react';

const PublicLanding = () => {
  const { path: urlPath } = useParams();
  const [tenant, setTenant] = useState(null);
  const [page, setPage] = useState(null);
  const [menu, setMenu] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detectar slug desde el subdominio
  const getSlugFromHost = () => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    const isLocalhost = hostname.includes('localhost');
    const isVercel = hostname.includes('vercel.app');
    const isRender = hostname.includes('onrender.com');
    
    if (isVercel || isRender) return null;

    if (!isLocalhost && parts.length >= 3) return parts[0];
    if (isLocalhost && parts.length >= 2 && parts[0] !== 'localhost') return parts[0];
    
    return null;
  };

  const publicSlug = getSlugFromHost();

  useEffect(() => {
    const fetchPublicData = async () => {
      if (!publicSlug) {
        setError('No se pudo identificar el negocio desde la URL.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 1. Obtener datos del negocio
        const tenantRes = await api.get(`/tenants/public/${publicSlug}`, {
          headers: { 'x-tenant-slug': publicSlug }
        });
        setTenant(tenantRes.data.tenant);

        // 2. Obtener lista de páginas para el Navbar
        const menuRes = await api.get(`/landings/public/menu/${publicSlug}`, {
          headers: { 'x-tenant-slug': publicSlug }
        });
        setMenu(menuRes.data.landings || []);

        // 3. Obtener el contenido de la página actual
        const pathKey = urlPath || 'root';
        const pageRes = await api.get(`/landings/public/path/${pathKey}`, {
          headers: { 'x-tenant-slug': publicSlug }
        });
        setPage(pageRes.data.landing);
      } catch (err) {
        console.error('Error fetching public data:', err);
        setError(err.response?.data?.error || 'Página no disponible en este momento.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, [publicSlug, urlPath]);

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
        <p className="text-slate-400 max-w-md mb-8">{error}</p>
        <a href="https://jgsystemsgt.com" className="px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:glow-effect transition-all">
          Ir a ModularBusiness
        </a>
      </div>
    );
  }

  const renderSection = (section, idx) => {
    if (!section || !section.content) return null;
    
    switch (section.type) {
      case 'hero':
        return (
          <section key={idx} className="relative pt-24 pb-32 px-6 overflow-hidden">
            <div className="max-w-5xl mx-auto text-center relative z-10">
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight text-white tracking-tighter italic">
                {section.content.title}
              </h1>
              <p className="text-slate-400 text-lg md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
                {section.content.description}
              </p>
              {section.content.ctaText && (
                <button className="px-12 py-5 bg-primary text-white rounded-[24px] font-black text-lg hover:glow-effect transition-all">
                  {section.content.ctaText}
                </button>
              )}
              {section.content.image && (
                <div className="mt-20 rounded-[48px] overflow-hidden border border-white/10 shadow-2xl max-w-4xl mx-auto ring-1 ring-white/20">
                  <img src={section.content.image} alt="Hero" className="w-full h-auto" />
                </div>
              )}
            </div>
          </section>
        );
      case 'features':
        return (
          <section key={idx} className="py-32 px-6 bg-white/5 border-y border-white/5">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-center mb-20 text-white tracking-tight">{section.content.title || '¿Por qué elegirnos?'}</h2>
              <div className="grid md:grid-cols-3 gap-12">
                {section.content.items?.map((item, i) => (
                  <div key={i} className="p-10 rounded-[40px] bg-dark-800 border border-white/5 hover:border-primary/40 transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                      <Sparkles className="text-primary" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4">{item.title}</h4>
                    <p className="text-slate-400 text-base leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'contact':
        return (
          <section key={idx} className="py-32 px-6">
            <div className="max-w-4xl mx-auto glass rounded-[64px] p-16 border border-white/5 text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">{section.content.title}</h2>
              <p className="text-slate-400 text-lg mb-16 max-w-2xl mx-auto">{section.content.description}</p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {section.content.email && (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</p>
                    <p className="text-2xl font-bold text-primary">{section.content.email}</p>
                  </div>
                )}
                {section.content.phone && (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Teléfono</p>
                    <p className="text-2xl font-bold text-white">{section.content.phone}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-primary/30 font-sans">
      {/* Navbar Dinámico Premium */}
      <nav className="h-24 border-b border-white/5 flex items-center justify-between px-8 lg:px-16 backdrop-blur-2xl sticky top-0 z-50 bg-dark-950/80">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[18px] bg-dark-800 border border-white/10 flex items-center justify-center overflow-hidden shadow-xl">
            {tenant?.logo ? (
              <img src={tenant.logo} alt={tenant.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="text-primary w-6 h-6" />
            )}
          </div>
          <span className="font-black text-2xl tracking-tighter text-white">{tenant?.name}</span>
        </div>

        {/* Menú de escritorio */}
        <div className="hidden lg:flex items-center gap-10">
          {menu.map((item) => (
            <Link 
              key={item._id} 
              to={item.path === '/' ? '/' : `${item.path}`}
              className={`text-sm font-black uppercase tracking-widest transition-all hover:text-primary ${
                (urlPath === item.path.replace('/', '') || (!urlPath && item.path === '/')) 
                ? 'text-primary' : 'text-slate-500'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <button className="ml-4 px-8 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5">
            Contactar
          </button>
        </div>

        {/* Botón móvil */}
        <button className="lg:hidden p-3 bg-white/5 rounded-2xl text-slate-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <MenuIcon />}
        </button>
      </nav>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-24 bg-dark-950 z-[60] p-10 lg:hidden animate-in slide-in-from-right duration-500">
          <div className="flex flex-col gap-8">
            {menu.map((item) => (
              <Link 
                key={item._id} 
                to={item.path === '/' ? '/' : `${item.path}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-5xl font-black text-white hover:text-primary transition-colors tracking-tighter"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Contenido Dinámico */}
      <main className="animate-fade-in">
        {!page || !page.sections || page.sections.length === 0 ? (
          <div className="py-60 text-center px-6">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Bienvenido a {tenant?.name}</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              Nuestra presencia digital está siendo esculpida. <br />Regresa pronto para descubrir todo lo que tenemos para ti.
            </p>
          </div>
        ) : (
          page.sections.map((section, idx) => renderSection(section, idx))
        )}
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-dark-900/20">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3">
            Powered by <Sparkles size={16} className="text-primary" /> <span className="text-slate-400">ModularBusiness</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;