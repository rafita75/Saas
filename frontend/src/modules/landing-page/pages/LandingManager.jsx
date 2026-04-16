import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Globe, Edit3, Trash2, ExternalLink, MoreVertical, Search, Filter, Layout, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../../../core/auth/context/AuthContext';
import api from '../../../lib/api';
import Toast from '../../../shared/components/Toast';
import { getPublicUrl } from '../../../config/domains';

const LandingManager = () => {
  const { tenant } = useAuth();
  const navigate = useNavigate();
  const [landings, setLandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchLandings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/landings');
        setLandings(response.data.landings || []);
      } catch (err) {
        setToast({ message: 'Error al cargar las páginas', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    if (tenant?.slug) fetchLandings();
  }, [tenant?.slug]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta página?')) return;
    try {
      await api.delete(`/landings/${id}`);
      setLandings(landings.filter(l => l._id !== id));
      setToast({ message: 'Página eliminada', type: 'success' });
    } catch (err) {
      setToast({ message: 'Error al eliminar', type: 'error' });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header Seccion */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center">
                <Layout className="text-indigo-500 w-5 h-5" />
             </div>
             <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Mis <span className="text-indigo-600">Landings</span></h2>
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest ml-14">Gestiona tu presencia digital modular</p>
        </div>

        <button 
          onClick={() => navigate(`/${tenant.slug}/landings/new`)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 shadow-2xl shadow-indigo-600/20 transition-all hover:-translate-y-1 active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> Nueva Página
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-2 rounded-2xl">
         <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
            <input type="text" placeholder="BUSCAR PÁGINA..." className="w-full bg-transparent pl-12 pr-4 py-3 text-[10px] font-black uppercase tracking-widest text-white outline-none" />
         </div>
         <div className="h-8 w-px bg-white/5" />
         <button className="px-6 py-3 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
            <Filter size={14} /> Filtros
         </button>
      </div>

      {/* Grid de Landings */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[1,2,3].map(i => (
             <div key={i} className="h-80 bg-white/[0.02] border border-white/5 rounded-[3rem] animate-pulse" />
           ))}
        </div>
      ) : landings.length === 0 ? (
        <div className="py-32 text-center space-y-8 bg-white/[0.01] border border-dashed border-white/10 rounded-[4rem]">
           <div className="w-24 h-24 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto ring-8 ring-indigo-600/5">
              <Sparkles className="text-slate-700 w-10 h-10" />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase italic">No tienes páginas aún</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">Comienza creando tu primera landing page con nuestras plantillas premium.</p>
           </div>
           <button onClick={() => navigate(`/${tenant.slug}/landings/new`)} className="text-indigo-500 font-black uppercase text-[10px] tracking-[0.2em] hover:text-indigo-400 transition-all">Crear ahora →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {landings.map((landing) => (
            <div key={landing._id} className="group bg-slate-950 border border-white/[0.05] rounded-[3rem] overflow-hidden hover:border-indigo-600/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl relative">
              
              <div className="aspect-[16/10] bg-indigo-600/5 relative overflow-hidden flex items-center justify-center border-b border-white/[0.05]">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Building2 className="text-slate-800 w-16 h-16 group-hover:scale-110 group-hover:text-indigo-900 transition-all duration-700" />
                 
                 <div className="absolute top-6 right-6">
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                       <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Activa
                    </span>
                 </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-1">
                   <h3 className="text-xl font-black text-white uppercase italic tracking-tighter truncate">{landing.name}</h3>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Globe size={10} className="text-indigo-500" /> /{landing.path}
                   </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                   <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/${tenant.slug}/landings/${landing._id}`)}
                        className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all"
                        title="Editar página"
                      >
                         <Edit3 size={16} />
                      </button>
                      <a 
                        href={`${getPublicUrl(tenant.publicSlug)}${landing.path === 'root' ? '' : `/${landing.path}`}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                        title="Ver en vivo"
                      >
                         <ExternalLink size={16} />
                      </a>
                   </div>
                   <button 
                     onClick={() => handleDelete(landing._id)}
                     className="p-3 text-slate-600 hover:text-red-500 transition-all"
                     title="Eliminar"
                   >
                      <Trash2 size={16} />
                   </button>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </div>
          ))}
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LandingManager;