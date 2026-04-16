import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Check, Layout, X } from 'lucide-react';
import api from '../../../lib/api';
import { parseSessionJSON } from '../../../lib/cookies';
import { getAdminUrl } from '../../../config/domains';

const PlanModal = ({ isOpen, onClose, module, onSelectPlan, selectedPlanId }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!module?.slug) return;
      try {
        const response = await api.get(`/modules/${module.slug}/plans`);
        setPlans(response.data.plans);
      } catch (err) {
        console.error('Error al cargar planes');
      } finally {
        setLoading(false);
      }
    };
    if (isOpen) fetchPlans();
  }, [isOpen, module]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-dark-950/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass rounded-[40px] w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-primary/20 animate-scale-up">
        <div className="sticky top-0 bg-dark-900/95 backdrop-blur-sm p-8 border-b border-primary/20 z-10">
          <button onClick={onClose} className="absolute top-6 right-8 p-2 rounded-xl hover:bg-dark-800 transition">
            <X size={24} className="text-slate-400" />
          </button>
          
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Sparkles size={32} className="text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{module.name}</h2>
              <p className="text-slate-400 text-lg">{module.description}</p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          {loading ? (
            <div className="py-20 text-center text-slate-500">Cargando planes...</div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {plans.map((plan) => {
                const isSelected = selectedPlanId === plan._id;
                
                return (
                  <div
                    key={plan._id}
                    className={`relative rounded-3xl p-6 transition-all flex flex-col group ${
                      isSelected
                        ? 'bg-primary/20 border-2 border-primary shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)]'
                        : 'bg-dark-800/50 border border-slate-700 hover:border-primary/50'
                    }`}
                  >
                    <div className="mb-6">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">{plan.name}</h3>
                      <p className="text-3xl font-black text-white">
                        {plan.priceMonthly === 0 ? 'Q0' : `Q${plan.priceMonthly}`}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">Facturación mensual</p>
                    </div>
                    
                    <div className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check size={14} className="text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300 text-xs font-medium leading-tight">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => {
                        onSelectPlan(module.slug, plan._id, plan);
                        onClose();
                      }}
                      className={`w-full py-4 rounded-2xl font-black text-sm tracking-tight transition-all ${
                        isSelected 
                          ? 'bg-primary text-white' 
                          : 'bg-white/5 text-white hover:bg-primary hover:scale-[1.02]'
                      }`}
                    >
                      {isSelected ? 'Seleccionado' : 'Elegir Plan'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function SelectModules() {
  const [availableModules, setAvailableModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState({});
  const [selectedPlanDetails, setSelectedPlanDetails] = useState({});
  const [modalModule, setModalModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tenant = parseSessionJSON('tenant', {});

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await api.get('/modules');
        setAvailableModules(response.data.modules);
      } catch (err) {
        setError('No se pudieron cargar los módulos.');
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  const selectPlan = (moduleSlug, planId, planDetails) => {
    setSelectedModules(prev => ({ ...prev, [moduleSlug]: planId }));
    setSelectedPlanDetails(prev => ({ ...prev, [moduleSlug]: planDetails }));
  };

  const calculateTotal = () => {
    return Object.values(selectedPlanDetails).reduce((total, plan) => total + (plan.priceMonthly || 0), 0);
  };

  const handleContinue = async () => {
    if (Object.keys(selectedModules).length === 0) {
      setError('Debes seleccionar al menos un módulo para continuar.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      for (const [moduleSlug, planId] of Object.entries(selectedModules)) {
        const moduleData = availableModules.find(m => m.slug === moduleSlug);
        await api.post('/modules/tenant', { moduleId: moduleData._id, planId: planId });
      }

      await api.post('/tenants/onboarding/complete');
      const updatedTenant = { ...tenant, hasCompletedOnboarding: true };
      localStorage.setItem('tenant', JSON.stringify(updatedTenant));
      window.location.href = `${getAdminUrl(tenant.slug)}/dashboard`;
    } catch (err) {
      setError('Error al activar los módulos. Revisa tu conexión.');
      setLoading(false);
    }
  };

  if (loading && availableModules.length === 0) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const total = calculateTotal();
  const selectedCount = Object.keys(selectedModules).length;

  return (
    <div className="min-h-screen bg-dark-950 py-12 px-4 selection:bg-primary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} /> Paso Final del Registro
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
            Potencia tu <span className="text-gradient">Negocio</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Personaliza tu ecosistema modular. Elige los planes que se ajusten a tu crecimiento actual.
          </p>
        </div>

        <div className="sticky top-6 z-20 mb-16">
          <div className="glass rounded-[40px] p-8 flex items-center justify-between shadow-2xl border border-white/10 backdrop-blur-2xl">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-slate-500 text-xs uppercase font-black tracking-[0.2em] mb-2">Suscripción Mensual</p>
                <p className="text-5xl font-black text-white leading-none">Q{total}</p>
              </div>
              <div className="h-12 w-[1px] bg-white/10" />
              <div>
                <p className="text-slate-500 text-xs uppercase font-black tracking-[0.2em] mb-2">Herramientas</p>
                <p className="text-2xl font-bold text-slate-300">{selectedCount} Activas</p>
              </div>
            </div>
            <button 
              onClick={handleContinue} 
              disabled={loading || selectedCount === 0} 
              className="bg-primary hover:bg-primary/90 text-white px-12 py-5 rounded-[24px] font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 shadow-[0_20px_50px_-15px_rgba(99,102,241,0.5)] flex items-center gap-3"
            >
              {loading ? 'Preparando Dashboard...' : (<>Activar y Comenzar <ArrowRight size={24} /></>)}
            </button>
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-12 p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-3xl text-center font-bold animate-shake">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableModules.map((module) => {
            const isSelected = !!selectedModules[module.slug];
            const plan = selectedPlanDetails[module.slug];
            
            return (
              <div
                key={module._id}
                onClick={() => setModalModule(module)}
                className={`group relative p-10 rounded-[48px] cursor-pointer transition-all duration-500 border-2 ${
                  isSelected 
                    ? 'bg-primary/5 border-primary shadow-[0_0_60px_-15px_rgba(99,102,241,0.3)]' 
                    : 'bg-dark-900/40 border-white/5 hover:border-white/20'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-2xl animate-scale-up border-4 border-dark-950">
                    <Check size={24} className="text-white font-black" />
                  </div>
                )}

                <div className={`w-20 h-20 rounded-3xl bg-dark-800 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/5 shadow-2xl`}>
                  <Layout size={40} className={isSelected ? 'text-primary' : 'text-slate-600'} />
                </div>
                
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">{module.name}</h3>
                <p className="text-slate-500 text-base leading-relaxed mb-8">{module.description}</p>
                
                {isSelected ? (
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-primary font-black text-sm uppercase tracking-wider">Plan {plan?.name}</p>
                      <p className="text-slate-500 text-xs">Activo · Q{plan?.priceMonthly}/mes</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-full">Cambiar</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-primary text-sm font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    Ver Planes <ArrowRight size={18} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <PlanModal
        isOpen={!!modalModule}
        onClose={() => setModalModule(null)}
        module={modalModule}
        onSelectPlan={selectPlan}
        selectedPlanId={modalModule ? selectedModules[modalModule.slug] : null}
      />
    </div>
  );
}