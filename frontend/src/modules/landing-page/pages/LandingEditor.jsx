import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Layout, Globe, ChevronRight, Edit3, Plus, Trash2, X, Layers, Minimize2, Maximize2, ChevronLeft, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [zoom, setZoom] = useState(0.75);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { 
    pageData, 
    setPageData, 
    selectedSectionIndex, 
    setSelectedSectionIndex,
    updateSectionContent,
    updateListItem,
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
    setPageData({ ...pageData, name: t.name, sections: t.sections.map((s, idx) => ({ ...s, id: `${s.type}-${idx}-${Date.now()}` })), theme: t.theme, templateId: t.id });
  };

  const handleSave = async () => {
    if (!pageData.name) return setToast({ message: 'Nombre obligatorio', type: 'warning' });
    try {
      setLoading(true);
      if (isNew) await api.post('/landings', pageData);
      else await api.put(`/landings/${id}`, pageData);
      setToast({ message: '¡Publicación exitosa!', type: 'success' });
      setTimeout(() => navigate(`/${tenant?.slug}/landings`), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Error al guardar', type: 'error' });
      setLoading(false);
    }
  };

  if (loading && isNew && pageData.sections.length === 0) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;

  if (isNew && pageData.sections.length === 0) return (
    <div className="min-h-screen bg-slate-50 p-8 lg:p-24 flex flex-col items-center justify-center space-y-20">
      <div className="text-center space-y-6">
        <h2 className="text-7xl lg:text-[6rem] font-bold text-slate-900 tracking-tighter leading-none">Diseña tu <span className="text-indigo-600 underline decoration-indigo-100 decoration-[20px] underline-offset-[-15px]">Éxito</span></h2>
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
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden font-sans selection:bg-indigo-600/20 antialiased">
      
      {/* Top Header - Ultra Compacto */}
      <header className="h-14 bg-slate-950 border-b border-white/5 flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 text-slate-400 hover:text-white transition-all">
            {isSidebarCollapsed ? <PanelLeftOpen size={20}/> : <PanelLeftClose size={20}/>}
          </button>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <button onClick={() => navigate(`/${tenant?.slug}/landings`)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-slate-300 transition-all"><ArrowLeft size={18} /></button>
          <input 
            type="text" 
            value={pageData.name} 
            onChange={(e) => setPageData({...pageData, name: e.target.value})} 
            className="bg-transparent text-xs font-bold text-white outline-none border-b border-transparent focus:border-indigo-500/50 w-48" 
            placeholder="Nombre de la página" 
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
             <button onClick={() => setZoom(Math.max(0.3, zoom - 0.05))} className="p-1 text-slate-400 hover:text-white"><Minimize2 size={12}/></button>
             <span className="text-[9px] font-black text-slate-500 w-8 text-center">{Math.round(zoom * 100)}%</span>
             <button onClick={() => setZoom(Math.min(1.2, zoom + 0.05))} className="p-1 text-slate-400 hover:text-white"><Maximize2 size={12}/></button>
          </div>
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
            <button onClick={() => setActiveTab('editor')} className={`p-1.5 rounded-md transition-all ${activeTab === 'editor' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}><Layout size={16}/></button>
            <button onClick={() => setActiveTab('settings')} className={`p-1.5 rounded-md transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}><Globe size={16}/></button>
          </div>
          <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-black text-[9px] uppercase shadow-xl transition-all active:scale-95 ml-2">Publicar</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden bg-slate-950">
        
        {/* Sidebar Inspector - Colapsable */}
        <aside className={`${isSidebarCollapsed ? 'w-0 opacity-0 -translate-x-full' : 'w-80 opacity-100 translate-x-0'} bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out z-40`}>
          <div className="p-6 space-y-10">
            {selectedSectionIndex !== null ? (
              <div className="space-y-8 animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Edit3 size={14} /> Inspector</h3>
                  <button onClick={() => setSelectedSectionIndex(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><X size={14} /></button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => moveSection(selectedSectionIndex, -1)} className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 text-[10px] font-black uppercase transition-all">Subir</button>
                  <button onClick={() => moveSection(selectedSectionIndex, 1)} className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 text-[10px] font-black uppercase transition-all">Bajar</button>
                  <button onClick={() => deleteSection(selectedSectionIndex)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                </div>
                <div className="space-y-6">
                   <p className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 pb-2">Propiedades</p>
                   {Object.entries(pageData.sections[selectedSectionIndex].content).map(([key, val]) => {
                     if (['items', 'stats', 'action', 'secondaryAction', 'layout'].includes(key)) return null;
                     return (
                       <div key={key} className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{key}</label>
                         {key.toLowerCase().includes('description') || key === 'text' ? 
                           <textarea value={val} onChange={(e) => updateSectionContent(key, e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 outline-none h-32 resize-none focus:border-indigo-600/30 transition-all" /> : 
                           <input type="text" value={val} onChange={(e) => updateSectionContent(key, e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 outline-none focus:border-indigo-600/30 transition-all" />
                         }
                       </div>
                     );
                   })}
                   {pageData.sections[selectedSectionIndex].content.items && (
                     <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 pb-2">Contenido Dinámico</p>
                        {pageData.sections[selectedSectionIndex].content.items.map((item, iIdx) => (
                          <div key={iIdx} className="p-4 bg-slate-50 rounded-2xl space-y-3 border border-slate-100">
                             <div className="space-y-1">
                                <label className="text-[8px] font-bold text-indigo-400 uppercase">Título/Nombre</label>
                                <input type="text" value={item.name || item.title} onChange={(e) => updateListItem(iIdx, item.name ? 'name' : 'title', e.target.value)} className="w-full bg-transparent border-none text-[10px] font-bold uppercase outline-none text-slate-900" />
                             </div>
                             <div className="space-y-1">
                                <label className="text-[8px] font-bold text-slate-400 uppercase">Valor/Descripción</label>
                                <input type="text" value={item.price || item.description} onChange={(e) => updateListItem(iIdx, item.price ? 'price' : 'description', e.target.value)} className="w-full bg-transparent border-none text-xs outline-none text-slate-500" />
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><Layers size={14} /> Capas Activas</h3>
                  <div className="space-y-2">
                    {pageData.sections.map((s, idx) => (
                      <button key={idx} onClick={() => setSelectedSectionIndex(idx)} className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group ${selectedSectionIndex === idx ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200'}`}>
                        <div className="flex items-center gap-4">
                          <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">{idx + 1}</span>
                          <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600">{s.type}</span>
                        </div>
                        <ChevronRight size={12} className="text-slate-300 group-hover:text-indigo-600" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-8 border-t border-slate-100 space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Añadir Componente</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['pitch', 'pricing', 'info', 'contact'].map(type => (
                      <button key={type} className="py-4 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center gap-2 group"><Plus size={10} className="group-hover:scale-125 transition-all" /> {type}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Live Canvas Area - SOLUCIONADO: Scroll y Ancho */}
        <main className="flex-1 overflow-auto bg-slate-950 flex flex-col items-center custom-scrollbar scroll-smooth p-10 lg:p-20">
          <div 
            className="w-full max-w-6xl transition-all duration-500 origin-top shadow-[0_80px_150px_-30px_rgba(0,0,0,0.5)] bg-white border border-white/5 relative"
            style={{ 
              transform: `scale(${zoom})`,
              marginBottom: `-${(1 - zoom) * 100}%` // Compensa el espacio del zoom para el scroll
            }}
          >
            {/* Browser Header Mockup */}
            <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-6 gap-2 shrink-0">
               <div className="w-2 h-2 rounded-full bg-red-400" />
               <div className="w-2 h-2 rounded-full bg-yellow-400" />
               <div className="w-2 h-2 rounded-full bg-green-400" />
               <div className="mx-auto bg-white border border-slate-200 px-6 py-0.5 rounded-full text-[9px] font-bold text-slate-300 italic flex items-center gap-2">
                  <Globe size={10} /> {tenant?.slug}.modular.com/{pageData.path}
               </div>
            </div>

            <div className="relative overflow-x-hidden min-h-screen">
              {activeTab === 'editor' ? (
                <>
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
                </>
              ) : (
                <div className="max-w-2xl mx-auto py-32 px-12 space-y-20 bg-white">
                   <div className="space-y-4">
                      <h3 className="text-5xl font-bold text-slate-900 tracking-tighter italic uppercase underline decoration-indigo-600 decoration-[10px] underline-offset-[-5px]">SEO & Social</h3>
                      <p className="text-slate-500 font-medium">Define cómo se verá tu página en los buscadores.</p>
                   </div>
                   <div className="space-y-12">
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
          </div>
        </main>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LandingEditor;