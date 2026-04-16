import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Layout, Globe, ChevronRight, Edit3, Plus, Trash2, X, Layers, Minimize2, Maximize2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
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
  const [zoom, setZoom] = useState(0.7);
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
      setToast({ message: '¡Landing publicada con éxito!', type: 'success' });
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
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden font-sans antialiased">
      
      {/* Top Header - Super Slim */}
      <header className="h-14 bg-slate-950 border-b border-white/5 flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 text-slate-400 hover:text-white transition-all">
            {isSidebarCollapsed ? <PanelLeftOpen size={20}/> : <PanelLeftClose size={20}/>}
          </button>
          <div className="h-6 w-px bg-white/10" />
          <input 
            type="text" 
            value={pageData.name} 
            onChange={(e) => setPageData({...pageData, name: e.target.value})} 
            className="bg-transparent text-xs font-bold text-white outline-none border-b border-transparent focus:border-indigo-500 w-48 ml-2" 
            placeholder="Nombre de la página" 
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
             <button onClick={() => setZoom(Math.max(0.2, zoom - 0.1))} className="p-1 text-slate-500 hover:text-white"><Minimize2 size={12}/></button>
             <span className="text-[9px] font-black text-slate-500 w-8 text-center">{Math.round(zoom * 100)}%</span>
             <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} className="p-1 text-slate-500 hover:text-white"><Maximize2 size={12}/></button>
          </div>
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
            <button onClick={() => setActiveTab('editor')} className={`p-1.5 rounded-md transition-all ${activeTab === 'editor' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}><Layout size={16}/></button>
            <button onClick={() => setActiveTab('settings')} className={`p-1.5 rounded-md transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}><Globe size={16}/></button>
          </div>
          <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-black text-[9px] uppercase shadow-lg transition-all active:scale-95">Publicar</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar Inspector - Toggleable */}
        <aside className={`absolute lg:relative h-full bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out z-40 ${isSidebarCollapsed ? 'w-0 -translate-x-full' : 'w-80 translate-x-0'}`}>
          <div className="p-6 space-y-10 min-w-[320px]">
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
                   <p className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 pb-2">Contenido</p>
                   {Object.entries(pageData.sections[selectedSectionIndex].content).map(([key, val]) => {
                     if (['items', 'stats', 'action', 'secondaryAction', 'layout', 'image'].includes(key)) return null;
                     return (
                       <div key={key} className="space-y-2">
                         <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">{key}</label>
                         {key.toLowerCase().includes('description') || key === 'text' ? 
                           <textarea value={val} onChange={(e) => updateSectionContent(key, e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 outline-none h-24 resize-none focus:border-indigo-600 transition-all shadow-inner" /> : 
                           <input type="text" value={val} onChange={(e) => updateSectionContent(key, e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 outline-none focus:border-indigo-600 transition-all shadow-inner" />
                         }
                       </div>
                     );
                   })}
                   {pageData.sections[selectedSectionIndex].content.items && (
                     <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 pb-2">Lista de Elementos</p>
                        {pageData.sections[selectedSectionIndex].content.items.map((item, iIdx) => (
                          <div key={iIdx} className="p-4 bg-slate-50 rounded-2xl space-y-3 border border-slate-100">
                             <input type="text" value={item.name || item.title} onChange={(e) => updateListItem(iIdx, item.name ? 'name' : 'title', e.target.value)} className="w-full bg-white border-none text-[10px] font-bold uppercase outline-none text-slate-900 rounded-lg px-2 py-1" />
                             <input type="text" value={item.price || item.description} onChange={(e) => updateListItem(iIdx, item.price ? 'price' : 'description', e.target.value)} className="w-full bg-white border-none text-xs outline-none text-slate-500 rounded-lg px-2 py-1" />
                          </div>
                        ))}
                     </div>
                   )}
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><Layers size={14} /> Estructura</h3>
                  <div className="space-y-2">
                    {pageData.sections.map((s, idx) => (
                      <button key={idx} onClick={() => setSelectedSectionIndex(idx)} className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group ${selectedSectionIndex === idx ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200'}`}>
                        <div className="flex items-center gap-4">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">{idx + 1}</span>
                          <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600">{s.type}</span>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-8 border-t border-slate-100 space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Añadir</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['pitch', 'pricing', 'info', 'contact'].map(type => (
                      <button key={type} className="py-4 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center gap-2"><Plus size={10} /> {type}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Live Canvas Area - SOLUCIONADO TOTAL: Scroll infinito y Ancho perfecto */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-900 custom-scrollbar scroll-smooth p-4 lg:p-12">
          
          {/* Contenedor que maneja la altura real tras el escalado */}
          <div className="flex flex-col items-center min-w-max">
            
            <div 
              className="bg-white shadow-[0_80px_150px_-30px_rgba(0,0,0,0.8)] rounded-[3rem] overflow-hidden border border-white/5 relative origin-top transition-all duration-500"
              style={{ 
                transform: `scale(${zoom})`,
                width: '1280px', // Desktop standard interno inmutable
                marginBottom: `calc(1280px * ${pageData.sections.length} * (1 - ${zoom}) * -0.1)` // Compensación dinámica básica
              }}
            >
              {/* Browser Mockup */}
              <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-6 gap-2 shrink-0">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm" />
                   <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm" />
                   <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm" />
                 </div>
                 <div className="mx-auto bg-white border border-slate-200 px-6 py-1 rounded-full text-[10px] font-bold text-slate-400 italic flex items-center gap-2">
                    <Globe size={12} /> {tenant?.slug}.modular.com/{pageData.path}
                 </div>
              </div>

              {/* Render real de la página */}
              <div className="relative bg-white min-h-screen">
                {activeTab === 'editor' ? (
                  <>
                    <ModularNav tenant={tenant} isEditor={true} />
                    <div className="flex flex-col">
                      {pageData.sections.map((s, idx) => (
                        <TemplateRenderer 
                          key={s.id || idx} 
                          templateId={pageData.templateId} 
                          section={s} 
                          idx={idx} 
                          isPreview={true} 
                          isSelected={selectedSectionIndex === idx} 
                          onSectionClick={setSelectedSectionIndex} 
                          theme={pageData.theme} 
                        />
                      ))}
                    </div>
                    <ModularFooter tenant={tenant} />
                  </>
                ) : (
                  <div className="max-w-2xl mx-auto py-32 px-12 space-y-20 bg-white">
                     <h3 className="text-6xl font-black text-slate-900 uppercase">Ajustes SEO</h3>
                     {/* SEO Content Omitted */}
                  </div>
                )}
              </div>
            </div>

            {/* Espaciador invisible para forzar el scroll del contenedor padre */}
            <div style={{ height: '100px' }} />

          </div>
        </main>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LandingEditor;