import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Check, Layout, Users, ShoppingBag, Package, Store, Calendar, Calculator, UserCog, Building2, Shield, Lock } from 'lucide-react';
import { GlowCard } from '../../../shared/components/GlowCard';
import api from '../../../lib/api';
import { parseSessionJSON } from '../../../lib/cookies';

const AVAILABLE_MODULES = [
  { id: 'landing', name: 'Landing Page', description: 'Crea páginas profesionales con constructor drag & drop', icon: Layout, price: 39, color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-cyan-400' },
  { id: 'customers', name: 'Registro de Clientes', description: 'Base de datos de clientes con automatización', icon: Users, price: 19, color: 'from-emerald-500/20 to-green-500/20', iconColor: 'text-emerald-400', required: true, requiredFor: ['store', 'pos', 'bookings'] },
  { id: 'store', name: 'Tienda en Línea', description: 'Vende productos online con carrito y reseñas', icon: ShoppingBag, price: 99, color: 'from-primary/20 to-secondary/20', iconColor: 'text-primary', requires: 'customers' },
  { id: 'inventory', name: 'Inventario', description: 'Control de stock, entradas y salidas', icon: Package, price: 49, color: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-400' },
  { id: 'pos', name: 'Punto de Venta', description: 'Vende en tienda física con lector de código de barras', icon: Store, price: 29, color: 'from-purple-500/20 to-pink-500/20', iconColor: 'text-purple-400', requires: 'customers' },
  { id: 'bookings', name: 'Reservas y Servicios', description: 'Agenda citas y vende servicios', icon: Calendar, price: 49, color: 'from-orange-500/20 to-amber-500/20', iconColor: 'text-orange-400', requires: 'customers' },
  { id: 'accounting', name: 'Contabilidad', description: 'Control de ingresos, gastos y facturación FEL', icon: Calculator, price: 99, color: 'from-red-500/20 to-rose-500/20', iconColor: 'text-red-400' },
  { id: 'employees', name: 'Empleados', description: 'Gestión de personal, roles y permisos', icon: UserCog, price: 49, color: 'from-indigo-500/20 to-blue-500/20', iconColor: 'text-indigo-400' },
  { id: 'branches', name: 'Sucursales', description: 'Gestiona múltiples ubicaciones', icon: Building2, price: 99, color: 'from-yellow-500/20 to-amber-500/20', iconColor: 'text-yellow-400' }
];

export default function SelectModules() {
  const [selectedModules, setSelectedModules] = useState(['customers']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tenant = parseSessionJSON('tenant', {});
  const user = parseSessionJSON('user', {});

  const toggleModule = (moduleId) => {
    const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
    if (module?.required) return;
    const isRequiredByOthers = AVAILABLE_MODULES.some(m => m.requires === moduleId && selectedModules.includes(m.id));
    if (isRequiredByOthers) return;
    setSelectedModules(prev => prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]);
  };

  useEffect(() => {
    const modulesToAdd = [];
    selectedModules.forEach(moduleId => {
      const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
      if (module?.requires && !selectedModules.includes(module.requires)) modulesToAdd.push(module.requires);
    });
    if (modulesToAdd.length > 0) setSelectedModules(prev => [...new Set([...prev, ...modulesToAdd])]);
  }, [selectedModules]);

  const calculateTotal = () => selectedModules.reduce((total, moduleId) => total + (AVAILABLE_MODULES.find(m => m.id === moduleId)?.price || 0), 0);

  const handleContinue = async () => {
    setLoading(true);
    setError('');
    
    try {
      // ✅ Guardar módulos seleccionados en el backend
      // Contratar cada módulo seleccionado (plan básico por defecto)
      for (const moduleId of selectedModules) {
        const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
        if (!module) continue;
        
        // TODO: Obtener el planId correcto (por ahora usamos el primer plan disponible)
        // Por ahora, simulamos la contratación
        console.log(`Contratando módulo: ${module.name}`);
        
        // await api.post('/modules/tenant', {
        //   moduleId: module._id, // Necesitaríamos el ID real de la BD
        //   planId: plan._id,
        //   autoRenew: true
        // });
      }
      
      // Redirección con slug
      window.location.href = `https://admin.jgsystemsgt.com/${tenant.slug}/dashboard`;
    } catch (err) {
      setError('Error al guardar los módulos. Intenta de nuevo.');
      setLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-dark-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">¡Configura tu plan, {user.fullName?.split(' ')[0] || 'Emprendedor'}!</h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Elige los módulos que necesitas para tu negocio. Puedes agregar o quitar módulos en cualquier momento.</p>
        </div>

        {error && <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-center">{error}</div>}

        <div className="sticky top-4 z-20 mb-8">
          <div className="glass rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div><p className="text-slate-400 text-sm">Total mensual</p><p className="text-3xl font-bold text-gradient">Q{total}</p></div>
              <div className="text-sm text-slate-400">{selectedModules.length} módulos seleccionados</div>
            </div>
            <button onClick={handleContinue} disabled={loading || selectedModules.length === 0} className="group bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:glow-effect transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Guardando...' : (<>Continuar <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>)}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_MODULES.map((module) => {
            const isSelected = selectedModules.includes(module.id);
            const isDisabled = module.required || AVAILABLE_MODULES.some(m => m.requires === module.id && selectedModules.includes(m.id));
            const requiresModule = module.requires && !selectedModules.includes(module.requires);
            return (
              <GlowCard key={module.id} onClick={() => !isDisabled && !requiresModule && toggleModule(module.id)} className={`relative transition-all duration-300 ${isSelected ? 'border-2 border-primary shadow-lg shadow-primary/20' : 'border border-slate-700/50 opacity-80'} ${(isDisabled || requiresModule) ? 'cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}`}>
                <div className="absolute top-3 right-3 flex gap-2">
                  {module.required && <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full border border-red-500/30 flex items-center gap-1"><Lock size={10} />Obligatorio</span>}
                  {isSelected && <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30 flex items-center gap-1"><Check size={10} />Seleccionado</span>}
                </div>
                {module.requiredFor && isSelected && <div className="absolute top-3 left-3"><span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/30">Requerido para {module.requiredFor.length} módulos</span></div>}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4`}><module.icon size={28} className={module.iconColor} /></div>
                <div className="flex items-center justify-between mb-2"><h3 className="text-xl font-semibold text-white">{module.name}</h3><p className="text-xl font-bold text-gradient">Q{module.price}</p></div>
                <p className="text-slate-400 text-sm mb-3">{module.description}</p>
                {module.requires && <p className={`text-xs mb-2 flex items-center gap-1 ${requiresModule ? 'text-yellow-400' : 'text-slate-500'}`}><Shield size={10} />Requiere: {AVAILABLE_MODULES.find(m => m.id === module.requires)?.name}{requiresModule && ' (selecciónalo primero)'}</p>}
                {isDisabled && !module.required && <p className="text-xs text-slate-500 mt-2">No puedes deseleccionar este módulo porque otros dependen de él.</p>}
              </GlowCard>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm">¿No encuentras lo que buscas? <a href="https://wa.me/50237674506" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition font-medium">Contáctanos para un módulo personalizado →</a></p>
        </div>
      </div>
    </div>
  );
}