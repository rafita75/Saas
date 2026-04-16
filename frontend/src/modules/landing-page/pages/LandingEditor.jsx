import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Layout, Settings, Eye, Check, ChevronRight, Type, Edit3, Globe, Plus, Trash2, Smartphone, Monitor, X } from 'lucide-react';
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
  const [pageData, setPageData] = useState({ name: '', path: '', sections: [], theme: {}, seo: { title: '', description: '' } });

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

  const updateAction = (field, value) => {
    if (selectedSectionIndex === null) return;
    const newSections = [...pageData.sections];
    const currentAction = newSections[selectedSectionIndex].content.action || { type: 'link', value: '' };
    newSections[selectedSectionIndex].content.action = { ...currentAction, [field]: value };
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
    if (subscription?.planId?.slug === 'gratis' && pageData.sections.length >= 6) return setToast({ message: 'Límite Plan Gratis alcanzado.', type: 'warning' });
    const defaults = {
      hero: { layout: 'split', title: 'Nuevo Título', description: 'Nueva descripción', ctaText: 'Botón', image: '', action: { type: 'link', value: '#' } },
      features: { title: 'Características', items: [{ title: 'Item 1', description: 'Desc...' }] },
      contact: { title: 'Contacto', description: 'Escríbenos', email: 'info@negocio.com' },
      cta: { title: 'Llamada', description: 'Únete hoy', buttonText: 'Click aquí', action: { type: 'link', value: '#' } },
      testimonials: { title: 'Opiniones', items: [{ title: 'Cliente', description: 'Excelente' }] }
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
    <div className="min-h-screen bg-dark-950 p-8 space-y-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h2 className="text-4xl lg:text-6xl font-black text-white italic uppercase tracking-tighter">Selecciona <span className="text-primary">Diseño</span></h2>
        <Link to={`/${tenant?.slug}/landings`} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400"><X size={24} /></Link>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {LANDING_TEMPLATES.map((t) => (
          <div key={t.id} className="group glass rounded-[48px] border border-white/5 overflow-hidden flex flex-col hover:border-primary/5 transition-all cursor-pointer shadow-2xl" onClick={() => selectTemplate(t)}>
            <div className="aspect-[4/3] bg-dark-800 flex items-center justify-center relative">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-30" />
               <div className="absolute inset-0 bg-dark-950/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center p-8 backdrop-blur-sm"><span className="text-white font-black text-xl italic uppercase">Seleccionar</span></div>
            </div>
            <div className="p-10 space-y-4"><h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{t.name}</h3><p className="text-slate-400 text-sm leading-relaxed">{t.description}</p></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 animate-fade-in font-sans selection:bg-primary/30 antialiased">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-6">
          <button onClick={() => isNew ? setPageData({...pageData, sections: []}) : navigate(`/${tenant?.slug}/landings`)} className="p-3 bg-dark-800 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all shadow-xl"><ArrowLeft size={24} /></button>
          <div><input type="text" value={pageData.name} onChange={(e) => setPageData({...pageData, name: e.target.value})} className="bg-transparent text-2xl font-black text-white outline-none border-b-2 border-transparent focus:border-primary/50" placeholder="Nombre..." /></div>
        </div>
        <div className="flex gap-4">
          <div className="hidden lg:flex bg-dark-900/50 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
            {[{ id: 'editor', label: 'Editor', icon: Layout }, { id: 'settings', label: 'SEO', icon: Globe }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-200'}`}><tab.icon size={14} /> {tab.label}</button>
            ))}
          </div>
          <button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-[22px] font-black uppercase shadow-2xl active:scale-95 transition-all"><Save size={20} /></button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 overflow-hidden">
        <div className="lg:col-span-1 glass rounded-[48px] border border-white/5 p-8 flex flex-col gap-8 overflow-y-auto shadow-2xl bg-dark-950/40">
          <div className="space-y-10">
            {selectedSectionIndex !== null ? (
              <div className="space-y-8 animate-in slide-in-from-left">
                <div className="flex items-center justify-between"><h3 className="text-xs font-black text-white uppercase flex items-center gap-3"><Edit3 size={16} className="text-primary" /> Editando</h3><button onClick={() => setSelectedSectionIndex(null)} className="text-slate-500 hover:text-white text-[10px] font-black uppercase">Cerrar</button></div>
                <div className="grid grid-cols-2 gap-3"><button onClick={() => moveSection(selectedSectionIndex, -1)} disabled={selectedSectionIndex === 0} className="py-3 bg-dark-800 border border-white/5 rounded-2xl text-slate-400 disabled:opacity-20 text-[10px] font-black uppercase italic text-center">Subir</button><button onClick={() => moveSection(selectedSectionIndex, 1)} disabled={selectedSectionIndex === pageData.sections.length - 1} className="py-3 bg-dark-800 border border-white/5 rounded-2xl text-slate-400 disabled:opacity-20 text-[10px] font-black uppercase italic text-center">Bajar</button><button onClick={() => deleteSection(selectedSectionIndex)} className="col-span-2 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase text-center">Eliminar</button></div>
                <div className="space-y-6">
                  {Object.keys(pageData.sections[selectedSectionIndex].content).map((key) => {
                    if (['items', 'ctaText', 'buttonText', 'action', 'layout', 'badge'].includes(key)) return null;
                    const val = pageData.sections[selectedSectionIndex].content[key];
                    return (<div key={key} className="space-y-2"><label className="text-[10px] font-black text-slate-600 uppercase ml-2">{key}</label>{key.toLowerCase().includes('description') ? <textarea value={val} onChange={(e) => updateSectionContent(key, e.target.value)} className="w-full bg-dark-800 border border-slate-700 rounded-3xl px-5 py-4 text-sm text-slate-300 outline-none h-40 resize-none transition-all" /> : <input type="text" value={val} onChange={(e) => updateSectionContent(key, e.target.value)} className="w-full bg-dark-800 border border-slate-700 rounded-[20px] px-5 py-4 text-sm text-slate-300 outline-none" />}</div>);
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="space-y-6"><h3 className="text-xs font-black text-slate-500 uppercase flex items-center gap-3"><Layout size={16} /> Estructura</h3><div className="space-y-3">{pageData.sections.map((s, idx) => (<button key={idx} onClick={() => setSelectedSectionIndex(idx)} className="w-full p-5 bg-dark-800 border border-white/5 rounded-[24px] text-sm text-slate-400 flex items-center justify-between hover:text-white hover:border-primary/40 transition-all group"><span className="capitalize font-bold italic">{s.type}</span><ChevronRight size={18} /></button>))}</div></div>
                <div className="pt-10 border-t border-white/5 space-y-6 text-center"><h3 className="text-xs font-black text-slate-500 uppercase italic">Añadir Bloque</h3><div className="grid grid-cols-2 gap-4">{['cta', 'testimonials', 'features', 'contact'].map(type => (<button key={type} onClick={() => addExtraSection(type)} className="p-4 bg-dark-800 border border-white/5 rounded-[20px] text-[10px] font-black uppercase text-slate-500 hover:text-white shadow-xl">+ {type}</button>))}</div></div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 glass rounded-[48px] border border-white/5 bg-dark-900/30 overflow-y-auto relative shadow-inner antialiased p-8 lg:p-20">
          {activeTab === 'editor' && pageData.sections.map((s, idx) => (
            <SectionRenderer key={idx} section={s} idx={idx} isPreview={true} isSelected={selectedSectionIndex === idx} onSectionClick={setSelectedSectionIndex} />
          ))}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto py-20 px-8 space-y-16">
              <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter">SEO</h3>
              <div className="space-y-10">
                <div className="space-y-3"><label className="text-[10px] font-black text-slate-600 uppercase ml-2">Título</label><input type="text" value={pageData.seo.title} onChange={(e) => setPageData({...pageData, seo: {...pageData.seo, title: e.target.value}})} className="w-full bg-dark-800 border border-slate-700 rounded-[30px] px-8 py-6 text-xl font-bold text-white outline-none" /></div>
                <div className="space-y-3"><label className="text-[10px] font-black text-slate-600 uppercase ml-2">Descripción</label><textarea value={pageData.seo.description} onChange={(e) => setPageData({...pageData, seo: {...pageData.seo, description: e.target.value}})} className="w-full bg-dark-800 border border-slate-700 rounded-[30px] px-8 py-6 text-lg text-slate-400 h-60 outline-none resize-none" /></div>
              </div>
            </div>
          )}
        </div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LandingEditor;