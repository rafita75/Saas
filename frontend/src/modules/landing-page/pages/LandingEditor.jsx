import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Layout, Globe, ChevronRight, Edit3, Plus, Trash2, X, Layers, Minimize2, Maximize2, PanelLeftClose, PanelLeftOpen, Eye } from 'lucide-react';
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
      setToast({ message: '¡Publicación exitosa!', type: 'success' });
      setTimeout(() => navigate(`/${tenant?.slug}/landings`), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Error al guardar', type: 'error' });
      setLoading(false);
    }
  };

  if (loading && isNew && pageData.sections.length === 0) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;

  if (isNew && pageData.sections.length === 0) return (
    <div className="min-h-screen bg-slate-950 p-8 lg:p-24 flex flex-col items-center justify-center space-y-20">
      <div className="text-center space-y-6">
        <h2 className="text-7xl lg:text-[6rem] font-black text-white italic uppercase tracking-tighter leading-none">Crea tu <span className="text-indigo-600 underline decoration-indigo-500/20 decoration-[20px] underline-offset-[-15px]">Landing</span></h2>
        <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto uppercase tracking-widest opacity-50">Selecciona una arquitectura base</p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {LANDING_TEMPLATES.map((t) => (
          <div key={t.id} className="group bg-white/[0.02] border border-white/[0.05] rounded-[3rem] overflow-hidden flex flex-col hover:border-indigo-500 transition-all cursor-pointer shadow-2xl" onClick={() => selectTemplate(t)}>
            <div className="aspect-[4/3] relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
               <img src={t.previewImage} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-transparent transition-all" />
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"><span className="px-10 py-4 bg-indigo-600 text-white font-black text-lg italic uppercase rounded-2xl shadow-2xl">Utilizar Diseño</span></div>
            </div>
            <div className="p-12 space-y-4 border-t border-white/[0.05]"><h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{t.name}</h3><p className="text-slate-500 text-sm leading-relaxed">{t.description}</p></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden font-sans antialiased">
      
      {/* Editor Header - Premium */}
      <header className="h-16 bg-slate-950 border-b border-white/[0.05] flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            className="p-2 text-slate-500 hover:text-white bg-white/[0.03] border border-white/5 rounded-xl transition-all"
            title="Contraer Menú"
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={18}/> : <PanelLeftClose size={18}/>}
          </button>
          <div className="h-6 w-px bg-white/10" />
          <button 
            onClick={() => navigate(`/${tenant?.slug}/landings`)}
            className="p-2 text-slate-400 hover:text-white bg-white/[0.03] border border-white/5 rounded-xl transition-all flex items-center gap-2 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Salir</span>
          </button>
          <div className="h-6 w-px bg-white/10" />
          <input 
            type="text" 
            value={pageData.name} 
            onChange={(e) => setPageData({...pageData, name: e.target.value})} 
            className="bg-transparent text-sm font-black text-white uppercase tracking-widest outline-none border-b border-transparent focus:border-indigo-500 w-64 ml-2" 
            placeholder="NOMBRE DE LA PÁGINA" 
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-black/40 p-1.5 rounded-xl border border-white/5 shadow-inner">
             <button onClick={() => setZoom(Math.max(0.2, zoom - 0.1))} className="p-1.5 text-slate-500 hover:text-white"><Minimize2 size={14}/></button>
             <span className="text-[10px] font-black text-slate-400 w-10 text-center tracking-tighter">{Math.round(zoom * 100)}%</span>
             <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} className="p-1.5 text-slate-500 hover:text-white"><Maximize2 size={14}/></button>
          </div>
          <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/5 shadow-inner">
            <button onClick={() => setActiveTab('editor')} className={`p-2 rounded-lg transition-all ${activeTab === 'editor' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-white'}`}><Layout size={18}/></button>
            <button onClick={() => setActiveTab('settings')} className={`p-2 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-white'}`}><Globe size={18}/></button>
          </div>
          <button 
            onClick={handleSave} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-500/20 transition-all active:scale-95"
          >
            Publicar Ahora
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar Inspector - Dark Theme Pro */}
        <aside className={`h-full bg-slate-950 border-r border-white/[0.05] flex flex-col shrink-0 overflow-y-auto custom-scrollbar transition-all duration-500 ease-in-out z-40 ${isSidebarCollapsed ? 'w-0 -translate-x-full opacity-0' : 'w-80 translate-x-0 opacity-100'}`}>
          <div className="p-6 space-y-10 min-w-[320px]">
            {selectedSectionIndex !== null ? (
              <div className="space-y-8 animate-in slide-in-from-left duration-500">
                <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600/10 rounded-lg"><Edit3 size={14} className="text-indigo-500" /></div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Inspector</h3>
                  </div>
                  <button onClick={() => setSelectedSectionIndex(null)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500"><X size={14} /></button>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => moveSection(selectedSectionIndex, -1)} className="flex-1 py-3 bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] rounded-xl text-slate-400 text-[9px] font-black uppercase tracking-widest transition-all">Subir</button>
                  <button onClick={() => moveSection(selectedSectionIndex, 1)} className="flex-1 py-3 bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] rounded-xl text-slate-400 text-[9px] font-black uppercase tracking-widest transition-all">Bajar</button>
                  <button onClick={() => deleteSection(selectedSectionIndex)} className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                </div>

                <div className="space-y-6">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-l-2 border-indigo-600 pl-3">Ajustes de Diseño</p>

                   {/* Selector de Layout - Solo si aplica (ej. Hero) */}
                   {pageData.sections[selectedSectionIndex].type === 'hero' && (
                     <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Disposición de Imagen</label>
                        <div className="grid grid-cols-3 gap-2">
                           {['reversed', 'split', 'centered'].map(l => (
                             <button 
                               key={l}
                               onClick={() => updateSectionContent('layout', l)}
                               className={`py-2 rounded-lg border text-[8px] font-black uppercase transition-all ${pageData.sections[selectedSectionIndex].content.layout === l ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}
                             >
                               {l === 'reversed' ? 'Izquierda' : l === 'split' ? 'Derecha' : 'Centro'}
                             </button>
                           ))}
                        </div>
                     </div>
                   )}

                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-l-2 border-indigo-600 pl-3">Contenido del Bloque</p>
                   {Object.entries(pageData.sections[selectedSectionIndex].content).map(([key, val]) => {
                     if (['items', 'stats', 'action', 'secondaryAction', 'layout', 'image'].includes(key)) return null;
                     return (
                       <div key={key} className="space-y-2 group">
                         <label className="text-[9px] font-black text-slate-500 uppercase tracking-tighter ml-1 group-hover:text-indigo-400 transition-colors">{key}</label>
                         {key.toLowerCase().includes('description') || key === 'text' ? 
                           <textarea value={val} onChange={(e) => updateSectionContent(key, e.target.value)} className="w-full bg-black/40 border border-white/[0.05] rounded-xl px-4 py-3 text-xs text-slate-300 outline-none h-32 resize-none focus:border-indigo-500/50 transition-all shadow-inner" /> : 
                           <input type="text" value={val} onChange={(e) => updateSectionContent(key, e.target.value)} className="w-full bg-black/40 border border-white/[0.05] rounded-xl px-4 py-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50 transition-all shadow-inner" />
                         }
                       </div>
                     );
                   })}

                   {pageData.sections[selectedSectionIndex].content.items && (
                     <div className="space-y-4 pt-4 border-t border-white/[0.05]">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-l-2 border-indigo-600 pl-3">Elementos Dinámicos</p>
                        {pageData.sections[selectedSectionIndex].content.items.map((item, iIdx) => (
                          <div key={iIdx} className="p-4 bg-black/40 border border-white/[0.05] rounded-2xl space-y-4 shadow-inner">
                             <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Identificador</label>
                                <input type="text" value={item.name || item.title} onChange={(e) => updateListItem(iIdx, item.name ? 'name' : 'title', e.target.value)} className="w-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-tighter outline-none text-white rounded-lg px-3 py-2" />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Descripción / Valor</label>
                                <textarea value={item.price || item.description} onChange={(e) => updateListItem(iIdx, item.price ? 'price' : 'description', e.target.value)} className="w-full bg-white/5 border border-white/5 text-xs outline-none text-slate-400 rounded-lg px-3 py-2 h-16 resize-none" />
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Identidad Visual Global */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/[0.05] pb-4">
                    <div className="p-2 bg-indigo-600/10 rounded-lg"><Palette size={14} className="text-indigo-500" /></div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Identidad Visual</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl group">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Primario</span>
                       <input type="color" value={pageData.theme?.primaryColor || '#4f46e5'} onChange={(e) => updateTheme('primaryColor', e.target.value)} className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl group">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Fondo</span>
                       <input type="color" value={pageData.theme?.backgroundColor || '#ffffff'} onChange={(e) => updateTheme('backgroundColor', e.target.value)} className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl group">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Texto</span>
                       <input type="color" value={pageData.theme?.textColor || '#0f172a'} onChange={(e) => updateTheme('textColor', e.target.value)} className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/[0.05] pb-4">
                    <div className="p-2 bg-indigo-600/10 rounded-lg"><Layers size={14} className="text-indigo-500" /></div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Estructura de Capas</h3>
                  </div>
                  <div className="space-y-2">
                    {pageData.sections.map((s, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setSelectedSectionIndex(idx)} 
                        className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${selectedSectionIndex === idx ? 'border-indigo-600 bg-indigo-600/10' : 'border-white/[0.03] bg-white/[0.01] hover:border-white/[0.08] hover:bg-white/[0.03]'}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${selectedSectionIndex === idx ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500 group-hover:text-white'}`}>{idx + 1}</span>
                          <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${selectedSectionIndex === idx ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{s.type}</span>
                        </div>
                        <ChevronRight size={14} className={`${selectedSectionIndex === idx ? 'text-indigo-600' : 'text-slate-700'} group-hover:translate-x-1 transition-all`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-8 border-t border-white/[0.05] space-y-4">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Añadir Componente</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['pitch', 'pricing', 'info', 'contact'].map(type => (
                      <button key={type} className="py-4 border border-white/[0.05] bg-white/[0.02] rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center gap-2 group"><Plus size={12} className="group-hover:rotate-90 transition-all" /> {type}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Live Canvas Area - RE-INGENIERÍA DE SCROLL Y ANCHO */}
        <main className="flex-1 overflow-auto bg-slate-950 custom-scrollbar scroll-smooth flex flex-col items-center">
          
          <div className="relative py-20 px-8 lg:px-20 min-w-max flex flex-col items-center">
            
            <div 
              className="bg-white shadow-[0_100px_200px_-50px_rgba(0,0,0,0.8)] rounded-[3rem] overflow-hidden border border-white/[0.05] relative origin-top transition-all duration-700 ease-out"
              style={{ 
                transform: `scale(${zoom})`,
                width: '1280px',
                // Compensación de altura dinámica para permitir scroll total
                marginBottom: `calc(1280px * (1 - ${zoom}) * -0.5)`
              }}
            >
              {/* Browser Header Mockup */}
              <div className="h-12 bg-slate-100 border-b border-slate-200 flex items-center px-8 gap-3 shrink-0">
                 <div className="flex gap-2">
                   <div className="w-3.5 h-3.5 rounded-full bg-red-400/80 shadow-inner" />
                   <div className="w-3.5 h-3.5 rounded-full bg-yellow-400/80 shadow-inner" />
                   <div className="w-3.5 h-3.5 rounded-full bg-green-400/80 shadow-inner" />
                 </div>
                 <div className="mx-auto bg-white border border-slate-200 px-8 py-1.5 rounded-full text-[10px] font-black text-slate-400 italic tracking-widest flex items-center gap-3">
                    <Globe size={14} className="text-indigo-400" /> {tenant?.slug}.modularbusiness.com/{pageData.path}
                 </div>
                 <div className="w-20" /> {/* Spacer balance */}
              </div>

              {/* Render real de la página */}
              <div className="relative bg-white min-h-screen">
                {activeTab === 'editor' ? (
                  <div className="flex flex-col">
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
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto py-40 px-20 space-y-32 bg-white">
                     <div className="space-y-6">
                        <h3 className="text-8xl font-black text-slate-900 tracking-tighter uppercase italic leading-none border-l-[20px] border-indigo-600 pl-10">SEO<br/><span className="text-indigo-600">&Social</span></h3>
                        <p className="text-slate-500 text-xl font-medium tracking-wide max-w-xl">Optimiza tu presencia en los motores de búsqueda y redes sociales para maximizar la conversión.</p>
                     </div>
                     <div className="space-y-16">
                        <div className="space-y-4">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-6">Título de la Página</label>
                           <input type="text" value={pageData.seo.title} onChange={(e) => setPageData({...pageData, seo: {...pageData.seo, title: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-[3rem] px-10 py-8 text-3xl font-black text-slate-900 outline-none focus:ring-[15px] focus:ring-indigo-600/5 transition-all shadow-inner" placeholder="Escribe un título impactante..." />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-6">Meta Descripción</label>
                           <textarea value={pageData.seo.description} onChange={(e) => setPageData({...pageData, seo: {...pageData.seo, description: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-[3rem] px-10 py-8 text-xl font-bold text-slate-600 h-64 outline-none resize-none focus:ring-[15px] focus:ring-indigo-600/5 transition-all shadow-inner" placeholder="Resume de qué trata tu landing..." />
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Spacing para scroll cómodo */}
            <div className="h-40 w-full" />

          </div>
        </main>

        {/* Floating Quick Actions */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-4 z-50">
           <button className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 hover:scale-110 transition-all active:scale-95 group">
              <Eye size={24} />
              <span className="absolute right-full mr-4 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Vista Previa Real</span>
           </button>
        </div>

      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LandingEditor;