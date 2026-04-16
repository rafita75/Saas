import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Layout, Settings, Eye, Check, ChevronRight, Type, Edit3, Globe, Plus, MousePointer2 } from 'lucide-react';
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
  
  const [pageData, setPageData] = useState({
    name: '',
    path: '',
    sections: [],
    theme: {},
    seo: { title: '', description: '' }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subRes = await api.get('/modules/tenant/me');
        const landingSub = subRes.data.modules.find(m => m.moduleId.slug === 'landing-page');
        setSubscription(landingSub);

        if (id) {
          const pageRes = await api.get(`/landings/${id}`);
          if (pageRes.data.success) {
            const landing = pageRes.data.landing;
            setPageData({
              ...landing,
              sections: landing.sections || [],
              seo: landing.seo || { title: '', description: '' }
            });
            setIsNew(false);
          }
        }
      } catch (err) {
        setToast({ message: 'Error al cargar los datos', type: 'error' });
        setTimeout(() => navigate(`/${tenant?.slug}/landings`), 2000);
      } finally {
        setLoading(false);
      }
    };
    if (tenant?.slug) fetchData();
  }, [id, tenant?.slug, navigate]);

  const selectTemplate = (template) => {
    setPageData({
      ...pageData,
      name: `Página ${template.name}`,
      path: '', 
      sections: template.sections.map(s => ({ ...s, content: { ...s.content } })),
      theme: template.theme,
      templateId: template.id
    });
  };

  const handleSave = async () => {
    if (!pageData.name) {
      setToast({ message: 'El nombre de la página es obligatorio', type: 'warning' });
      return;
    }

    try {
      setLoading(true);
      if (isNew) {
        await api.post('/landings', pageData);
        setToast({ message: 'Página publicada con éxito', type: 'success' });
      } else {
        await api.put(`/landings/${id}`, pageData);
        setToast({ message: 'Cambios guardados', type: 'success' });
      }
      setTimeout(() => navigate(`/${tenant?.slug}/landings`), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Error al guardar', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const updateSectionContent = (field, value) => {
    if (selectedSectionIndex === null) return;
    const newSections = [...pageData.sections];
    newSections[selectedSectionIndex].content[field] = value;
    setPageData({ ...pageData, sections: newSections });
  };

  const moveSection = (index, direction) => {
    const newSections = [...pageData.sections];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newSections.length) return;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    newSections.forEach((s, i) => s.order = i);
    setPageData({ ...pageData, sections: newSections });
    setSelectedSectionIndex(newIndex);
  };

  const addExtraSection = (type) => {
    if (subscription?.planId?.slug === 'gratis' && pageData.sections.length >= 4) {
      setToast({ message: 'Límite alcanzado. Mejora al Plan Pro para más bloques.', type: 'warning' });
      return;
    }

    const defaultContent = {
      hero: { layout: 'split', title: 'Nuevo Título', description: 'Nueva descripción', ctaText: 'Botón', image: '' },
      features: { title: 'Características', items: [{ title: 'Item 1', description: 'Desc...' }] },
      contact: { title: 'Contacto', description: 'Escríbenos', email: 'test@mail.com' },
      cta: { title: 'Llamada a la acción', description: 'Únete hoy', buttonText: 'Click aquí' },
      testimonials: { title: 'Opiniones', items: [{ title: 'Cliente', description: 'Muy bueno' }] }
    };

    const newSection = {
      id: `extra-${Date.now()}`,
      type: type,
      content: defaultContent[type] || {},
      order: pageData.sections.length
    };

    setPageData({ ...pageData, sections: [...pageData.sections, newSection] });
    setToast({ message: 'Sección añadida.', type: 'success' });
  };

  if (loading && !pageData.name && isNew) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isNew && pageData.sections.length === 0) {
    return (
      <div className="space-y-12 animate-fade-in p-8">
        <div className="flex items-center gap-4">
          <Link to={`/${tenant?.slug}/landings`} className="p-2 bg-dark-800 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><ArrowLeft size={20} /></Link>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Nueva Página</h2>
            <p className="text-slate-500">Selecciona una plantilla para comenzar.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LANDING_TEMPLATES.map((template) => (
            <div key={template.id} className="glass rounded-[40px] border border-white/5 overflow-hidden group hover:border-primary/50 transition-all flex flex-col">
              <div className="aspect-video bg-dark-800 relative flex items-center justify-center">
                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                   {/* Aquí simulamos una miniatura basada en el layout del hero */}
                   <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                      <Layout size={48} className="text-white/20" />
                   </div>
                </div>
                <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                  <button onClick={() => selectTemplate(template)} className="bg-primary text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all">Usar Plantilla <ChevronRight size={18} /></button>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{template.name}</h3>
                  <span className="bg-primary/10 text-primary text-[10px] px-3 py-1 rounded-full font-black uppercase border border-primary/20">Gratis</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isFreePlan = subscription?.planId?.slug === 'gratis';
  const selectedSection = selectedSectionIndex !== null ? pageData.sections[selectedSectionIndex] : null;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => isNew ? setPageData({...pageData, sections: []}) : navigate(`/${tenant?.slug}/landings`)} className="p-2 bg-dark-800 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><ArrowLeft size={20} /></button>
          <div>
            <input type="text" value={pageData.name} onChange={(e) => setPageData({...pageData, name: e.target.value})} className="bg-transparent text-xl font-bold text-white outline-none border-b border-transparent focus:border-primary/50" placeholder="Nombre de la página..." />
            <p className="text-slate-500 text-[10px] font-black uppercase mt-1">Plan: <span className="text-primary">{subscription?.planId?.name || 'Cargando...'}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-dark-900/50 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
            {[{ id: 'editor', label: 'Editor', icon: Layout }, { id: 'settings', label: 'SEO', icon: Settings }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-200'}`}><tab.icon size={14} /> {tab.label}</button>
            ))}
          </div>
          <button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"><Save size={18} /> {isNew ? 'Publicar' : 'Actualizar'}</button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        <div className="lg:col-span-1 glass rounded-[32px] border border-white/5 p-6 flex flex-col gap-6 overflow-y-auto">
          {isFreePlan ? (
            <div className="space-y-8">
              {selectedSection ? (
                <div className="space-y-6 animate-in slide-in-from-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2"><Edit3 size={14} className="text-primary" /> Editando: {selectedSection.type}</h3>
                    <button onClick={() => setSelectedSectionIndex(null)} className="text-slate-500 hover:text-white text-[10px] uppercase font-bold">Cerrar</button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => moveSection(selectedSectionIndex, -1)} disabled={selectedSectionIndex === 0} className="flex-1 py-2 bg-dark-800 border border-white/5 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 text-[10px] font-bold">Subir</button>
                    <button onClick={() => moveSection(selectedSectionIndex, 1)} disabled={selectedSectionIndex === pageData.sections.length - 1} className="flex-1 py-2 bg-dark-800 border border-white/5 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 text-[10px] font-bold">Bajar</button>
                  </div>
                  <div className="space-y-5">
                    {Object.keys(selectedSection.content).map((key) => {
                      if (['items', 'ctaText', 'buttonText', 'action', 'layout'].includes(key)) return null;
                      const val = selectedSection.content[key];
                      return (
                        <div key={key} className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">{key}</label>
                          {key.toLowerCase().includes('description') ? 
                            <textarea value={val} onChange={(e) => updateSectionContent(key, e.target.value)} className="w-full bg-dark-800 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-slate-300 outline-none h-32 resize-none" /> :
                            <input type="text" value={val} onChange={(e) => updateSectionContent(key, e.target.value)} className="w-full bg-dark-800 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-slate-300 outline-none" />
                          }
                        </div>
                      );
                    })}
                    {(selectedSection.content.ctaText || selectedSection.content.buttonText) && (
                      <div className="pt-4 border-t border-white/5 space-y-4">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Configurar Botón</h4>
                        <div className="space-y-3">
                          <input type="text" value={selectedSection.content.ctaText || selectedSection.content.buttonText} onChange={(e) => updateSectionContent(selectedSection.content.ctaText ? 'ctaText' : 'buttonText', e.target.value)} className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" placeholder="Texto del botón" />
                          <select value={selectedSection.content.action?.type || 'link'} onChange={(e) => updateSectionContent('action', { ...selectedSection.content.action, type: e.target.value })} className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                            <option value="link">Enlace (ID: #ancla o URL)</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="phone">Llamada</option>
                            <option value="email">Email</option>
                          </select>
                          <input type="text" value={selectedSection.content.action?.value || ''} onChange={(e) => updateSectionContent('action', { ...selectedSection.content.action, value: e.target.value })} className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono" placeholder="Valor del enlace o ID" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Type size={14} /> Secciones</h3>
                    <div className="space-y-2">
                      {pageData.sections.map((section, idx) => (
                        <button key={idx} onClick={() => setSelectedSectionIndex(idx)} className="w-full p-4 bg-dark-800 border border-white/5 rounded-2xl text-xs text-slate-400 flex items-center justify-between hover:text-white transition-all group">
                          <span className="capitalize font-bold">{section.type}</span>
                          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest text-center">Añadir Bloque (+1 Gratis)</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['cta', 'testimonials', 'features', 'contact'].map(type => (
                        <button key={type} onClick={() => addExtraSection(type)} disabled={pageData.sections.length >= 4} className="p-3 bg-dark-800 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 hover:border-primary/50 hover:text-white disabled:opacity-20 capitalize">{type}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center p-8 text-slate-600 italic">Constructor avanzado Pro.</div>
          )}
        </div>

        <div className="lg:col-span-3 glass rounded-[32px] border border-white/5 bg-dark-900/30 overflow-y-auto">
          {activeTab === 'editor' && (
            <div className="p-8 space-y-12">
              {pageData.sections.length === 0 && <div className="py-40 text-center text-slate-600">Página vacía. Elige una plantilla.</div>}
              {pageData.sections.map((section, idx) => (
                <SectionRenderer 
                  key={idx} section={section} idx={idx} isPreview={true}
                  isSelected={selectedSectionIndex === idx} onSectionClick={setSelectedSectionIndex} 
                />
              ))}
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto py-20 px-8 space-y-8">
              <h3 className="text-2xl font-black text-white">SEO Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Título Pestaña</label>
                  <input type="text" value={pageData.seo.title} onChange={(e) => setPageData({...pageData, seo: {...pageData.seo, title: e.target.value}})} className="w-full bg-dark-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Meta Descripción</label>
                  <textarea value={pageData.seo.description} onChange={(e) => setPageData({...pageData, seo: {...pageData.seo, description: e.target.value}})} className="w-full bg-dark-800 border border-slate-700 rounded-xl px-4 py-3 text-white h-32 outline-none" />
                </div>
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