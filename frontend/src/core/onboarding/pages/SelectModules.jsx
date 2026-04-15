import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Check, Layout, Users, ShoppingBag, Package, Store, Calendar, Calculator, UserCog, Building2, Shield, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { GlowCard } from '../../../shared/components/GlowCard';
import api from '../../../lib/api';
import { parseSessionJSON } from '../../../lib/cookies';
import { getAdminUrl } from '../../../config/domains';

// Planes disponibles por módulo
const MODULE_PLANS = {
  landing: [
    { id: 'free', name: 'Gratuito', price: 0, features: ['1 página', 'Plantillas básicas', 'Subdominio'] },
    { id: 'basic', name: 'Básico', price: 39, features: ['3 páginas', 'SEO básico', 'Formulario contacto'] },
    { id: 'pro', name: 'Pro', price: 129, features: ['10 páginas', 'SEO avanzado', 'Analytics', 'Dominio personalizado'] },
  ],
  customers: [
    { id: 'free', name: 'Gratuito', price: 0, features: ['50 clientes', 'Campos básicos'] },
    { id: 'basic', name: 'Básico', price: 19, features: ['500 clientes', 'Segmentación', 'Exportar CSV'] },
    { id: 'pro', name: 'Pro', price: 99, features: ['Clientes ilimitados', 'Automatizaciones', 'API'] },
  ],
  store: [
    { id: 'free', name: 'Gratuito', price: 0, features: ['10 productos', 'Carrito básico'] },
    { id: 'basic', name: 'Básico', price: 99, features: ['100 productos', 'Variantes', 'Cupones'] },
    { id: 'pro', name: 'Pro', price: 199, features: ['1000 productos', 'Reseñas', 'Reportes'] },
  ],
  inventory: [
    { id: 'free', name: 'Gratuito', price: 0, features: ['50 productos', 'Stock básico'] },
    { id: 'basic', name: 'Básico', price: 49, features: ['500 productos', 'Alertas stock', 'Proveedores'] },
    { id: 'pro', name: 'Pro', price: 99, features: ['Ilimitado', 'Múltiples bodegas', 'Códigos barras'] },
  ],
  pos: [
    { id: 'free', name: 'Gratuito', price: 0, features: ['1 caja', 'Ventas básicas'] },
    { id: 'basic', name: 'Básico', price: 29, features: ['3 cajas', 'Reportes turno', 'Cortesías'] },
    { id: 'pro', name: 'Pro', price: 49, features: ['Cajas ilimitadas', 'Facturación', 'Multi-sucursal'] },
  ],
  bookings: [
    { id: 'free', name: 'Gratuito', price: 0, features: ['5 servicios', 'Calendario básico'] },
    { id: 'basic', name: 'Básico', price: 49, features: ['30 servicios', 'Recordatorios email', 'Pagos online'] },
    { id: 'pro', name: 'Pro', price: 199, features: ['Ilimitado', 'SMS/WhatsApp', 'Google Calendar'] },
  ],
  accounting: [
    { id: 'free', name: 'Gratuito', price: 0, features: ['Ingresos/gastos básicos'] },
    { id: 'basic', name: 'Básico', price: 99, features: ['Reportes financieros', 'Exportar Excel'] },
    { id: 'pro', name: 'Pro', price: 399, features: ['Facturación FEL', 'Cuentas por cobrar', 'Conciliación'] },
  ],
  employees: [
    { id: 'free', name: 'Gratuito', price: 0, features: ['3 empleados', 'Roles básicos'] },
    { id: 'basic', name: 'Básico', price: 49, features: ['10 empleados', 'Permisos avanzados', 'Comisiones'] },
  ],
  branches: [
    { id: 'free', name: 'Gratuito', price: 0, features: ['2 sucursales'] },
    { id: 'basic', name: 'Básico', price: 99, features: ['5 sucursales', 'Reportes por ubicación'] },
  ],
};

