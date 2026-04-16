import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../lib/api'; 
import { Sparkles, Building2, Globe, ArrowRight, Menu as MenuIcon, X, Check, Mail, Phone, MessageCircle, Star, Zap } from 'lucide-react';

// ✅ RUTAS CORREGIDAS (3 niveles)
import HeroSplit from '../../../modules/landing-page/sections/HeroSplit';
import HeroFull from '../../../modules/landing-page/sections/HeroFull';
import HeroCentered from '../../../modules/landing-page/sections/HeroCentered';
import FeaturesBento from '../../../modules/landing-page/sections/FeaturesBento';
import TestimonialsGrid from '../../../modules/landing-page/sections/TestimonialsGrid';
import CTAGradient from '../../../modules/landing-page/sections/CTAGradient';
import ContactPremium from '../../../modules/landing-page/sections/ContactPremium';
import ContactFormSplit from '../../../modules/landing-page/sections/ContactFormSplit';
import ModularPricing from '../../../modules/landing-page/sections/ModularPricing';
import ModularInfoSection from '../../../modules/landing-page/sections/ModularInfoSection';

export const SectionRenderer = ({ section, idx, isPreview = false, onSectionClick, isSelected = false, theme = {} }) => {
  if (!section || !section.content) return null;
  const sectionId = section.id || `${section.type}-${idx}`;
  const { layout = 'split' } = section.content;

  const handleAction = (action) => {
    if (isPreview) return; 
    if (!action || !action.value) return;
    switch (action.type) {
      case 'whatsapp': window.open(`https://wa.me/${action.value.replace(/\D/g, '')}`, '_blank'); break;
      case 'phone': window.location.href = `tel:${action.value}`; break;
      case 'email': window.location.href = `mailto:${action.value}`; break;
      case 'link':
        if (action.value.startsWith('#')) {
          document.getElementById(action.value.substring(1))?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.open(action.value.startsWith('http') ? action.value : `https://${action.value}`, '_blank');
        }
        break;
      default: break;
    }
  };

  const containerClass = `relative scroll-mt-24 transition-all duration-500 ${isPreview ? 'cursor-pointer' : ''} ${
    isSelected ? 'ring-4 ring-primary ring-inset z-20 bg-primary/5' : ''
  }`;

  const renderComponent = () => {
    const props = { content: section.content, handleAction, isPreview, theme };
    switch (section.type) {
      case 'hero':
        if (layout === 'centered') return <HeroCentered {...props} />;
        if (layout === 'background') return <HeroFull {...props} />;
        return <HeroSplit {...props} />;
      case 'features': return <FeaturesBento {...props} />;
      case 'testimonials': return <TestimonialsGrid {...props} />;
      case 'cta': return <CTAGradient {...props} />;
      case 'contact': 
        if (layout === 'split') return <ContactFormSplit {...props} />;
        return <ContactPremium {...props} />;
      case 'pricing': return <ModularPricing {...props} />;
      case 'info': return <ModularInfoSection {...props} />;
      default: return null;
    }
  };

  return (
    <section id={sectionId} className={containerClass} onClick={() => onSectionClick?.(idx)}>
      {renderComponent()}
      {isPreview && isSelected && (
        <div className="absolute top-10 right-10 bg-primary text-white p-4 rounded-3xl shadow-2xl animate-scale-up z-30 ring-8 ring-primary/20"><Check size={24} strokeWidth={4} /></div>
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
    if (hostname.includes('vercel.app') || hostname.includes('onrender.com')) return null;
    const parts = hostname.split('.');
    if (parts.length >= 3) return parts[0];
    if (hostname.includes('localhost') && parts.length >= 2 && parts[0] !== 'localhost') return parts[0];
    return null;
  };

  const publicSlug = getSlugFromHost();

  useEffect(() => {
    const fetchPublicData = async () => {
      if (!publicSlug) { setLoading(false); return; }
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
      } catch (err) { setError('Página no disponible.'); }
      finally { setLoading(false); }
    };
    fetchPublicData();
  }, [publicSlug, urlPath]);

  if (loading) return <div className="min-h-screen bg-dark-950 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div></div>;

  if (error || !tenant) return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-10 text-center text-white font-sans">
      <Globe className="text-red-500 w-40 h-40 mb-12 opacity-10" />
      <h1 className="text-5xl font-black mb-6 uppercase italic">Offline</h1>
      <Link to="/" className="px-12 py-6 bg-primary text-white rounded-[32px] font-black uppercase italic shadow-2xl">Ir al Inicio</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-primary/40 font-sans antialiased scroll-smooth">
      <nav className="h-28 border-b border-white/5 flex items-center justify-between px-8 lg:px-20 backdrop-blur-3xl sticky top-0 z-50 bg-dark-950/80 shadow-2xl">
        <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-14 h-14 rounded-[22px] bg-dark-800 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-primary/50 transition-all duration-500 ring-4 ring-transparent group-hover:ring-primary/10">
            {tenant?.logo ? <img src={tenant.logo} alt={tenant.name} className="w-full h-full object-cover scale-110" /> : <Building2 className="text-primary w-8 h-8" />}
          </div>
          <span className="font-black text-3xl tracking-tighter uppercase italic group-hover:text-primary transition-colors">{tenant?.name}</span>
        </div>
        <div className="hidden lg:flex items-center gap-12">
          {menu.map((item) => (
            <Link key={item._id} to={item.path === '/' ? '/' : `${item.path}`} className={`text-xs font-black uppercase tracking-[0.3em] transition-all hover:text-primary ${(urlPath === item.path.replace('/', '') || (!urlPath && item.path === '/')) ? 'text-primary' : 'text-slate-500'}`}>
              {item.name}
            </Link>
          ))}
          <button className="px-10 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl">Contactar</button>
        </div>
        <button className="lg:hidden p-4 bg-white/5 rounded-3xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}</button>
      </nav>

      <main className="animate-fade-in relative z-10">
        {!page || !page.sections || page.sections.length === 0 ? (
          <div className="py-72 text-center px-8 space-y-12">
            <h2 className="text-8xl md:text-[200px] font-black text-white tracking-tighter italic uppercase opacity-5 leading-none select-none">Coming Soon</h2>
            <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter underline decoration-primary decoration-[12px] underline-offset-[-10px]">Bienvenido a {tenant?.name}</h3>
          </div>
        ) : (
          page.sections.map((section, idx) => <SectionRenderer key={section.id || idx} section={section} idx={idx} />)
        )}
      </main>

      <footer className="py-32 border-t border-white/5 bg-dark-950/40 text-center">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-3">Powered by <Sparkles size={16} className="text-primary" /> ModularBusiness</p>
      </footer>
    </div>
  );
};

export default PublicLanding;