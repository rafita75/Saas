import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../lib/api';
import { Sparkles, Building2, Globe, ArrowRight, Menu as MenuIcon, X, Check, Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

/**
 * Componente que renderiza una sección específica basada en su tipo y contenido.
 * Se usa tanto en el Editor como en la Vista Pública para garantizar consistencia total.
 */
export const SectionRenderer = ({ section, idx, isPreview = false, onSectionClick, isSelected = false }) => {
  if (!section || !section.content) return null;
  
  const sectionId = section.id || (section.content.title ? section.content.title.toLowerCase().replace(/\s+/g, '-') : `${section.type}-${idx}`);
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
          el?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.open(action.value, '_blank');
        }
        break;
      default:
        break;
    }
  };

  const containerClass = `relative scroll-mt-24 transition-all duration-500 ${isPreview ? 'cursor-pointer rounded-[40px] border-2 overflow-hidden' : ''} ${
    isSelected ? 'border-primary shadow-[0_0_50px_-20px_rgba(99,102,241,0.6)] ring-8 ring-primary/5 bg-dark-800/40' : 'border-transparent'
  }`;

  const renderContent = () => {
    switch (section.type) {
      case 'hero':
        if (layout === 'centered') {
          return (
            <div className="max-w-5xl mx-auto text-center py-24 lg:py-40 px-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
                <Sparkles size={14} /> {section.content.badge || 'Bienvenido'}
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter text-white">{section.content.title}</h1>
              <p className="text-slate-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">{section.content.description}</p>
              {section.content.ctaText && (
                <button onClick={() => handleAction(section.content.action)} className="px-12 py-5 bg-primary text-white rounded-2xl font-black text-lg hover:glow-effect transition-all shadow-xl shadow-primary/20">
                  {section.content.ctaText}
                </button>
              )}
            </div>
          );
        }
        if (layout === 'background') {
          return (
            <div className="relative min-h-screen flex items-center justify-center py-20 px-6 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img src={section.content.image} className="w-full h-full object-cover scale-105" alt="Hero Background" />
                <div className="absolute inset-0 bg-dark-950/60 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-dark-950/40 via-transparent to-dark-950" />
              </div>
              <div className="max-w-5xl mx-auto text-center relative z-10">
                <h1 className="text-6xl md:text-9xl font-black mb-8 leading-none text-white tracking-tighter drop-shadow-2xl italic">{section.content.title}</h1>
                <p className="text-slate-200 text-xl md:text-3xl mb-12 max-w-3xl mx-auto font-medium drop-shadow-lg leading-relaxed">{section.content.description}</p>
                <button onClick={() => handleAction(section.content.action)} className="px-16 py-6 bg-white text-black rounded-[24px] font-black text-xl hover:scale-105 transition-all shadow-2xl flex items-center gap-3 mx-auto">
                  {section.content.ctaText || 'Comenzar'} <ArrowRight size={24} />
                </button>
              </div>
            </div>
          );
        }
        return (
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center py-24 lg:py-40 px-8">
            <div className="space-y-10 text-left">
              <div className="w-20 h-1.5 bg-primary rounded-full" />
              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] text-white tracking-tighter uppercase">{section.content.title}</h1>
              <p className="text-slate-400 text-xl leading-relaxed max-w-lg">{section.content.description}</p>
              <button onClick={() => handleAction(section.content.action)} className="group px-12 py-5 bg-primary text-white rounded-[24px] font-black text-lg hover:glow-effect transition-all flex items-center gap-4 w-fit shadow-2xl shadow-primary/20">
                {section.content.ctaText} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 rounded-[64px] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden border border-white/10 shadow-2xl ring-1 ring-white/20">
                <img src={section.content.image} alt="Hero Visual" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="max-w-7xl mx-auto py-32 px-8">
            <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">{section.content.title || '¿Por qué nosotros?'}</h2>
              <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
              <p className="text-slate-400 text-lg">{section.content.description || 'Descubre los pilares que nos hacen líderes en el mercado.'}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {section.content.items?.map((item, i) => (
                <div key={i} className="p-12 rounded-[48px] bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-white/[0.07] transition-all duration-500 group shadow-xl">
                  <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500"><Sparkles size={28} /></div>
                  <h4 className="text-2xl font-black text-white mb-4 tracking-tight">{item.title}</h4>
                  <p className="text-slate-400 text-base leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="max-w-5xl mx-auto py-32 px-8">
            <div className="glass rounded-[64px] p-16 lg:p-24 border border-white/10 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black mb-8 text-white tracking-tight">{section.content.title}</h2>
                <p className="text-slate-400 text-xl mb-16 max-w-2xl mx-auto leading-relaxed">{section.content.description}</p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                  {section.content.email && (
                    <button onClick={() => handleAction({ type: 'email', value: section.content.email })} className="flex flex-col items-center gap-4 group">
                      <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-white/10 flex items-center justify-center group-hover:text-primary group-hover:border-primary/50 transition-all"><Mail size={24} /></div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Escríbenos</p>
                        <p className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{section.content.email}</p>
                      </div>
                    </button>
                  )}
                  {section.content.phone && (
                    <button onClick={() => handleAction({ type: 'phone', value: section.content.phone })} className="flex flex-col items-center gap-4 group">
                      <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-white/10 flex items-center justify-center group-hover:text-primary group-hover:border-primary/50 transition-all"><Phone size={24} /></div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Llámanos</p>
                        <p className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{section.content.phone}</p>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="max-w-7xl mx-auto py-32 px-8 text-center bg-white/[0.02] border-y border-white/5">
            <h2 className="text-4xl md:text-6xl font-black mb-24 text-white tracking-tight">Voces que confían en nosotros</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {section.content.items?.map((item, i) => (
                <div key={i} className="p-12 rounded-[48px] bg-dark-900 border border-white/10 italic text-slate-300 relative shadow-2xl hover:translate-y-[-10px] transition-transform duration-500">
                  <div className="absolute -top-6 left-12 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-serif text-3xl shadow-lg shadow-primary/40">“</div>
                  <p className="mb-10 text-lg leading-relaxed font-medium">"{item.description}"</p>
                  <div className="flex items-center justify-center gap-4 not-italic">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary" />
                    <p className="font-black text-white text-sm uppercase tracking-wider">— {item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'cta':
        return (
          <div className="max-w-7xl mx-auto py-24 px-8">
            <div className="p-20 lg:p-32 rounded-[64px] bg-gradient-to-br from-primary to-secondary text-center space-y-10 shadow-[0_30px_100px_-20px_rgba(99,102,241,0.5)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="relative z-10 space-y-10">
                <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">{section.content.title}</h2>
                <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto font-medium">{section.content.description}</p>
                <button onClick={() => handleAction(section.content.action)} className="px-16 py-6 bg-white text-primary rounded-[24px] font-black text-2xl hover:scale-110 hover:shadow-2xl transition-all duration-500">
                  {section.content.buttonText || 'Comenzar ahora'}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="p-20 text-center text-slate-600 border-2 border-dashed border-slate-800 rounded-[40px] uppercase font-black tracking-widest opacity-40">Módulo {section.type} no configurado</div>;
    }
  };

  return (
    <section id={sectionId} className={containerClass} onClick={() => onSectionClick?.(idx)}>
      {renderContent()}
      {isPreview && isSelected && (
        <div className="absolute top-8 right-8 bg-primary text-white p-3 rounded-2xl shadow-2xl animate-scale-up z-20">
          <Check size={20} strokeWidth={4} />
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
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-8 text-center text-white font-sans">
      <Globe className="text-red-500 w-32 h-32 mb-10 opacity-20" />
      <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">Offline / No encontrado</h1>
      <p className="text-slate-400 max-w-md mb-12 text-lg">{error}</p>
      <Link to="/" className="px-10 py-4 bg-primary text-white rounded-[24px] font-black text-xl hover:glow-effect transition-all uppercase italic">Ir a ModularBusiness</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-primary/30 font-sans antialiased">
      <nav className="h-24 border-b border-white/5 flex items-center justify-between px-8 lg:px-16 backdrop-blur-2xl sticky top-0 z-50 bg-dark-950/80">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-[20px] bg-dark-800 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
            {tenant?.logo ? <img src={tenant.logo} alt={tenant.name} className="w-full h-full object-cover" /> : <Building2 className="text-primary w-6 h-6" />}
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase italic">{tenant?.name}</span>
        </div>

        <div className="hidden lg:flex items-center gap-12">
          {menu.map((item) => (
            <Link key={item._id} to={item.path === '/' ? '/' : `${item.path}`} className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-primary ${(urlPath === item.path.replace('/', '') || (!urlPath && item.path === '/')) ? 'text-primary' : 'text-slate-500'}`}>
              {item.name}
            </Link>
          ))}
          <button className="px-8 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl">Contactar</button>
        </div>
        <button className="lg:hidden p-4 bg-white/5 rounded-2xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X /> : <MenuIcon />}</button>
      </nav>

      <main className="animate-fade-in relative z-10">
        {!page || !page.sections || page.sections.length === 0 ? (
          <div className="py-60 text-center px-8 space-y-10">
            <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter italic uppercase opacity-10 leading-none">Under Construction</h2>
            <div className="max-w-2xl mx-auto space-y-6">
              <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Bienvenido a {tenant?.name}</h3>
              <p className="text-slate-500 text-xl font-medium leading-relaxed">Nuestra nueva identidad digital está siendo forjada. Regresa muy pronto para una experiencia extraordinaria.</p>
            </div>
          </div>
        ) : (
          page.sections.map((section, idx) => <SectionRenderer key={idx} section={section} idx={idx} />)
        )}
      </main>

      <footer className="py-24 border-t border-white/5 bg-dark-900/40">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-4 opacity-50">
            <Sparkles className="text-primary w-8 h-8" />
            <span className="font-black text-xl tracking-tighter uppercase italic">ModularBusiness</span>
          </div>
          <div className="flex gap-8 text-slate-500">
             <Instagram className="hover:text-primary cursor-pointer transition-colors" />
             <Facebook className="hover:text-primary cursor-pointer transition-colors" />
             <Twitter className="hover:text-primary cursor-pointer transition-colors" />
          </div>
          <p className="text-slate-600 text-xs font-black uppercase tracking-[0.3em]">© 2026 Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;