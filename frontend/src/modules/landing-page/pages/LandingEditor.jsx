import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Layout, Settings, Eye, Check, ChevronRight, Type, Edit3, Globe } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../core/auth/context/AuthContext';
import api from '../../../lib/api';
import { LANDING_TEMPLATES } from '../config/templates.config';
import Toast from '../../../shared/components/Toast';

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
  
  // Estado de la página (Defensivo)
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

  if (loading && !pageData.name && isNew) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // PANTALLA 1: SELECTOR DE PLANTILLA (Si es nueva y no hay secciones)
  if (isNew && pageData.sections.length === 0) {
    return (
      <div className="space-y-12 animate-fade-in p-8">
        <div className="flex items-center gap-4">
          <Link to={`/${tenant?.slug}/landings`} className="p-2 bg-dark-800 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Nueva Página</h2>
            <p className="text-slate-500">Selecciona una plantilla para comenzar a trabajar.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LANDING_TEMPLATES.map((template) => (
            <div key={template.id} className="glass rounded-[40px] border border-white/5 overflow-hidden group hover:border-primary/50 transition-all flex flex-col">
              <div className="aspect-video bg-dark-800 relative flex items-center justify-center">
                <Globe size={48} className="text-slate-700 group-hover:text-primary/20 transition-all" />
                <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                  <button onClick={() => selectTemplate(template)} className="bg-primary text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all">
                    Usar Plantilla <ChevronRight size={18} />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{template.name}</h3>
                  <span className="bg-primary/10 text-primary text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-primary/20">Gratis</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </div>
    );
  }

  const isFreePlan = subscription?.planId?.slug === 'gratis';
  const selectedSection = selectedSectionIndex !== null ? pageData.sections[selectedSectionIndex] : null;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 animate-fade-in">
      {/* HEADER DEL EDITOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => isNew ? setPageData({...pageData, sections: []}) : navigate(`/${tenant?.slug}/landings`)} className="p-2 bg-dark-800 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <input 
              type="text" 
              value={pageData.name} 
              onChange={(e) => setPageData({...pageData, name: e.target.value})}
              className="bg-transparent text-xl font-bold text-white outline-none border-b border-transparent focus:border-primary/50 transition-all"
              placeholder="Nombre de la página..."
            />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
              Plan: <span className="text-primary">{subscription?.planId?.name || 'Cargando...'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-dark-900/50 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
            {[
              { id: 'editor', label: 'Editor', icon: Layout },
              { id: 'settings', label: 'SEO', icon: Settings },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-200'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>

          <button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all">
            <Save size={18} /> {isNew ? 'Publicar' : 'Actualizar'}
          </button>
        </div>
      </div>

      {/* ÁREA DE TRABAJO */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        {/* PANEL LATERAL DE EDICIÓN */}
        <div className="lg:col-span-1 glass rounded-[32px] border border-white/5 p-6 flex flex-col gap-6 overflow-y-auto">
          {isFreePlan ? (
            <div className="space-y-8">
              <div className="p-5 bg-primary/10 border border-primary/20 rounded-3xl">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Restricciones de Plan</p>
                <p className="text-xs text-slate-300 leading-relaxed">En el Plan Gratis puedes editar los textos e imágenes de la plantilla. El diseño y orden son fijos.</p>
              </div>
              
              {selectedSection ? (
                <div className="space-y-6 animate-in slide-in-from-left duration-300">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Edit3 size={14} className="text-primary" /> Editando: {selectedSection.type}
                    </h3>
                    <button onClick={() => setSelectedSectionIndex(null)} className="text-slate-500 hover:text-white text-[10px] uppercase font-bold">Cerrar</button>
                  </div>

                  <div className="space-y-5">
                    {Object.keys(selectedSection.content).map((key) => {
                      if (key === 'items' || key === 'ctaText' || key === 'buttonText') return null;
                      const val = selectedSection.content[key];
                      return (
                        <div key={key} className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">{key}</label>
                          {key.toLowerCase().includes('description') ? (
                            <textarea 
                              value={val}
                              onChange={(e) => updateSectionContent(key, e.target.value)}
                              className="w-full bg-dark-800 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-slate-300 focus:ring-2 focus:ring-primary/40 outline-none h-32 resize-none transition-all"
                            />
                          ) : (
                            <input 
                              type="text" 
                              value={val}
                              onChange={(e) => updateSectionContent(key, e.target.value)}
                              className="w-full bg-dark-800 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-slate-300 focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Type size={14} /> Secciones de la página
                  </h3>
                  <div className="space-y-3">
                    {pageData.sections.map((section, idx) => (
                      <button key={idx} onClick={() => setSelectedSectionIndex(idx)} className="w-full p-4 bg-dark-800 border border-white/5 rounded-2xl text-xs text-slate-400 flex items-center justify-between hover:border-primary/40 hover:text-white transition-all group">
                        <span className="capitalize font-bold">{section.type}</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center p-8">
              <p className="text-slate-600 text-sm italic font-medium">Constructor avanzado en desarrollo para planes Pro.</p>
            </div>
          )}
        </div>

        {/* LIENZO DEL EDITOR (CANVAS) */}
        <div className="lg:col-span-3 glass rounded-[32px] border border-white/5 bg-dark-900/30 overflow-y-auto">
          {activeTab === 'editor' && (
            <div className="p-12 space-y-16">
              {pageData.sections.length === 0 && (
                <div className="py-40 text-center space-y-4">
                  <Layout size={64} className="mx-auto text-slate-800" />
                  <p className="text-slate-600 font-medium tracking-tight">Tu página está vacía. Selecciona una plantilla para empezar.</p>
                </div>
              )}
              {pageData.sections.map((section, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedSectionIndex(idx)}
                  className={`relative group rounded-[40px] border transition-all duration-500 ${
                    selectedSectionIndex === idx 
                      ? 'border-primary shadow-[0_0_50px_-20px_rgba(99,102,241,0.6)] ring-8 ring-primary/5 bg-dark-800/40' 
                      : 'border-transparent hover:border-white/10 hover:bg-white/[0.02]'
                  } cursor-pointer`}
                >
                  <div className="p-12 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 opacity-40">Bloque: {section.type}</p>
                    <h4 className="text-4xl font-black text-white mb-6 tracking-tight leading-tight max-w-2xl mx-auto">
                      {section.content.title || 'Título de sección'}
                    </h4>
                    <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
                      {section.content.description || 'Descripción de la sección...'}
                    </p>
                    {section.content.image && (
                      <div className="mt-12 w-full max-w-xl mx-auto aspect-video rounded-[40px] bg-dark-800 flex items-center justify-center overflow-hidden border border-white/5 shadow-2xl">
                        <img src={section.content.image} className="w-full h-full object-cover" alt="preview" />
                      </div>
                    )}
                  </div>
                  
                  {/* Indicador visual de selección */}
                  {selectedSectionIndex === idx && (
                    <div className="absolute top-6 right-6 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg animate-scale-up">
                      <Check size={16} strokeWidth={3} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto py-24 px-8 space-y-12">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white tracking-tighter">Posicionamiento SEO</h3>
                <p className="text-slate-500 text-sm">Configura cómo aparecerá tu página en Google y redes sociales.</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Título de Navegación</label>
                  <input 
                    type="text" 
                    value={pageData.seo.title}
                    onChange={(e) => setPageData({...pageData, seo: {...pageData.seo, title: e.target.value}})}
                    className="w-full bg-dark-800 border border-slate-700 rounded-[24px] px-6 py-4 text-white focus:ring-4 focus:ring-primary/20 outline-none transition-all" 
                    placeholder="Ej: Inicio | Mi Negocio" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Descripción corta (Meta)</label>
                  <textarea 
                    value={pageData.seo.description}
                    onChange={(e) => setPageData({...pageData, seo: {...pageData.seo, description: e.target.value}})}
                    className="w-full bg-dark-800 border border-slate-700 rounded-[24px] px-6 py-4 text-white h-48 focus:ring-4 focus:ring-primary/20 outline-none resize-none transition-all text-sm leading-relaxed" 
                    placeholder="Escribe un resumen atractivo para tus clientes..." 
                  />
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