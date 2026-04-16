import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../lib/api'; 
import { Globe } from 'lucide-react';
import { TemplateRenderer, ModularNav, ModularFooter, LuminaNav, LuminaFooter, EliteNav, EliteFooter } from '../../../modules/landing-page/templates/TemplateRenderer';

const PublicLanding = () => {
  const { path: urlPath } = useParams();
  const [tenant, setTenant] = useState(null);
  const [page, setPage] = useState(null);
  const [menu, setMenu] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getSlugFromHost = () => {
    const hostname = window.location.hostname;
    // Si es un entorno de desarrollo o vercel sin subdominio real
    if (hostname === 'localhost' || hostname.includes('vercel.app') || hostname.includes('onrender.com')) {
       // Intentar sacar el slug de la URL si estamos en modo preview de fallback
       const searchParams = new URLSearchParams(window.location.search);
       return searchParams.get('tenant') || null;
    }
    
    const parts = hostname.split('.');
    // Caso subdominio: cliente.midominio.com ->parts=['cliente', 'midominio', 'com']
    if (parts.length >= 2) return parts[0];
    return null;
  };

  const publicSlug = getSlugFromHost();

  useEffect(() => {
    const fetchPublicData = async () => {
      // Si no hay slug por subdominio, no podemos cargar nada público
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
      } catch (err) { 
        console.error("Error cargando landing pública:", err);
        setError('Página no disponible.'); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchPublicData();
  }, [publicSlug, urlPath]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div></div>;

  if (error || !tenant) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-10 text-center text-white font-sans">
      <Globe className="text-indigo-600 w-40 h-40 mb-12 opacity-10" />
      <h1 className="text-5xl font-black mb-6 uppercase italic tracking-tighter">Site Offline</h1>
      <p className="text-slate-500 max-w-sm mb-12 uppercase text-[10px] font-bold tracking-[0.2em]">El subdominio <span className="text-indigo-500">"{publicSlug || 'unknown'}"</span> no está configurado o no tiene una página de inicio activa.</p>
      <Link to="/" className="px-12 py-6 bg-indigo-600 text-white rounded-[32px] font-black uppercase italic shadow-2xl hover:bg-indigo-500 transition-all">Ir al Inicio</Link>
    </div>
  );

  const getNavAndFooter = () => {
    switch(page?.templateId) {
      case 'lumina': return { Nav: LuminaNav, Footer: LuminaFooter };
      case 'elite': return { Nav: EliteNav, Footer: EliteFooter };
      default: return { Nav: ModularNav, Footer: ModularFooter };
    }
  };

  const { Nav, Footer } = getNavAndFooter();

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-600/20 font-sans antialiased scroll-smooth">
      <Nav tenant={tenant} menu={menu} />
      <main className="animate-fade-in relative z-10">
        {!page || !page.sections || page.sections.length === 0 ? (
          <div className="py-72 text-center px-8 space-y-12 bg-slate-50">
            <h2 className="text-8xl md:text-[200px] font-black text-slate-900 tracking-tighter italic uppercase opacity-5 leading-none select-none">Coming Soon</h2>
            <h3 className="text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter underline decoration-indigo-600 decoration-[12px] underline-offset-[-10px]">Bienvenido a {tenant?.name}</h3>
          </div>
        ) : (
          page.sections.map((section, idx) => (
            <TemplateRenderer 
              key={section.id || idx} 
              templateId={page.templateId} 
              section={section} 
              idx={idx} 
              theme={page.theme}
            />
          ))
        )}
      </main>
      <Footer tenant={tenant} />
    </div>
  );
};

export default PublicLanding;