import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Layout, Settings, Eye, Check, ChevronRight, Type, Edit3, Globe, Plus, Trash2, Smartphone, Monitor, X, Palette, List, Layers, Minimize2, Maximize2 } from 'lucide-react';
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
  const [zoom, setZoom] = useState(0.8);

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
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden font-sans selection:bg-indigo-600/20 antialiased">
      
      {/* Top Header - Más compacto y elegante */}
      <header className="h-16 bg-slate-900 border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(`/${tenant?.slug}/landings`)} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 transition-all"><ArrowLeft size={18} /></button>
          <div className="flex flex-col">
            <input 
              type="text" 
              value={pageData.name} 
              onChange={(e) => setPageData({...pageData, name: e.target.value})} 
              className="bg-transparent text-sm font-bold text-white outline-none border-b border-transparent focus:border-indigo-500/50 w-64" 
              placeholder="Nombre de la página" 
            />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{pageData.templateId} / BUILDER</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-black/20 p-1 rounded-xl mr-4 border border-white/5">
             <button onClick={() => setZoom(Math.max(0.4, zoom - 0.1))} className="p-1.5 text-slate-400 hover:text-white"><Minimize2 size={12}/></button>
             <span className="text-[10px] font-black text-slate-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
             <button onClick={() => setZoom(Math.min(1, zoom + 0.1))} className="p-1.5 text-slate-400 hover:text-white"><Maximize2 size={12}/></button>
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            <button onClick={() => setActiveTab('editor')} className={`p-2 rounded-lg transition-all ${activeTab === 'editor' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-white/5'}`}><Layout size={18}/></button>
            <button onClick={() => setActiveTab('settings')} className={`p-2 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-white/5'}`}><Globe size={18}/></button>
          </div>
          <button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase shadow-xl transition-all active:scale-95 ml-2">Publicar</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Inspector - Estilizado */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar shadow-2xl z-40">
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
                      <button 
                        key={idx} 
                        onClick={() => setSelectedSectionIndex(idx)} 
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group ${selectedSectionIndex === idx ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200'}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">{idx + 1}</span>
                          <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600">{s.type}</span>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600" />
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

        {/* Live Canvas Area - Escalado inteligente */}
        <main className="flex-1 overflow-auto bg-slate-200/40 flex flex-col items-center py-12 px-6 custom-scrollbar scroll-smooth relative">
          
          <div 
            className="w-full max-w-7xl transition-all duration-700 origin-top shadow-[0_60px_100px_-30px_rgba(0,0,0,0.25)] rounded-[3rem] overflow-hidden bg-white border border-slate-300 relative"
            style={{ transform: `scale(${zoom})`, marginBottom: `${(1 - zoom) * -100}%` }}
          >
            {/* Browser Header Mockup */}
            <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-6 gap-2 shrink-0">
               <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
               <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
               <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
               <div className="mx-auto bg-white border border-slate-200 px-6 py-0.5 rounded-full text-[9px] font-bold text-slate-300 italic flex items-center gap-2">
                  <Globe size={10} /> {tenant?.slug}.modular.com/{pageData.path}
               </div>
            </div>

            <div className="relative min-h-[1200px] overflow-x-hidden">
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
                      <h3 className="text-6xl font-black text-slate-900 italic uppercase tracking-tighter">SEO & Social</h3>
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