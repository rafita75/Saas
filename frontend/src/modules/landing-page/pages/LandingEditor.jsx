import { useState } from 'react';
import { Save, Plus, ArrowLeft, Layout, Settings, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth/context/AuthContext';

const LandingEditor = () => {
  const { tenant } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('editor'); // editor | settings | preview
  
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      {/* Cabecera del Editor */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            to={`/${tenant?.slug}/landings`}
            className="p-2 bg-dark-800 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-white">Nueva Landing Page</h2>
            <p className="text-slate-500 text-xs font-mono">ID: Sin guardar</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-dark-900/50 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'editor' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Layout size={14} /> Editor
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Settings size={14} /> SEO
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'preview' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Eye size={14} /> Vista Previa
            </button>
          </div>

          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all">
            <Save size={18} /> Publicar
          </button>
        </div>
      </div>

      {/* Área de Trabajo */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        {/* Panel de Bloques */}
        <div className="lg:col-span-1 glass rounded-3xl border border-white/5 p-6 flex flex-col gap-6 overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Bloques Disponibles</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              { type: 'hero', label: 'Encabezado (Hero)', icon: Layout },
              { type: 'features', label: 'Características', icon: Settings },
              { type: 'testimonials', label: 'Testimonios', icon: Layout },
              { type: 'pricing', label: 'Tabla de Precios', icon: Settings },
              { type: 'contact', label: 'Formulario Contacto', icon: Layout },
            ].map(block => (
              <button 
                key={block.type}
                className="w-full p-4 bg-dark-800/50 border border-slate-700/50 rounded-2xl flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                  <block.icon size={18} className="text-slate-400 group-hover:text-primary" />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white">{block.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas del Editor */}
        <div className="lg:col-span-3 glass rounded-3xl border border-white/5 bg-dark-900/30 overflow-y-auto p-12">
          {activeTab === 'editor' && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="py-20 border-2 border-dashed border-slate-800 rounded-[40px] flex flex-col items-center justify-center gap-4 text-slate-600">
                <Plus size={48} />
                <p className="font-medium">Arrastra o haz clic en un bloque para empezar</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto space-y-6">
              <h3 className="text-xl font-bold text-white mb-8">Configuración SEO</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Título de la página</label>
                  <input type="text" className="w-full bg-dark-800 border border-slate-700 rounded-xl px-4 py-3 text-white" placeholder="Ej: Mi Oferta Increíble" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Descripción (Meta Description)</label>
                  <textarea className="w-full bg-dark-800 border border-slate-700 rounded-xl px-4 py-3 text-white h-32" placeholder="Escribe aquí de qué trata tu página..." />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingEditor;