import { useState, useEffect } from 'react';
import { Plus, Layout, Edit3, Globe, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../core/auth/context/AuthContext';
import api from '../../../lib/api';
import { getPublicUrl } from '../../../config/domains';
import Toast from '../../../shared/components/Toast';

const LandingManager = () => {
  const { tenant } = useAuth();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchPages = async () => {
    try {
      const response = await api.get('/landings');
      setPages(response.data.landings);
    } catch (err) {
      console.error('Error al cargar páginas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenant?.slug) fetchPages();
  }, [tenant?.slug]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta página? No se podrá recuperar.')) return;

    try {
      await api.delete(`/landings/${id}`);
      setToast({ message: 'Página eliminada correctamente', type: 'success' });
      fetchPages();
    } catch (err) {
      setToast({ message: 'Error al eliminar la página', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Mis Landing Pages</h2>
          <p className="text-slate-400 text-sm">Gestiona tus páginas de aterrizaje y campañas</p>
        </div>
        
        <Link 
          to={`/${tenant?.slug}/landings/new`}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Nueva Página
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.length === 0 && !loading ? (
          <div className="lg:col-span-3 py-20 text-center glass rounded-3xl border border-dashed border-slate-700">
            <Layout size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No tienes páginas creadas</h3>
            <p className="text-slate-500 mb-8">Comienza a crear tu primera página para captar clientes.</p>
            <Link 
              to={`/${tenant?.slug}/landings/new`}
              className="text-primary hover:underline font-bold"
            >
              Crear mi primera landing page →
            </Link>
          </div>
        ) : (
          pages.map(page => (
            <div key={page._id} className="glass rounded-2xl border border-white/5 overflow-hidden group hover:border-primary/30 transition-all">
              <div className="aspect-video bg-dark-800 flex items-center justify-center border-b border-white/5">
                <Globe size={40} className="text-slate-700 group-hover:text-primary/30 transition-all" />
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white truncate">{page.name}</h4>
                  <p className="text-slate-500 text-xs font-mono">
                    {getPublicUrl(tenant?.publicSlug)}{page.path === '/' ? '' : page.path}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2">
                    <Link 
                      to={`/${tenant?.slug}/landings/${page._id}/edit`}
                      className="p-2 bg-dark-800 text-slate-300 rounded-lg hover:text-white hover:bg-dark-700 transition-all border border-white/5"
                    >
                      <Edit3 size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(page._id)}
                      className="p-2 bg-dark-800 text-slate-300 rounded-lg hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/5"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <a 
                    href={`${getPublicUrl(tenant?.publicSlug)}${page.path === '/' ? '' : page.path}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline font-bold"
                  >
                    Ver en vivo <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LandingManager;