import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../lib/api';
import { Sparkles, Building2, Globe, ArrowRight, Menu as MenuIcon, X } from 'lucide-react';

/**
 * Componente que renderiza una sección específica basada en su tipo y contenido.
 * Se usa tanto en el Editor como en la Vista Pública para garantizar consistencia total.
 */
export const SectionRenderer = ({ section, idx, isPreview = false, onSectionClick, isSelected = false }) => {
  if (!section || !section.content) return null;
  
  const sectionId = section.id || (section.content.title ? section.content.title.toLowerCase().replace(/\s+/g, '-') : `${section.type}-${idx}`);
  const { layout = 'split' } = section.content;

  const handleAction = (action) => {
    if (isPreview) return; // No ejecutar acciones en el editor
    if (!action || !action.value) return;
    
    switch (action.type) {
      case 'whatsapp':
        window.open(`https://wa.me/${action.value.replace(/\D/g, '')}`, '_blank');
        break;
      case 'phone':
        window.location.href = `tel:${action.value}`;
        break;
      case 'email':
        window.location.href = `mailto:${action.value}`;
        break;
      case 'link':
        if (action.value.startsWith('#')) {
          const el = document.getElementById(action.value.substring(1));
          el?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.open(action.value, '_blank');
        }
        break;
      default:
        break;
    }
  };

  const containerClass = `relative scroll-mt-24 transition-all duration-500 ${isPreview ? 'cursor-pointer rounded-[40px] border-2' : ''} ${
    isSelected ? 'border-primary shadow-[0_0_50px_-20px_rgba(99,102,241,0.6)] ring-8 ring-primary/5 bg-dark-800/40' : 'border-transparent'
  }`;

  const renderContent = () => {
    switch (section.type) {
      case 'hero':
        if (layout === 'centered') {
          return (
            <div className="max-w-4xl mx-auto text-center py-20 lg:py-32">
              <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tighter italic text-white uppercase">{section.content.title}</h1>
              <p className="text-slate-400 text-lg md:text-2xl mb-12 max-w-2xl mx-auto">{section.content.description}</p>
              {section.content.ctaText && (
                <button onClick={() => handleAction(section.content.action)} className="px-12 py-5 bg-primary text-white rounded-full font-black text-lg hover:glow-effect transition-all uppercase tracking-widest">
                  {section.content.ctaText}
                </button>
              )}
            </div>
          );
        }
        if (layout === 'background') {
          return (
            <div className="relative min-h-[70vh] flex items-center justify-center py-20 px-6">
              <div className="absolute inset-0 z-0">
                <img src={section.content.image} className="w-full h-full object-cover" alt="BG" />
                <div className="absolute inset-0 bg-dark-950/70 backdrop-blur-[2px]" />
              </div>
              <div className="max-w-5xl mx-auto text-center relative z-10">
                <h1 className="text-5xl md:text-8xl font-black mb-8 leading-none text-white tracking-tight italic">{section.content.title}</h1>
                <p className="text-slate-200 text-lg md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">{section.content.description}</p>
                <button onClick={() => handleAction(section.content.action)} className="px-12 py-5 bg-white text-black rounded-2xl font-black text-lg hover:scale-105 transition-all">
                  {section.content.ctaText || 'Comenzar'}
                </button>
              </div>
            </div>
          );
        }
        return (
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center py-20 lg:py-32 px-6">
            <div className="space-y-8 text-left">
              <h1 className="text-5xl md:text-7xl font-black leading-tight text-white tracking-tighter italic uppercase">{section.content.title}</h1>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-lg">{section.content.description}</p>
              <button onClick={() => handleAction(section.content.action)} className="px-10 py-5 bg-primary text-white rounded-[24px] font-black text-lg hover:glow-effect transition-all flex items-center gap-4">
                {section.content.ctaText} <ArrowRight />
              </button>
            </div>
            <div className="relative aspect-square rounded-[50px] overflow-hidden border border-white/10 shadow-2xl">
              <img src={section.content.image} alt="Hero" className="w-full h-full object-cover" />
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="max-w-7xl mx-auto py-24 px-6">
            <h2 className="text-4xl font-black text-center mb-16 text-white tracking-tight">{section.content.title || '¿Por qué nosotros?'}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {section.content.items?.map((item, i) => (
                <div key={i} className="p-10 rounded-[40px] bg-dark-800 border border-white/5 hover:border-primary/40 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary"><Sparkles size={24} /></div>
                  <h4 className="text-xl font-bold text-white mb-4">{item.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="max-w-4xl mx-auto py-24 px-6">
            <div className="glass rounded-[48px] p-12 lg:p-20 border border-white/5 text-center">
              <h2 className="text-4xl font-black mb-6 text-white tracking-tight">{section.content.title}</h2>
              <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">{section.content.description}</p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {section.content.email && (
                  <button onClick={() => handleAction({ type: 'email', value: section.content.email })} className="flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</p>
                    <p className="text-xl font-bold text-primary">{section.content.email}</p>
                  </button>
                )}
                {section.content.phone && (
                  <button onClick={() => handleAction({ type: 'phone', value: section.content.phone })} className="flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Teléfono</p>
                    <p className="text-xl font-bold text-white">{section.content.phone}</p>
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="max-w-7xl mx-auto py-24 px-6 text-center">
            <h2 className="text-4xl font-black mb-16 text-white tracking-tight">{section.content.title || 'Opiniones'}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.content.items?.map((item, i) => (
                <div key={i} className="p-8 rounded-[40px] bg-dark-900 border border-white/5 italic text-slate-400">
                  <p className="mb-6">"{item.description}"</p>
                  <p className="font-bold text-white not-italic">— {item.title}</p>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'cta':
        return (
          <div className="max-w-5xl mx-auto py-20 px-6">
            <div className="p-16 rounded-[48px] bg-primary text-center space-y-8 shadow-[0_0_50px_-15px_rgba(99,102,241,0.5)]">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{section.content.title}</h2>
              <p className="text-indigo-100 text-lg max-w-2xl mx-auto">{section.content.description}</p>
              <button onClick={() => handleAction(section.content.action)} className="px-10 py-4 bg-white text-primary rounded-2xl font-black text-lg hover:scale-105 transition-all">
                {section.content.buttonText || 'Comenzar ahora'}
              </button>
            </div>
          </div>
        );

      default:
        return <div className="p-10 text-center text-slate-600 border border-dashed border-slate-800 rounded-3xl">Bloque {section.type} no implementado.</div>;
    }
  };

  return (
    <section id={sectionId} className={containerClass} onClick={() => onSectionClick?.(idx)}>
      {renderContent()}
      {isPreview && isSelected && (
        <div className="absolute top-4 right-4 bg-primary text-white p-2 rounded-full shadow-lg animate-scale-up">
          <Check size={16} strokeWidth={3} />
        </div>
      )}
    </section>
  );
};

const PublicLanding = () => {
  const { path: urlPath } = useParams();
  const [tenant, setTenant] = useState(null);
  const [page, setPage] = useState(null);
  const [menu, setMenu] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [tenantRes, menuRes] = await Promise.all([
          api.get(`/tenants/public/${publicSlug}`, { headers: { 'x-tenant-slug': publicSlug } }),
          api.get(`/landings/public/menu/${publicSlug}`, { headers: { 'x-tenant-slug': publicSlug } })
        ]);
        setTenant(tenantRes.data.tenant);
        setMenu(menuRes.data.landings || []);

        const pathKey = urlPath || 'root';
        const pageRes = await api.get(`/landings/public/path/${pathKey}`, { headers: { 'x-tenant-slug': publicSlug } });
        setPage(pageRes.data.landing);
      } catch (err) {
        setError(err.response?.data?.error || 'Página no disponible.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [publicSlug, urlPath]);

  if (loading) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error || !tenant) return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4 text-center text-white">
      <Globe className="text-red-400 w-20 h-20 mb-6" />
      <h1 className="text-2xl font-bold mb-2">Ops! Página no disponible</h1>
      <p className="text-slate-400 max-w-md mb-8">{error}</p>
      <Link to="/" className="px-8 py-3 bg-primary text-white rounded-2xl font-bold">Ir a Inicio</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-primary/30 font-sans">
      <nav className="h-24 border-b border-white/5 flex items-center justify-between px-8 lg:px-16 backdrop-blur-2xl sticky top-0 z-50 bg-dark-950/80">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[18px] bg-dark-800 border border-white/10 flex items-center justify-center overflow-hidden shadow-xl">
            {tenant?.logo ? <img src={tenant.logo} alt={tenant.name} className="w-full h-full object-cover" /> : <Building2 className="text-primary w-6 h-6" />}
          </div>
          <span className="font-black text-2xl tracking-tighter">{tenant?.name}</span>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          {menu.map((item) => (
            <Link key={item._id} to={item.path === '/' ? '/' : `${item.path}`} className={`text-sm font-black uppercase tracking-widest transition-all hover:text-primary ${(urlPath === item.path.replace('/', '') || (!urlPath && item.path === '/')) ? 'text-primary' : 'text-slate-500'}`}>
              {item.name}
            </Link>
          ))}
        </div>
        <button className="lg:hidden p-3 bg-white/5 rounded-2xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X /> : <MenuIcon />}</button>
      </nav>

      <main className="animate-fade-in">
        {!page || !page.sections || page.sections.length === 0 ? (
          <div className="py-60 text-center px-6">
            <h2 className="text-5xl font-black mb-8">Bienvenido a {tenant?.name}</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">Regresa pronto para descubrir todo lo que tenemos para ti.</p>
          </div>
        ) : (
          page.sections.map((section, idx) => <SectionRenderer key={idx} section={section} idx={idx} />)
        )}
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3">Powered by <Sparkles size={16} className="text-primary" /> ModularBusiness</p>
      </footer>
    </div>
  );
};

export default PublicLanding;