import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../lib/api';
import { Sparkles, Building2, Globe, ArrowRight, Menu as MenuIcon, X, Check, Mail, Phone, MessageCircle, Star, Zap } from 'lucide-react';

/**
 * SectionRenderer: El motor visual del SaaS.
 * Renderiza bloques profesionales con diseños variados.
 */
export const SectionRenderer = ({ section, idx, isPreview = false, onSectionClick, isSelected = false }) => {
  if (!section || !section.content) return null;
  
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
          el?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.open(action.value, '_blank');
        }
        break;
      default:
        break;
    }
  };

  const containerClass = `relative scroll-mt-24 transition-all duration-500 ${isPreview ? 'cursor-pointer rounded-[48px] border-2 overflow-hidden mb-12' : ''} ${
    isSelected ? 'border-primary shadow-[0_0_60px_-20px_rgba(99,102,241,0.7)] ring-[12px] ring-primary/5 bg-dark-800/40' : 'border-transparent'
  }`;

  const renderContent = () => {
    switch (section.type) {
      case 'hero':
        if (layout === 'centered') {
          return (
            <div className="max-w-5xl mx-auto text-center py-32 lg:py-48 px-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-10">
                <Sparkles size={14} /> {section.content.badge || 'Nueva Solución'}
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-10 leading-[1.1] tracking-tighter text-white uppercase italic">{section.content.title}</h1>
              <p className="text-slate-400 text-xl md:text-2xl mb-16 max-w-3xl mx-auto leading-relaxed">{section.content.description}</p>
              {section.content.ctaText && (
                <button onClick={() => handleAction(section.content.action)} className="px-16 py-6 bg-primary text-white rounded-[24px] font-black text-xl hover:glow-effect transition-all shadow-xl shadow-primary/30 uppercase italic">
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
                <img src={section.content.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0'} className="w-full h-full object-cover scale-105" alt="Background" />
                <div className="absolute inset-0 bg-dark-950/70 backdrop-blur-[1px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
              </div>
              <div className="max-w-5xl mx-auto text-center relative z-10">
                <h1 className="text-6xl md:text-9xl font-black mb-10 leading-none text-white tracking-tighter drop-shadow-2xl italic uppercase">{section.content.title}</h1>
                <p className="text-slate-200 text-xl md:text-3xl mb-12 max-w-3xl mx-auto font-medium drop-shadow-lg leading-relaxed">{section.content.description}</p>
                <button onClick={() => handleAction(section.content.action)} className="px-16 py-6 bg-white text-black rounded-[24px] font-black text-xl hover:scale-105 transition-all shadow-2xl flex items-center gap-4 mx-auto uppercase italic">
                  {section.content.ctaText || 'Comenzar'} <ArrowRight size={28} />
                </button>
              </div>
            </div>
          );
        }
        return (
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center py-24 lg:py-48 px-8">
            <div className="space-y-12 text-left">
              <div className="w-24 h-2 bg-primary rounded-full shadow-lg shadow-primary/20" />
              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] text-white tracking-tighter uppercase italic">{section.content.title}</h1>
              <p className="text-slate-400 text-xl md:text-2xl leading-relaxed max-w-lg">{section.content.description}</p>
              <button onClick={() => handleAction(section.content.action)} className="group px-12 py-6 bg-primary text-white rounded-[24px] font-black text-xl hover:glow-effect transition-all flex items-center gap-4 w-fit shadow-2xl shadow-primary/20 uppercase italic">
                {section.content.ctaText} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/30 rounded-[70px] blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] ring-1 ring-white/20">
                <img src={section.content.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'} alt="Hero" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="max-w-7xl mx-auto py-32 lg:py-48 px-8">
            <div className="text-center max-w-3xl mx-auto mb-32 space-y-6">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase italic">{section.content.title || 'Excelencia'}</h2>
              <div className="w-32 h-1.5 bg-primary mx-auto rounded-full shadow-lg shadow-primary/20" />
              <p className="text-slate-400 text-xl font-medium">{section.content.description || 'Nuestros pilares fundamentales.'}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {section.content.items?.map((item, i) => (
                <div key={i} className="p-12 rounded-[56px] bg-white/[0.03] border border-white/5 hover:border-primary/40 hover:bg-white/[0.07] transition-all duration-700 group shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-12 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl"><Zap size={28} strokeWidth={3} /></div>
                  <h4 className="text-3xl font-black text-white mb-6 tracking-tight uppercase italic">{item.title}</h4>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="max-w-7xl mx-auto py-32 lg:py-48 px-8 text-center bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
            <h2 className="text-5xl md:text-7xl font-black mb-32 text-white tracking-tighter uppercase italic leading-none relative z-10">Casos de Éxito</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
              {section.content.items?.map((item, i) => (
                <div key={i} className="p-14 rounded-[64px] bg-dark-900 border border-white/10 italic text-slate-300 relative shadow-2xl hover:translate-y-[-15px] transition-all duration-700 group">
                  <div className="absolute -top-8 left-16 w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-white font-serif text-5xl shadow-2xl shadow-primary/40 group-hover:rotate-12 transition-transform">“</div>
                  <p className="mb-12 text-xl leading-relaxed font-semibold">"{item.description}"</p>
                  <div className="flex items-center justify-center gap-5 not-italic">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg" />
                    <p className="font-black text-white text-base uppercase tracking-widest">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'cta':
        return (
          <div className="max-w-7xl mx-auto py-32 px-8">
            <div className="p-20 lg:p-32 rounded-[80px] bg-gradient-to-br from-primary via-primary to-secondary text-center space-y-12 shadow-[0_40px_120px_-30px_rgba(99,102,241,0.6)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse" />
              <div className="relative z-10 space-y-12">
                <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none uppercase italic">{section.content.title}</h2>
                <p className="text-white/90 text-2xl md:text-3xl max-w-4xl mx-auto font-bold tracking-tight">{section.content.description}</p>
                <button onClick={() => handleAction(section.content.action)} className="px-16 py-6 bg-white text-primary rounded-[32px] font-black text-2xl hover:scale-110 hover:shadow-2xl transition-all duration-500 uppercase italic">
                  {section.content.buttonText || 'Comenzar ahora'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="max-w-5xl mx-auto py-32 lg:py-48 px-8">
            <div className="glass rounded-[70px] p-20 lg:p-32 border border-white/10 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -mr-40 -mt-40" />
              <div className="relative z-10">
                <h2 className="text-5xl md:text-7xl font-black mb-10 text-white tracking-tighter uppercase italic leading-none">{section.content.title}</h2>
                <p className="text-slate-400 text-xl md:text-2xl mb-20 max-w-2xl mx-auto leading-relaxed font-medium">{section.content.description}</p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-16">
                  {section.content.email && (
                    <button onClick={() => handleAction({ type: 'email', value: section.content.email })} className="flex flex-col items-center gap-6 group hover:scale-105 transition-transform">
                      <div className="w-20 h-20 rounded-3xl bg-dark-800 border border-white/10 flex items-center justify-center group-hover:text-primary group-hover:border-primary/50 transition-all shadow-xl shadow-black/50"><Mail size={32} strokeWidth={2.5} /></div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Canal Digital</p>
                        <p className="text-2xl font-black text-white group-hover:text-primary transition-colors underline decoration-primary/30 underline-offset-8">{section.content.email}</p>
                      </div>
                    </button>
                  )}
                  {section.content.phone && (
                    <button onClick={() => handleAction({ type: 'phone', value: section.content.phone })} className="flex flex-col items-center gap-6 group hover:scale-105 transition-transform">
                      <div className="w-20 h-20 rounded-3xl bg-dark-800 border border-white/10 flex items-center justify-center group-hover:text-primary group-hover:border-primary/50 transition-all shadow-xl shadow-black/50"><MessageCircle size={32} strokeWidth={2.5} /></div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Atención Directa</p>
                        <p className="text-2xl font-black text-white group-hover:text-primary transition-colors underline decoration-primary/30 underline-offset-8">{section.content.phone}</p>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id={sectionId} className={containerClass} onClick={() => onSectionClick?.(idx)}>
      {renderContent()}
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
        setError(err.response?.data?.error || 'Página no disponible.');
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
      <h1 className="text-5xl font-black mb-6 tracking-tighter uppercase italic leading-none">Offline / No Encontrado</h1>
      <p className="text-slate-500 max-w-lg mb-16 text-xl font-medium leading-relaxed">{error || 'El negocio solicitado no existe o no tiene una presencia digital activa.'}</p>
      <Link to="/" className="px-12 py-6 bg-primary text-white rounded-[32px] font-black text-2xl hover:glow-effect transition-all uppercase italic shadow-2xl shadow-primary/40">Ir al Portal Principal</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-primary/40 font-sans antialiased scroll-smooth">
      <nav className="h-28 border-b border-white/5 flex items-center justify-between px-10 lg:px-20 backdrop-blur-3xl sticky top-0 z-50 bg-dark-950/80 shadow-2xl">
        <div className="flex items-center gap-6 group cursor-pointer">
          <div className="w-14 h-14 rounded-3xl bg-dark-800 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl group-hover:border-primary/50 transition-all duration-500 ring-4 ring-transparent group-hover:ring-primary/10">
            {tenant?.logo ? <img src={tenant.logo} alt={tenant.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" /> : <Building2 className="text-primary w-8 h-8" />}
          </div>
          <div className="flex flex-col leading-none">
             <span className="font-black text-3xl tracking-tighter uppercase italic group-hover:text-primary transition-colors">{tenant?.name}</span>
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] ml-1">Official Brand</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-16">
          {menu.map((item) => (
            <Link key={item._id} to={item.path === '/' ? '/' : `${item.path}`} className={`text-xs font-black uppercase tracking-[0.3em] transition-all hover:text-primary hover:translate-y-[-2px] ${(urlPath === item.path.replace('/', '') || (!urlPath && item.path === '/')) ? 'text-primary' : 'text-slate-500'}`}>
              {item.name}
            </Link>
          ))}
          <button className="px-10 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95">Contactar</button>
        </div>
        <button className="lg:hidden p-4 bg-white/5 rounded-3xl border border-white/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}</button>
      </nav>

      <main className="animate-fade-in relative z-10 pb-20">
        {!page || !page.sections || page.sections.length === 0 ? (
          <div className="py-72 text-center px-8 space-y-12">
            <h2 className="text-8xl md:text-[180px] font-black text-white tracking-tighter italic uppercase opacity-5 leading-none select-none">Coming Soon</h2>
            <div className="max-w-3xl mx-auto space-y-8 relative z-20">
              <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none underline decoration-primary decoration-8 underline-offset-[-5px]">Bienvenido a {tenant?.name}</h3>
              <p className="text-slate-400 text-2xl font-bold leading-relaxed">Estamos esculpiendo una experiencia digital única. <br />Vuelve en unos momentos para descubrir el futuro de {tenant?.name}.</p>
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
             <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.4em] ml-1">Premium SaaS Infrastructure</p>
          </div>
          
          <div className="flex gap-12 text-slate-500">
             <Link to="#" className="hover:text-primary transition-colors hover:scale-110"><Globe size={28} /></Link>
             <Link to="#" className="hover:text-primary transition-colors hover:scale-110"><MessageCircle size={28} /></Link>
             <Link to="#" className="hover:text-primary transition-colors hover:scale-110"><Star size={28} /></Link>
          </div>
          
          <div className="text-center lg:text-right space-y-2">
             <p className="text-slate-500 text-sm font-bold tracking-widest uppercase italic">Design & Build Excellence</p>
             <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;