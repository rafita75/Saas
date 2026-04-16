import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Layout, Settings, Eye, Check, ChevronRight, Type, Edit3, Globe, Plus, Trash2, Smartphone, Monitor, X, Palette, List, Layers } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../core/auth/context/AuthContext'; 
import api from '../../../lib/api'; 
import { LANDING_TEMPLATES } from '../config/templates.config';
import Toast from '../../../shared/components/Toast'; 
import { TemplateRenderer, ModularNav, ModularFooter } from '../templates/TemplateRenderer';
import useBuilderStore from '../builder/useBuilderStore';

const LandingEditor = () => {
  const { tenant } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('editor');
  const [toast, setToast] = useState(null);
  const [isNew, setIsNew] = useState(!id);

  // Zustand Store
  const { 
    pageData, 
    setPageData, 
    selectedSectionIndex, 
    setSelectedSectionIndex,
    updateSectionContent,
    moveSection,
    deleteSection
  } = useBuilderStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id) {
          const pageRes = await api.get(`/landings/${id}`);
          if (pageRes.data.success) {
            setPageData(pageRes.data.landing);
            setIsNew(false);
          }
        }
      } catch (err) { setToast({ message: 'Error cargando datos', type: 'error' }); }
      finally { setLoading(false); }
    };
    if (tenant?.slug) fetchData();
  }, [id, tenant?.slug]);

  const selectTemplate = (t) => {
    setPageData({ 
      ...pageData, 
      name: t.name, 
      sections: t.sections.map((s, idx) => ({ ...s, id: `${s.type}-${idx}-${Date.now()}` })), 
      theme: t.theme, 
      templateId: t.id 
    });
  };

  const handleSave = async () => {
    if (!pageData.name) return setToast({ message: 'Nombre obligatorio', type: 'warning' });
    try {
      setLoading(true);
      if (isNew) await api.post('/landings', pageData);
      else await api.put(`/landings/${id}`, pageData);
      setToast({ message: '¡Página actualizada!', type: 'success' });
      setTimeout(() => navigate(`/${tenant?.slug}/landings`), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Error al guardar', type: 'error' });
      setLoading(false);
    }
  };

  if (loading && isNew && pageData.sections.length === 0) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;

  // Pantalla de Selección de Plantilla
  if (isNew && pageData.sections.length === 0) return (
    <div className="min-h-screen bg-slate-50 p-8 lg:p-24 flex flex-col items-center justify-center space-y-20">
      <div className="text-center space-y-6">
        <h2 className="text-7xl lg:text-[6rem] font-bold text-slate-900 tracking-tighter leading-none">Diseña tu <span className="text-indigo-600">Éxito</span></h2>
        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">Elige una estructura profesional y personalízala en segundos.</p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {LANDING_TEMPLATES.map((t) => (
          <div key={t.id} className="group bg-white rounded-[4rem] border border-slate-200 overflow-hidden flex flex-col hover:border-indigo-600 transition-all cursor-pointer shadow-2xl hover:-translate-y-4" onClick={() => selectTemplate(t)}>
            <div className="aspect-[4/3] relative overflow-hidden">
               <img src={t.previewImage} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-all" />
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"><span className="px-10 py-4 bg-indigo-600 text-white font-bold text-lg uppercase rounded-2xl shadow-2xl">Seleccionar</span></div>
            </div>
            <div className="p-12 space-y-4 border-t border-slate-100"><h3 className="text-3xl font-bold text-slate-900 tracking-tight">{t.name}</h3><p className="text-slate-400 text-base leading-relaxed">{t.description}</p></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden font-sans selection:bg-indigo-600/20 antialiased">
      
      {/* Top Header */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-50">
        <div className="flex items-center gap-8">
          <button onClick={() => navigate(`/${tenant?.slug}/landings`)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"><ArrowLeft size={20} /></button>
          <div className="flex flex-col">
            <input 
              type="text" 
              value={pageData.name} 
              onChange={(e) => setPageData({...pageData, name: e.target.value})} 
              className="bg-transparent text-lg font-bold text-slate-900 outline-none border-b border-transparent focus:border-indigo-600/30" 
              placeholder="Nombre de la página" 
            />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Constructor Visual / {pageData.templateId}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-1 rounded-2xl flex border border-slate-200">
            {[{ id: 'editor', label: 'Lienzo', icon: Layout }, { id: 'settings', label: 'SEO', icon: Globe }].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
          <button 
            onClick={handleSave} 
            className="bg-slate-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl font-bold text-xs uppercase flex items-center gap-3 shadow-xl transition-all active:scale-95"
          >
            <Save size={18} /> Publicar
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Inspector */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto overflow-x-hidden">
          <div className="p-8 space-y-12">
            
            {selectedSectionIndex !== null ? (
              <div className="space-y-10 animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Edit3 size={14} /> Inspector</h3>
                  <button onClick={() => setSelectedSectionIndex(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><X size={16} /></button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => moveSection(selectedSectionIndex, -1)} className="py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 text-[10px] font-black uppercase transition-all">Subir</button>
                  <button onClick={() => moveSection(selectedSectionIndex, 1)} className="py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 text-[10px] font-black uppercase transition-all">Bajar</button>
                  <button onClick={() => deleteSection(selectedSectionIndex)} className="col-span-2 py-3 bg-red-50 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase transition-all mt-2">Eliminar Sección</button>
                </div>

                <div className="pt-8 border-t border-slate-100 space-y-6">
                   <p className="text-[10px] font-black text-slate-400 uppercase">Ajustes de Bloque</p>
                   {/* Aquí irían controles de imagen/layout específicos si los hay */}
                   <p className="text-xs text-slate-500 italic">Haz clic directamente en los textos de la derecha para editarlos.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><Layers size={14} /> Capas</h3>
                  <div className="space-y-2">
                    {pageData.sections.map((s, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setSelectedSectionIndex(idx)} 
                        className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between group ${selectedSectionIndex === idx ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200'}`}
                      >
                        <span className={`text-xs font-bold uppercase tracking-tight transition-colors ${selectedSectionIndex === idx ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-900'}`}>{s.type}</span>
                        <ChevronRight size={14} className={selectedSectionIndex === idx ? 'text-indigo-600' : 'text-slate-300'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-100 space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Añadir Componente</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['pitch', 'pricing', 'info', 'contact'].map(type => (
                      <button key={type} className="py-3 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">+ {type}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Live Canvas Area */}
        <main className="flex-1 overflow-y-auto flex flex-col items-center py-20 px-10 scroll-smooth">
          <div className="w-full max-w-5xl bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-[3rem] overflow-hidden border border-slate-200 relative min-h-full">
            
            {activeTab === 'editor' ? (
              <div className="relative">
                <ModularNav tenant={tenant} isEditor={true} />
                {pageData.sections.map((s, idx) => (
                  <TemplateRenderer 
                    key={idx} 
                    templateId={pageData.templateId} 
                    section={s} 
                    idx={idx} 
                    isPreview={true} 
                    isSelected={selectedSectionIndex === idx} 
                    onSectionClick={setSelectedSectionIndex} 
                    theme={pageData.theme} 
                  />
                ))}
                <ModularFooter tenant={tenant} />
              </div>
            ) : (
              <div className="max-w-2xl mx-auto py-32 px-12 space-y-20">
                <div className="space-y-4">
                  <h3 className="text-5xl font-bold text-slate-900 tracking-tighter">SEO & Social</h3>
                  <p className="text-slate-500 font-medium">Define cómo se verá tu página en los buscadores.</p>
                </div>
                <div className="space-y-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Título SEO</label>
                    <input type="text" value={pageData.seo.title} onChange={(e) => setPageData({...pageData, seo: {...pageData.seo, title: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-6 text-xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Descripción</label>
                    <textarea value={pageData.seo.description} onChange={(e) => setPageData({...pageData, seo: {...pageData.seo, description: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-6 text-lg text-slate-600 h-60 outline-none resize-none focus:ring-4 focus:ring-indigo-600/5 transition-all" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LandingEditor;