const AVAILABLE_MODULES = [
  { id: 'landing', name: 'Landing Page', description: 'Crea páginas profesionales', icon: Layout, color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-cyan-400' },
  { id: 'customers', name: 'Registro de Clientes', description: 'Base de datos de clientes', icon: Users, color: 'from-emerald-500/20 to-green-500/20', iconColor: 'text-emerald-400', requiredFor: ['store', 'pos', 'bookings'] },
  { id: 'store', name: 'Tienda en Línea', description: 'Vende productos online', icon: ShoppingBag, color: 'from-primary/20 to-secondary/20', iconColor: 'text-primary', requires: 'customers' },
  { id: 'inventory', name: 'Inventario', description: 'Control de stock', icon: Package, color: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-400' },
  { id: 'pos', name: 'Punto de Venta', description: 'Vende en tienda física', icon: Store, color: 'from-purple-500/20 to-pink-500/20', iconColor: 'text-purple-400', requires: 'customers' },
  { id: 'bookings', name: 'Reservas y Servicios', description: 'Agenda citas', icon: Calendar, color: 'from-orange-500/20 to-amber-500/20', iconColor: 'text-orange-400', requires: 'customers' },
  { id: 'accounting', name: 'Contabilidad', description: 'Control financiero', icon: Calculator, color: 'from-red-500/20 to-rose-500/20', iconColor: 'text-red-400' },
  { id: 'employees', name: 'Empleados', description: 'Gestión de personal', icon: UserCog, color: 'from-indigo-500/20 to-blue-500/20', iconColor: 'text-indigo-400' },
  { id: 'branches', name: 'Sucursales', description: 'Múltiples ubicaciones', icon: Building2, color: 'from-yellow-500/20 to-amber-500/20', iconColor: 'text-yellow-400' },
];

export default function SelectModules() {
  // Estado: módulo expandido (para mostrar planes)
  const [expandedModule, setExpandedModule] = useState(null);
  // Estado: módulos seleccionados con su plan
  const [selectedModules, setSelectedModules] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tenant = parseSessionJSON('tenant', {});
  const user = parseSessionJSON('user', {});

  // Seleccionar un plan para un módulo
  const selectPlan = (moduleId, planId) => {
    setSelectedModules(prev => ({
      ...prev,
      [moduleId]: planId
    }));
    
    // Auto-seleccionar módulos requeridos
    const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
    if (module?.requires) {
      const requiredModule = module.requires;
      if (!selectedModules[requiredModule]) {
        setSelectedModules(prev => ({
          ...prev,
          [requiredModule]: 'free' // Plan gratuito por defecto
        }));
      }
    }
  };

  // Auto-seleccionar módulos requeridos cuando se selecciona uno
  useEffect(() => {
    const updates = {};
    Object.keys(selectedModules).forEach(moduleId => {
      const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
      if (module?.requires && !selectedModules[module.requires]) {
        updates[module.requires] = 'free';
      }
    });
    
    if (Object.keys(updates).length > 0) {
      setSelectedModules(prev => ({ ...prev, ...updates }));
    }
  }, [selectedModules]);

  const calculateTotal = () => {
    return Object.entries(selectedModules).reduce((total, [moduleId, planId]) => {
      const plans = MODULE_PLANS[moduleId];
      const plan = plans?.find(p => p.id === planId);
      return total + (plan?.price || 0);
    }, 0);
  };

  const handleContinue = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Marcar onboarding como completado
      await api.post('/tenants/onboarding/complete');
      
      // Actualizar tenant en cookie
      const updatedTenant = { ...tenant, hasCompletedOnboarding: true };
      localStorage.setItem('tenant', JSON.stringify(updatedTenant));
      
      // Redirección al dashboard
      window.location.href = `${getAdminUrl(tenant.slug)}/dashboard`;
    } catch (err) {
      setError('Error al guardar la configuración. Intenta de nuevo.');
      setLoading(false);
    }
  };

  const total = calculateTotal();
  const selectedCount = Object.keys(selectedModules).length;

  return (
    <div className="min-h-screen bg-dark-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              ¡Configura tu plan, {user.fullName?.split(' ')[0] || 'Emprendedor'}!
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Elige los módulos que necesitas. Puedes empezar gratis y escalar cuando quieras.
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Total y CTA */}
        <div className="sticky top-4 z-20 mb-8">
          <div className="glass rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-slate-400 text-sm">Total mensual</p>
                <p className="text-3xl font-bold text-gradient">Q{total}</p>
              </div>
              <div className="text-sm text-slate-400">
                {selectedCount} módulos seleccionados
              </div>
            </div>
            <button 
              onClick={handleContinue} 
              disabled={loading} 
              className="group bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:glow-effect transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : (
                <>
                  Continuar al Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Grid de módulos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_MODULES.map((module) => {
            const isSelected = !!selectedModules[module.id];
            const selectedPlan = MODULE_PLANS[module.id]?.find(p => p.id === selectedModules[module.id]);
            const isExpanded = expandedModule === module.id;
            const requiresModule = module.requires && !selectedModules[module.requires];
            
            return (
              <GlowCard key={module.id} className={`relative transition-all duration-300 ${isSelected ? 'border-2 border-primary shadow-lg shadow-primary/20' : 'border border-slate-700/50'}`}>
                {/* Badges */}
                <div className="absolute top-3 right-3 flex gap-2">
                  {module.requiredFor && (
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                      Requerido para {module.requiredFor.length}
                    </span>
                  )}
                  {isSelected && (
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
                      <Check size={10} />
                      {selectedPlan?.name}
                    </span>
                  )}
                </div>

                {/* Icono y nombre */}
                <div 
                  className="cursor-pointer"
                  onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4`}>
                    <module.icon size={28} className={module.iconColor} />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white">{module.name}</h3>
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <span className="text-sm text-gradient font-medium">Q{selectedPlan?.price || 0}</span>
                      )}
                      {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{module.description}</p>
                </div>

                {/* Requiere */}
                {module.requires && (
                  <p className={`text-xs mb-3 flex items-center gap-1 ${requiresModule ? 'text-yellow-400' : 'text-slate-500'}`}>
                    <Shield size={10} />
                    Requiere: {AVAILABLE_MODULES.find(m => m.id === module.requires)?.name}
                    {requiresModule && ' (selecciónalo primero)'}
                  </p>
                )}

                {/* Planes (expandible) */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50 animate-fade-in">
                    <p className="text-sm text-slate-400 mb-3">Elige un plan:</p>
                    <div className="space-y-2">
                      {MODULE_PLANS[module.id]?.map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => selectPlan(module.id, plan.id)}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            selectedModules[module.id] === plan.id
                              ? 'bg-primary/20 border border-primary'
                              : 'bg-dark-800/50 border border-slate-700 hover:border-primary/50'
                          }`}
                          disabled={requiresModule}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-white">{plan.name}</span>
                            <span className="text-gradient font-bold">
                              {plan.price === 0 ? 'Gratis' : `Q${plan.price}/mes`}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {plan.features.slice(0, 3).map((feature, i) => (
                              <span key={i} className="text-xs text-slate-400 flex items-center gap-1">
                                <Check size={10} className="text-green-400" />
                                {feature}
                              </span>
                            ))}
                            {plan.features.length > 3 && (
                              <span className="text-xs text-slate-500">+{plan.features.length - 3} más</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mensaje de requerido */}
                {requiresModule && (
                  <p className="text-xs text-yellow-400 mt-3">
                    Selecciona primero {AVAILABLE_MODULES.find(m => m.id === module.requires)?.name}
                  </p>
                )}
              </GlowCard>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm">
            ¿No encuentras lo que buscas?{' '}
            <a href="https://wa.me/50237674506" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition font-medium">
              Contáctanos para un módulo personalizado →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}