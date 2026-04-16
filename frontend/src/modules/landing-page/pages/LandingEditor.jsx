import { useState, useEffect, useRef } from 'react';
import { Save, Plus, ArrowLeft, Layout, Settings, Eye, Check, ChevronRight, Image as ImageIcon, Type, MousePointer2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../core/auth/context/AuthContext';
import api from '../../../lib/api';
import { LANDING_TEMPLATES } from '../config/templates.config';

const LandingEditor = () => {
  const { tenant } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('editor'); // editor | settings | preview
  const [subscription, setSubscription] = useState(null);
  const [isNew, setIsNew] = useState(!id);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
  
  // Estado de la página
  const [pageData, setPageData] = useState({
    name: '',
    path: '',
    sections: [],
    theme: {},
    seo: { title: '', description: '' }
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Obtener el plan del módulo
        const subRes = await api.get('/modules/tenant/me');
        const landingSub = subRes.data.modules.find(m => m.moduleId.slug === 'landing-page');
        setSubscription(landingSub);

        if (id) {
          // 2. Cargar página existente
          const pageRes = await api.get(`/landings/${id}`);
          setPageData(pageRes.data.landing);
          setIsNew(false);
        }
      } catch (err) {
        console.error('Error al cargar datos del editor');
        navigate(`/${tenant?.slug}/landings`);
      } finally {
        setLoading(false);
      }
    };
    if (tenant?.slug) fetchData();
  }, [id, tenant?.slug]);

  const selectTemplate = (template) => {
    setPageData({
      ...pageData,
      name: `Nueva ${template.name}`,
      path: `/${Date.now()}`, // Path temporal único
      sections: template.sections,
      theme: template.theme,
      templateId: template.id
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (isNew) {
        await api.post('/landings', pageData);
      } else {
        await api.put(`/landings/${id}`, pageData);
      }
      navigate(`/${tenant?.slug}/landings`);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const updateSectionContent = (field, value) => {
    const newSections = [...pageData.sections];
    newSections[selectedSectionIndex].content[field] = value;
    setPageData({ ...pageData, sections: newSections });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // SI ES NUEVA Y NO HAY PLANTILLA SELECCIONADA: MOSTRAR SELECTOR
  if (isNew && pageData.sections.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <Link to={`/${tenant?.slug}/landings`} className="p-2 bg-dark-800 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-bold text-white">Elige una plantilla base</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LANDING_TEMPLATES.map((template) => (
            <div 
              key={template.id}
              className="glass rounded-[32px] border border-white/5 overflow-hidden group hover:border-primary/50 transition-all flex flex-col"
            >
              <div className="aspect-video bg-dark-800 relative flex items-center justify-center">
                <Layout size={48} className="text-slate-700 group-hover:text-primary/20 transition-all" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <button 
                    onClick={() => selectTemplate(template)}
                    className="w-full bg-white text-black py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
                  >
                    Usar esta plantilla <ChevronRight size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{template.name}</h3>
                  <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Gratis</span>
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
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      {/* Cabecera del Editor */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setPageData({...pageData, sections: []})} 
            className="p-2 bg-dark-800 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">{pageData.name}</h2>
            <p className="text-slate-500 text-xs font-mono">Plan: <span className="text-primary uppercase font-bold">{subscription?.planId?.name}</span></p>
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

          <button 
            onClick={handleSave}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Save size={18} /> Publicar
          </button>
        </div>
      </div>

      {/* Área de Trabajo */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        {/* Panel de Control (Dinámico según Plan) */}
        <div className="lg:col-span-1 glass rounded-3xl border border-white/5 p-6 flex flex-col gap-6 overflow-y-auto">
          {isFreePlan ? (
            <div className="space-y-6">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                <p className="text-[11px] font-black text-primary uppercase tracking-widest mb-1">Plan Gratis Activo</p>
                <p className="text-xs text-slate-300 leading-tight">Solo puedes editar textos e imágenes. Para libertad total de diseño, mejora tu plan.</p>
              </div>
              
              {selectedSection ? (
                <div className="space-y-6 animate-in slide-in-from-left duration-300">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <Edit3 size={14} className="text-primary" /> Editando {selectedSection.type}
                    </h3>
                    <button onClick={() => setSelectedSectionIndex(null)} className="text-slate-500 hover:text-white text-xs underline">Cerrar</button>
                  </div>

                  <div className="space-y-4">
                    {Object.keys(selectedSection.content).map((key) => {
                      if (key === 'items') return null; // Manejar items por separado
                      const val = selectedSection.content[key];
                      
                      return (
                        <div key={key} className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{key}</label>
                          {key.toLowerCase().includes('description') || (key.toLowerCase().includes('text') && val.length > 50) ? (
                            <textarea 
                              value={val}
                              onChange={(e) => updateSectionContent(key, e.target.value)}
                              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-primary outline-none h-24 resize-none"
                            />
                          ) : (
                            <input 
                              type="text" 
                              value={val}
                              onChange={(e) => updateSectionContent(key, e.target.value)}
                              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-primary outline-none"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Type size={14} /> Contenido editable
                  </h3>
                  <p className="text-[10px] text-slate-500 italic">Haz clic en una sección del lienzo para editar su contenido.</p>
                  
                  <div className="space-y-2">
                    {pageData.sections.map((section, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setSelectedSectionIndex(idx)}
                        className="w-full p-3 bg-dark-800 border border-white/5 rounded-xl text-xs text-slate-400 flex items-center justify-between hover:border-primary/50 hover:text-white transition-all"
                      >
                        <span className="capitalize">{section.type}</span>
                        <ChevronRight size={12} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Añadir Bloques</h3>
              {/* Aquí iría la lógica de Drag & Drop para planes PRO */}
              <div className="p-8 border-2 border-dashed border-slate-800 rounded-2xl text-center">
                <MousePointer2 size={24} className="mx-auto text-slate-700 mb-2" />
                <p className="text-[10px] text-slate-600">Constructor avanzado disponible en tu plan.</p>
              </div>
            </div>
          )}
        </div>

        {/* Canvas del Editor */}
        <div className="lg:col-span-3 glass rounded-3xl border border-white/5 bg-dark-900/30 overflow-y-auto">
          {activeTab === 'editor' && (
            <div className="p-12 space-y-12">
              {pageData.sections.map((section, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedSectionIndex(idx)}
                  className={`relative group rounded-[32px] border transition-all ${
                    selectedSectionIndex === idx 
                      ? 'border-primary shadow-[0_0_30px_-10px_rgba(99,102,241,0.5)] ring-4 ring-primary/10' 
                      : 'border-transparent hover:border-white/10'
                  } ${isFreePlan ? 'cursor-pointer' : ''}`}
                >
                  <div className={`p-10 text-center rounded-[32px] transition-all ${selectedSectionIndex === idx ? 'bg-dark-800/40' : 'bg-dark-800/20'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 opacity-50">{section.type}</p>
                    <h4 className="text-3xl font-black text-white mb-4 tracking-tight">
                      {section.content.title || 'Sin título'}
                    </h4>
                    <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">{section.content.description}</p>
                    {section.content.image && (
                      <div className="mt-10 w-full max-w-md mx-auto aspect-video rounded-[32px] bg-dark-700 flex items-center justify-center overflow-hidden border border-white/10 shadow-2xl">
                        <img src={section.content.image} className="w-full h-full object-cover" alt="preview" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto py-20 space-y-6">
              <h3 className="text-2xl font-black text-white mb-10 tracking-tight">Optimización SEO</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Título de la pestaña</label>
                  <input 
                    type="text" 
                    value={pageData.seo.title}
                    onChange={(e) => setPageData({...pageData, seo: {...pageData.seo, title: e.target.value}})}
                    className="w-full bg-dark-800 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-primary/50 transition-all outline-none" 
                    placeholder="Ej: Mi Oferta Increíble" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Descripción para Google</label>
                  <textarea 
                    value={pageData.seo.description}
                    onChange={(e) => setPageData({...pageData, seo: {...pageData.seo, description: e.target.value}})}
                    className="w-full bg-dark-800 border border-slate-700 rounded-2xl px-6 py-4 text-white h-40 focus:ring-2 focus:ring-primary/50 transition-all outline-none resize-none" 
                    placeholder="Escribe aquí de qué trata tu página..." 
                  />
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