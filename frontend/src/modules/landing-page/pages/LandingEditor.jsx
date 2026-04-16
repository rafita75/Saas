import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Layout, Settings, Eye, Check, ChevronRight, Type, Edit3, Globe, Plus, Trash2, Smartphone, Monitor, X, Palette, List } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../core/auth/context/AuthContext'; 
import api from '../../../lib/api'; 
import { LANDING_TEMPLATES } from '../config/templates.config';
import Toast from '../../../shared/components/Toast'; 
import { SectionRenderer } from '../../../core/landing/pages/PublicLanding'; 

const LandingEditor = () => {
  const { tenant } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('editor');
  const [subscription, setSubscription] = useState(null);
  const [isNew, setIsNew] = useState(!id);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
  const [toast, setToast] = useState(null);
  const [pageData, setPageData] = useState({ name: '', path: '', sections: [], theme: { darkMode: false }, seo: { title: '', description: '' } });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const subRes = await api.get('/modules/tenant/me');
        const landingSub = subRes.data.modules.find(m => m.moduleId.slug === 'landing-page');
        setSubscription(landingSub);
        if (id) {
          const pageRes = await api.get(`/landings/${id}`);
          if (pageRes.data.success) {
            setPageData({ ...pageRes.data.landing, sections: pageRes.data.landing.sections || [] });
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
      setToast({ message: '¡Guardado con éxito!', type: 'success' });
      setTimeout(() => navigate(`/${tenant?.slug}/landings`), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Error al guardar', type: 'error' });
      setLoading(false);
    }
  };

  const updateSectionContent = (field, value) => {
    if (selectedSectionIndex === null) return;
    const newSections = [...pageData.sections];
    newSections[selectedSectionIndex].content[field] = value;
    setPageData({ ...pageData, sections: newSections });
  };

  const moveSection = (index, dir) => {
    const newSections = [...pageData.sections];
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= newSections.length) return;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    setPageData({ ...pageData, sections: newSections });
    setSelectedSectionIndex(newIndex);
  };

  const addExtraSection = (type) => {
    if (subscription?.planId?.slug === 'gratis' && pageData.sections.length >= 8) return setToast({ message: 'Límite Plan Gratis alcanzado.', type: 'warning' });
    const defaults = {
      hero: { layout: 'split', title: 'Nuevo Título', description: 'Nueva descripción', ctaText: 'Botón', image: '', action: { type: 'link', value: '#' } },
      features: { title: 'Características', items: [{ title: 'Item 1', description: 'Desc...' }] },
      contact: { layout: 'split', title: 'Contacto', description: 'Escríbenos', email: 'info@negocio.com' },
      pricing: { title: 'Precios', items: [{ name: 'Plan', price: '0', features: ['Feature 1'] }] },
      info: { title: 'Información', description: 'Detalle de valor', stats: [{ label: 'Stat', value: '100%' }] }
    };
    setPageData({ ...pageData, sections: [...pageData.sections, { id: `${type}-${Date.now()}`, type, content: defaults[type] || {}, order: pageData.sections.length }] });
  };

  const deleteSection = (index) => {
    if (subscription?.planId?.slug === 'gratis' && pageData.sections.length <= 4) return setToast({ message: 'Bloques base protegidos.', type: 'warning' });
    setPageData({ ...pageData, sections: pageData.sections.filter((_, i) => i !== index) });
    setSelectedSectionIndex(null);
  };

  if (loading && isNew && pageData.sections.length === 0) return <div className="min-h-screen flex items-center justify-center bg-dark-950"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

  if (isNew && pageData.sections.length === 0) return (
    <div className="min-h-screen bg-dark-950 p-8 lg:p-20 flex flex-col items-center justify-center space-y-20">
      <div className="text-center space-y-6">
        <h2 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none">Elige tu <span className="text-primary underline decoration-white/10 decoration-[20px] underline-offset-[-15px]">Lienzo</span></h2>
        <p className="text-slate-500 text-xl font-medium">Selecciona una base para empezar a construir tu presencia digital.</p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {LANDING_TEMPLATES.map((t) => (
          <div key={t.id} className="group glass rounded-[4rem] border border-white/5 overflow-hidden flex flex-col hover:border-primary/20 transition-all cursor-pointer shadow-3xl hover:-translate-y-4" onClick={() => selectTemplate(t)}>
            <div className="aspect-square md:aspect-[4/3] bg-dark-800 relative">
               <img src={t.previewImage} alt={t.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
               <div className="absolute inset-0 bg-dark-950/40 group-hover:bg-transparent transition-all" />
               <div className="absolute inset-0 flex items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"><span className="px-10 py-4 bg-primary text-white font-black text-lg italic uppercase rounded-2xl shadow-2xl">Empezar con este</span></div>
            </div>
            <div className="p-12 space-y-4 bg-dark-900/50"><h3 className="text-3xl font-black text-white italic uppercase tracking-tight">{t.name}</h3><p className="text-slate-400 text-base leading-relaxed">{t.description}</p></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden font-sans selection:bg-primary/30 antialiased">
      {/* Top Bar */}
      <div className="h-24 bg-dark-950 border-b border-white/5 flex items-center justify-between px-10 shrink-0">
        <div className="flex items-center gap-8">
          <button onClick={() => navigate(`/${tenant?.slug}/landings`)} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all"><ArrowLeft size={20} /></button>
          <div className="space-y-1">
            <input type="text" value={pageData.name} onChange={(e) => setPageData({...pageData, name: e.target.value})} className="bg-transparent text-xl font-black text-white outline-none border-b border-transparent focus:border-primary/50" placeholder="Nombre de la página" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{tenant?.name} / EDITOR</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="bg-white/5 p-1 rounded-2xl flex border border-white/10">
            {[{ id: 'editor', label: 'Constructor', icon: Layout }, { id: 'settings', label: 'SEO', icon: Globe }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-200'}`}><tab.icon size={14} /> {tab.label}</button>
            ))}
          </div>
          <button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 shadow-2xl transition-all"><Save size={18} /> Guardar</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-96 bg-dark-950 border-r border-white/5 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          <div className="p-8 space-y-12">
            {selectedSectionIndex !== null ? (
              <div className="space-y-10 animate-in slide-in-from-left">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-3"><Edit3 size={14} className="text-primary" /> Editar Bloque</h3>
                  <button onClick={() => setSelectedSectionIndex(null)} className="text-slate-500 hover:text-white p-2 bg-white/5 rounded-lg"><X size={16} /></button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pb-8 border-b border-white/5">
                  <button onClick={() => moveSection(selectedSectionIndex, -1)} className="py-3 bg-white/5 rounded-xl text-slate-400 text-[10px] font-black uppercase hover:text-white transition-all">Subir</button>
                  <button onClick={() => moveSection(selectedSectionIndex, 1)} className="py-3 bg-white/5 rounded-xl text-slate-400 text-[10px] font-black uppercase hover:text-white transition-all">Bajar</button>
                </div>

                <div className="space-y-8">
                  {Object.entries(pageData.sections[selectedSectionIndex].content).map(([key, val]) => {
                    if (['items', 'stats', 'action', 'secondaryAction', 'layout'].includes(key)) return null;
                    return (
                      <div key={key} className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">{key}</label>
                        {key.toLowerCase().includes('description') ? 
                          <textarea value={val} onChange={(e) => updateSectionContent(key, e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-slate-300 outline-none h-40 resize-none focus:border-primary/50 transition-all" /> : 
                          <input type="text" value={val} onChange={(e) => updateSectionContent(key, e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-slate-300 outline-none focus:border-primary/50 transition-all" />
                        }
                      </div>
                    );
                  })}
                </div>
                
                <button onClick={() => deleteSection(selectedSectionIndex)} className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Eliminar Sección</button>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3"><List size={14} /> Capas de la Página</h3>
                  <div className="space-y-3">
                    {pageData.sections.map((s, idx) => (
                      <button key={idx} onClick={() => setSelectedSectionIndex(idx)} className="w-full p-6 bg-white/5 border border-white/5 rounded-2xl text-left hover:border-primary/40 transition-all group flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">{idx + 1}</span>
                          <span className="text-sm font-bold text-slate-400 group-hover:text-white uppercase tracking-tighter italic">{s.type}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-600 group-hover:text-primary transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5 space-y-6">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase italic text-center">Añadir Componente</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['cta', 'testimonials', 'features', 'pricing', 'info', 'contact'].map(type => (
                      <button key={type} onClick={() => addExtraSection(type)} className="py-4 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-white hover:bg-primary/20 hover:border-primary/30 transition-all flex items-center justify-center gap-2 group"><Plus size={12} className="group-hover:scale-125 transition-all" /> {type}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Canvas */}
        <div className={`flex-1 overflow-y-auto bg-slate-100 p-12 lg:p-24 ${pageData.theme?.darkMode ? 'dark bg-dark-950' : ''}`}>
          <div className={`mx-auto shadow-[0_100px_150px_-50px_rgba(0,0,0,0.3)] bg-white overflow-hidden ring-1 ring-black/5 ${pageData.theme?.darkMode ? 'bg-dark-950 ring-white/5' : ''}`}>
            {activeTab === 'editor' && pageData.sections.map((s, idx) => (
              <SectionRenderer key={idx} section={s} idx={idx} isPreview={true} isSelected={selectedSectionIndex === idx} onSectionClick={setSelectedSectionIndex} theme={pageData.theme} />
            ))}
            
            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto py-32 px-12 space-y-20 bg-white min-h-screen">
                <div className="space-y-4">
                   <h3 className="text-6xl font-black text-slate-900 italic uppercase tracking-tighter">SEO & Social</h3>
                   <p className="text-slate-500 font-medium">Configura cómo se verá tu página en Google y redes sociales.</p>
                </div>
                <div className="space-y-12">
                  <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase ml-4">Título de la pestaña</label><input type="text" value={pageData.seo.title} onChange={(e) => setPageData({...pageData, seo: {...pageData.seo, title: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-[30px] px-8 py-6 text-xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/5 transition-all" /></div>
                  <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase ml-4">Descripción (Meta)</label><textarea value={pageData.seo.description} onChange={(e) => setPageData({...pageData, seo: {...pageData.seo, description: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-[30px] px-8 py-6 text-lg text-slate-600 h-60 outline-none resize-none focus:ring-4 focus:ring-primary/5 transition-all" /></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LandingEditor;