import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Check, Layout, Users, ShoppingBag, Package, Store, Calendar, Calculator, UserCog, Building2, Shield, X, Zap, Crown, Building } from 'lucide-react';
import { GlowCard } from '../../../shared/components/GlowCard';
import api from '../../../lib/api';
import { parseSessionJSON } from '../../../lib/cookies';
import { getAdminUrl } from '../../../config/domains';

// Planes disponibles por módulo (con límites claros)
const MODULE_PLANS = {
  landing: [
    { 
      id: 'free', name: 'Gratuito', price: 0, 
      features: ['1 página', '3 plantillas básicas', 'Subdominio .jgsystemsgt.com'],
      limits: { pages: 1, sections: 3, customDomain: false },
      icon: Zap
    },
    { 
      id: 'basic', name: 'Básico', price: 39, 
      features: ['3 páginas', '10 plantillas', 'SEO básico', 'Formulario contacto', 'Sin marca ModularBusiness'],
      limits: { pages: 3, sections: 10, customDomain: true },
      icon: Building
    },
    { 
      id: 'pro', name: 'Pro', price: 129, 
      features: ['10 páginas', 'Todas las plantillas', 'SEO avanzado', 'Analytics', 'Dominio personalizado', 'Chat WhatsApp'],
      limits: { pages: 10, sections: 30, customDomain: true },
      icon: Crown
    },
  ],
  customers: [
    { 
      id: 'free', name: 'Gratuito', price: 0, 
      features: ['30 clientes', 'Campos: nombre, email, teléfono'],
      limits: { clients: 30, customFields: 0, export: false },
      icon: Zap
    },
    { 
      id: 'basic', name: 'Básico', price: 19, 
      features: ['500 clientes', '5 campos personalizados', 'Segmentación básica', 'Exportar CSV'],
      limits: { clients: 500, customFields: 5, export: true },
      icon: Building
    },
    { 
      id: 'pro', name: 'Pro', price: 99, 
      features: ['Clientes ilimitados', 'Campos ilimitados', 'Automatizaciones', 'Email/SMS', 'API acceso'],
      limits: { clients: -1, customFields: -1, export: true },
      icon: Crown
    },
  ],
  store: [
    { 
      id: 'free', name: 'Gratuito', price: 0, 
      features: ['5 productos', '1 imagen/producto', 'Carrito básico'],
      limits: { products: 5, images: 1, variants: false, coupons: false },
      icon: Zap
    },
    { 
      id: 'basic', name: 'Básico', price: 99, 
      features: ['100 productos', '5 imágenes/producto', 'Variantes (talla/color)', 'Cupones descuento'],
      limits: { products: 100, images: 5, variants: true, coupons: 5 },
      icon: Building
    },
    { 
      id: 'pro', name: 'Pro', price: 199, 
      features: ['1000 productos', 'Imágenes ilimitadas', 'Reseñas', 'Reportes avanzados', 'Recuperación carrito'],
      limits: { products: 1000, images: -1, variants: true, coupons: -1 },
      icon: Crown
    },
  ],
  inventory: [
    { 
      id: 'free', name: 'Gratuito', price: 0, 
      features: ['20 productos', 'Stock manual', '1 bodega'],
      limits: { products: 20, warehouses: 1, alerts: false, suppliers: 0 },
      icon: Zap
    },
    { 
      id: 'basic', name: 'Básico', price: 49, 
      features: ['500 productos', 'Alertas stock bajo', '3 proveedores', 'Historial 30 días'],
      limits: { products: 500, warehouses: 2, alerts: true, suppliers: 3 },
      icon: Building
    },
    { 
      id: 'pro', name: 'Pro', price: 99, 
      features: ['Productos ilimitados', 'Múltiples bodegas', 'Códigos barras', 'Órdenes compra', 'Reportes'],
      limits: { products: -1, warehouses: -1, alerts: true, suppliers: -1 },
      icon: Crown
    },
  ],
  pos: [
    { 
      id: 'free', name: 'Gratuito', price: 0, 
      features: ['1 caja', '1 vendedor', 'Ticket simple'],
      limits: { registers: 1, sellers: 1, discounts: false, reports: false },
      icon: Zap
    },
    { 
      id: 'basic', name: 'Básico', price: 29, 
      features: ['3 cajas', '5 vendedores', 'Descuentos autorizados', 'Reportes turno'],
      limits: { registers: 3, sellers: 5, discounts: true, reports: true },
      icon: Building
    },
    { 
      id: 'pro', name: 'Pro', price: 49, 
      features: ['Cajas ilimitadas', 'Vendedores ilimitados', 'Facturación', 'Cortesías', 'Multi-sucursal'],
      limits: { registers: -1, sellers: -1, discounts: true, reports: true },
      icon: Crown
    },
  ],
  bookings: [
    { 
      id: 'free', name: 'Gratuito', price: 0, 
      features: ['3 servicios', 'Calendario básico', 'Reservas manuales'],
      limits: { services: 3, employees: 1, reminders: false, onlinePayment: false },
      icon: Zap
    },
    { 
      id: 'basic', name: 'Básico', price: 49, 
      features: ['30 servicios', 'Recordatorios email', 'Pagos online', '3 empleados'],
      limits: { services: 30, employees: 3, reminders: true, onlinePayment: true },
      icon: Building
    },
    { 
      id: 'pro', name: 'Pro', price: 199, 
      features: ['Servicios ilimitados', 'SMS/WhatsApp', 'Google Calendar', 'Empleados ilimitados'],
      limits: { services: -1, employees: -1, reminders: true, onlinePayment: true },
      icon: Crown
    },
  ],
  accounting: [
    { 
      id: 'free', name: 'Gratuito', price: 0, 
      features: ['Ingresos/gastos básicos', '10 transacciones/mes'],
      limits: { transactions: 10, fel: false, reports: false },
      icon: Zap
    },
    { 
      id: 'basic', name: 'Básico', price: 99, 
      features: ['Transacciones ilimitadas', 'Reportes financieros', 'Exportar Excel'],
      limits: { transactions: -1, fel: false, reports: true },
      icon: Building
    },
    { 
      id: 'pro', name: 'Pro', price: 399, 
      features: ['Facturación FEL (50/mes)', 'Cuentas por cobrar/pagar', 'Conciliación bancaria'],
      limits: { transactions: -1, fel: 50, reports: true },
      icon: Crown
    },
  ],
  employees: [
    { 
      id: 'free', name: 'Gratuito', price: 0, 
      features: ['2 empleados', 'Roles básicos (admin/staff)'],
      limits: { employees: 2, roles: 2, commissions: false, attendance: false },
      icon: Zap
    },
    { 
      id: 'basic', name: 'Básico', price: 49, 
      features: ['10 empleados', 'Roles personalizados', 'Comisiones', 'Asistencia manual'],
      limits: { employees: 10, roles: -1, commissions: true, attendance: true },
      icon: Building
    },
  ],
  branches: [
    { 
      id: 'free', name: 'Gratuito', price: 0, 
      features: ['1 sucursal adicional'],
      limits: { branches: 2, reports: false },
      icon: Zap
    },
    { 
      id: 'basic', name: 'Básico', price: 99, 
      features: ['5 sucursales', 'Reportes por ubicación', 'Transferencia entre sucursales'],
      limits: { branches: 5, reports: true },
      icon: Building
    },
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

// Modal de comparación de planes
const PlanModal = ({ isOpen, onClose, module, onSelectPlan, selectedPlanId, requiresModule }) => {
  if (!isOpen) return null;
  
  const plans = MODULE_PLANS[module.id] || [];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-dark-950/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-primary/20 animate-scale-up">
        {/* Header */}
        <div className="sticky top-0 bg-dark-900/95 backdrop-blur-sm p-6 border-b border-primary/20 rounded-t-2xl z-10">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-dark-800 transition">
            <X size={20} className="text-slate-400" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center`}>
              <module.icon size={24} className={module.iconColor} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{module.name}</h2>
              <p className="text-slate-400">{module.description}</p>
            </div>
          </div>
          
          {requiresModule && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm flex items-center gap-2">
                <Shield size={14} />
                Este módulo requiere: {AVAILABLE_MODULES.find(m => m.id === module.requires)?.name}
              </p>
            </div>
          )}
        </div>
        
        {/* Planes */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const PlanIcon = plan.icon;
              const isSelected = selectedPlanId === plan.id;
              
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl p-6 transition-all ${
                    isSelected
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-dark-800/50 border border-slate-700 hover:border-primary/50'
                  }`}
                >
                  {plan.id === 'pro' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white text-xs px-3 py-1 rounded-full">
                      🔥 Más Popular
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center`}>
                      <PlanIcon size={20} className={module.iconColor} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      <p className="text-2xl font-bold text-gradient">
                        {plan.price === 0 ? 'Gratis' : `Q${plan.price}`}
                        <span className="text-sm text-slate-400 font-normal">/mes</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => {
                      onSelectPlan(module.id, plan.id);
                      onClose();
                    }}
                    disabled={requiresModule}
                    className={`w-full py-2.5 rounded-lg font-medium transition ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-dark-700 text-white hover:bg-dark-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSelected ? 'Seleccionado' : 'Elegir plan'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SelectModules() {
  const [selectedModules, setSelectedModules] = useState({});
  const [modalModule, setModalModule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tenant = parseSessionJSON('tenant', {});
  const user = parseSessionJSON('user', {});

  const selectPlan = (moduleId, planId) => {
    setSelectedModules(prev => ({ ...prev, [moduleId]: planId }));
    
    const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
    if (module?.requires && !selectedModules[module.requires]) {
      setSelectedModules(prev => ({ ...prev, [module.requires]: 'free' }));
    }
  };

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
      await api.post('/tenants/onboarding/complete');
      const updatedTenant = { ...tenant, hasCompletedOnboarding: true };
      localStorage.setItem('tenant', JSON.stringify(updatedTenant));
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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              ¡Configura tu plan, {user.fullName?.split(' ')[0] || 'Emprendedor'}!
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Elige los módulos que necesitas. Empieza gratis y escala cuando quieras.
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="sticky top-4 z-20 mb-8">
          <div className="glass rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-slate-400 text-sm">Total mensual</p>
                <p className="text-3xl font-bold text-gradient">Q{total}</p>
              </div>
              <div className="text-sm text-slate-400">{selectedCount} módulos</div>
            </div>
            <button onClick={handleContinue} disabled={loading} className="group bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:glow-effect transition-all duration-300 flex items-center gap-2">
              {loading ? 'Guardando...' : (<>Ir al Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>)}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_MODULES.map((module) => {
            const isSelected = !!selectedModules[module.id];
            const selectedPlan = MODULE_PLANS[module.id]?.find(p => p.id === selectedModules[module.id]);
            const requiresModule = module.requires && !selectedModules[module.requires];
            
            return (
              <GlowCard
                key={module.id}
                onClick={() => setModalModule(module)}
                className={`relative transition-all duration-300 cursor-pointer ${
                  isSelected ? 'border-2 border-primary shadow-lg shadow-primary/20' : 'border border-slate-700/50 hover:border-primary/50'
                } ${requiresModule ? 'opacity-60' : ''}`}
              >
                {module.requiredFor && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                      Requerido para {module.requiredFor.length}
                    </span>
                  </div>
                )}
                
                {isSelected && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
                      <Check size={10} />
                      {selectedPlan?.name} · Q{selectedPlan?.price || 0}
                    </span>
                  </div>
                )}

                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4`}>
                  <module.icon size={28} className={module.iconColor} />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">{module.name}</h3>
                <p className="text-slate-400 text-sm mb-3">{module.description}</p>
                
                {module.requires && (
                  <p className={`text-xs flex items-center gap-1 ${requiresModule ? 'text-yellow-400' : 'text-slate-500'}`}>
                    <Shield size={10} />
                    Requiere: {AVAILABLE_MODULES.find(m => m.id === module.requires)?.name}
                  </p>
                )}
                
                {requiresModule && (
                  <p className="text-xs text-yellow-400 mt-2">Selecciónalo primero</p>
                )}
              </GlowCard>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm">
            ¿No encuentras lo que buscas?{' '}
            <a href="https://wa.me/50237674506" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition font-medium">
              Contáctanos para un módulo personalizado →
            </a>
          </p>
        </div>
      </div>

      <PlanModal
        isOpen={!!modalModule}
        onClose={() => setModalModule(null)}
        module={modalModule || {}}
        onSelectPlan={selectPlan}
        selectedPlanId={modalModule ? selectedModules[modalModule.id] : null}
        requiresModule={modalModule?.requires && !selectedModules[modalModule.requires]}
      />
    </div>
  );
}