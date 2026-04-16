import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../lib/api';
import { Sparkles, Building2, Globe, Menu as MenuIcon, X } from 'lucide-react';

// Importación de las nuevas Secciones Profesionales (JSX)
import HeroSplit from '../../../modules/landing-page/sections/HeroSplit';
import HeroFull from '../../../modules/landing-page/sections/HeroFull';
import HeroCentered from '../../../modules/landing-page/sections/HeroCentered';
import FeaturesBento from '../../../modules/landing-page/sections/FeaturesBento';
import TestimonialsGrid from '../../../modules/landing-page/sections/TestimonialsGrid';
import CTAGradient from '../../../modules/landing-page/sections/CTAGradient';
import ContactPremium from '../../../modules/landing-page/sections/ContactPremium';

/**
 * SectionRenderer: El motor visual del SaaS.
 * Mapea los datos del JSON a componentes JSX reales y profesionales.
 */
export const SectionRenderer = ({ section, idx, isPreview = false, onSectionClick, isSelected = false }) => {
  if (!section || !section.content) return null;
  
  // Generar un ID único para la sección (importante para anclas/navbar)
  const sectionId = section.id || `${section.type}-${idx}`;
  const { layout = 'split' } = section.content;

  const handleAction = (action) => {
    if (isPreview) return; 
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
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.open(action.value.startsWith('http') ? action.value : `https://${action.value}`, '_blank');
        }
        break;
      default:
        break;
    }
  };

  const containerClass = `relative scroll-mt-24 transition-all duration-700 ${isPreview ? 'cursor-pointer rounded-[48px] border-2 overflow-hidden mb-12 hover:scale-[0.99]' : ''} ${
    isSelected ? 'border-primary shadow-[0_0_80px_-20px_rgba(99,102,241,0.8)] ring-[16px] ring-primary/5 bg-dark-800/40 z-20 scale-[0.98]' : 'border-transparent'
  }`;

  const renderComponent = () => {
    switch (section.type) {
      case 'hero':
        if (layout === 'centered') return <HeroCentered content={section.content} handleAction={handleAction} isPreview={isPreview} />;
        if (layout === 'background') return <HeroFull content={section.content} handleAction={handleAction} isPreview={isPreview} />;
        return <HeroSplit content={section.content} handleAction={handleAction} isPreview={isPreview} />;
      
      case 'features':
        return <FeaturesBento content={section.content} isPreview={isPreview} />;
        
      case 'testimonials':
        return <TestimonialsGrid content={section.content} isPreview={isPreview} />;
        
      case 'cta':
        return <CTAGradient content={section.content} handleAction={handleAction} isPreview={isPreview} />;
        
      case 'contact':
        return <ContactPremium content={section.content} handleAction={handleAction} isPreview={isPreview} />;

      default:
        return (
          <div className="p-20 text-center text-slate-600 border-2 border-dashed border-slate-800 rounded-[40px] uppercase font-black tracking-widest opacity-40">
            Bloque {section.type} en mantenimiento
          </div>
        );
    }
  };

  return (
    <section 
      id={sectionId} 
      className={containerClass} 
      onClick={() => onSectionClick?.(idx)}
    >
      {renderComponent()}
      {isPreview && isSelected && (
        <div className="absolute top-10 right-10 bg-primary text-white p-4 rounded-3xl shadow-2xl animate-scale-up z-30 ring-8 ring-primary/20">
          <Check size={24} strokeWidth={4} />
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
        console.error('Error fetching public data:', err);
        setError(err.response?.data?.error || 'No se pudo cargar el sitio.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [publicSlug, urlPath]);

  if (loading) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary shadow-2xl shadow-primary/20"></div>
    </div>
  );

  if (error || !tenant) return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-10 text-center text-white font-sans antialiased">
      <Globe className="text-red-500 w-40 h-40 mb-12 opacity-10" />
      <h1 className="text-5xl font-black mb-6 tracking-tighter uppercase italic leading-none">Página no Disponible</h1>
      <p className="text-slate-500 max-w-lg mb-16 text-xl font-medium leading-relaxed">{error}</p>
      <Link to="/" className="px-12 py-6 bg-primary text-white rounded-[32px] font-black text-2xl hover:glow-effect transition-all shadow-2xl shadow-primary/40 uppercase italic">Ir al Inicio</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-primary/40 font-sans antialiased scroll-smooth">
      {/* Navbar Premium Dinámico */}
      <nav className="h-28 border-b border-white/5 flex items-center justify-between px-10 lg:px-20 backdrop-blur-3xl sticky top-0 z-50 bg-dark-950/80 shadow-2xl">
        <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-14 h-14 rounded-[22px] bg-dark-800 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl group-hover:border-primary/50 transition-all duration-500 ring-4 ring-transparent group-hover:ring-primary/10">
            {tenant?.logo ? <img src={tenant.logo} alt={tenant.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" /> : <Building2 className="text-primary w-8 h-8" />}
          </div>
          <div className="flex flex-col leading-none">
             <span className="font-black text-3xl tracking-tighter uppercase italic group-hover:text-primary transition-colors">{tenant?.name}</span>
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] ml-1">Official Site</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-16">
          {menu.map((item) => (
            <Link 
              key={item._id} 
              to={item.path === '/' ? '/' : `${item.path}`} 
              className={`text-xs font-black uppercase tracking-[0.3em] transition-all hover:text-primary hover:translate-y-[-2px] ${(urlPath === item.path.replace('/', '') || (!urlPath && item.path === '/')) ? 'text-primary' : 'text-slate-500'}`}
            >
              {item.name}
            </Link>
          ))}
          <button className="px-10 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95">Contactar</button>
        </div>

        <button className="lg:hidden p-4 bg-white/5 rounded-3xl border border-white/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
        </button>
      </nav>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-28 bg-dark-950 z-[60] p-10 lg:hidden animate-in slide-in-from-right duration-500">
          <div className="flex flex-col gap-10">
            {menu.map((item) => (
              <Link 
                key={item._id} 
                to={item.path === '/' ? '/' : `${item.path}`} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-5xl font-black text-white hover:text-primary transition-colors tracking-tighter uppercase italic"
              >
                {item.name}
              </Link>
            ))}
            <hr className="border-white/5 my-4" />
            <button className="w-full py-8 bg-primary text-white rounded-[32px] font-black text-2xl shadow-2xl uppercase italic">Comenzar Ahora</button>
          </div>
        </div>
      )}

      {/* Cuerpo de la Página */}
      <main className="animate-fade-in relative z-10">
        {!page || !page.sections || page.sections.length === 0 ? (
          <div className="py-72 text-center px-8 space-y-12">
            <h2 className="text-8xl md:text-[200px] font-black text-white tracking-tighter italic uppercase opacity-5 leading-none select-none">Cooming Soon</h2>
            <div className="max-w-3xl mx-auto space-y-8 relative z-20">
              <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none underline decoration-primary decoration-[12px] underline-offset-[-10px]">Bienvenido a {tenant?.name}</h3>
              <p className="text-slate-400 text-2xl font-bold leading-relaxed">Nuestra plataforma digital está siendo esculpida. Regresa pronto para una experiencia extraordinaria.</p>
            </div>
          </div>
        ) : (
          page.sections.map((section, idx) => <SectionRenderer key={section.id || idx} section={section} idx={idx} />)
        )}
      </main>

      <footer className="py-32 border-t border-white/5 bg-dark-950/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-10 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          <div className="flex flex-col items-center lg:items-start gap-4">
             <div className="flex items-center gap-4 group opacity-80">
                <Sparkles className="text-primary w-10 h-10 group-hover:rotate-12 transition-transform" />
                <span className="font-black text-3xl tracking-tighter uppercase italic">ModularBusiness</span>
             </div>
             <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] ml-1">Ecosistema Modular de Alto Rendimiento</p>
          </div>
          
          <div className="text-center lg:text-right space-y-2">
             <p className="text-slate-500 text-sm font-bold tracking-widest uppercase italic leading-none">Designed by Modular Agency</p>
             <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 Reservados todos los derechos</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;