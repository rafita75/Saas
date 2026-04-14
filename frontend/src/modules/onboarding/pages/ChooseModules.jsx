import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/api';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Layout, 
  Users, 
  ShoppingBag, 
  Package, 
  Store, 
  Calendar, 
  Calculator, 
  UserCog,
  Building2,
  Shield,
  Lock
} from 'lucide-react';
import { GlowCard } from '../../../shared/components/GlowCard';

const AVAILABLE_MODULES = [
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Crea páginas profesionales con constructor drag & drop',
    icon: Layout,
    price: 39,
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-cyan-400'
  },
  {
    id: 'customers',
    name: 'Registro de Clientes',
    description: 'Base de datos de clientes con automatización',
    icon: Users,
    price: 19,
    color: 'from-emerald-500/20 to-green-500/20',
    iconColor: 'text-emerald-400',
    required: true,
    requiredFor: ['store', 'pos', 'bookings']
  },
  {
    id: 'store',
    name: 'Tienda en Línea',
    description: 'Vende productos online con carrito y reseñas',
    icon: ShoppingBag,
    price: 99,
    color: 'from-primary/20 to-secondary/20',
    iconColor: 'text-primary',
    requires: 'customers'
  },
  {
    id: 'inventory',
    name: 'Inventario',
    description: 'Control de stock, entradas y salidas',
    icon: Package,
    price: 49,
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-400'
  },
  {
    id: 'pos',
    name: 'Punto de Venta',
    description: 'Vende en tienda física con lector de código de barras',
    icon: Store,
    price: 29,
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
    requires: 'customers'
  },
  {
    id: 'bookings',
    name: 'Reservas y Servicios',
    description: 'Agenda citas y vende servicios',
    icon: Calendar,
    price: 49,
    color: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-orange-400',
    requires: 'customers'
  },
  {
    id: 'accounting',
    name: 'Contabilidad',
    description: 'Control de ingresos, gastos y facturación FEL',
    icon: Calculator,
    price: 99,
    color: 'from-red-500/20 to-rose-500/20',
    iconColor: 'text-red-400'
  },
  {
    id: 'employees',
    name: 'Empleados',
    description: 'Gestión de personal, roles y permisos',
    icon: UserCog,
    price: 49,
    color: 'from-indigo-500/20 to-blue-500/20',
    iconColor: 'text-indigo-400'
  },
  {
    id: 'branches',
    name: 'Sucursales',
    description: 'Gestiona múltiples ubicaciones',
    icon: Building2,
    price: 99,
    color: 'from-yellow-500/20 to-amber-500/20',
    iconColor: 'text-yellow-400'
  }
];

export const ChooseModules = () => {
  const navigate = useNavigate();
  const [selectedModules, setSelectedModules] = useState(['customers']);
  const [loading, setLoading] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('tenant_name') || '';
    const slug = localStorage.getItem('tenant_slug') || '';
    setTenantName(name);
    setTenantSlug(slug);
  }, []);

  const toggleModule = (moduleId) => {
    const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
    if (module?.required) return;
    
    const isRequiredByOthers = AVAILABLE_MODULES.some(m => 
      m.requires === moduleId && selectedModules.includes(m.id)
    );
    if (isRequiredByOthers) return;

    setSelectedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  useEffect(() => {
    const modulesToAdd = [];
    selectedModules.forEach(moduleId => {
      const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
      if (module?.requires && !selectedModules.includes(module.requires)) {
        modulesToAdd.push(module.requires);
      }
    });
    
    if (modulesToAdd.length > 0) {
      setSelectedModules(prev => [...new Set([...prev, ...modulesToAdd])]);
    }
  }, [selectedModules]);

  const calculateTotal = () => {
    return selectedModules.reduce((total, moduleId) => {
      const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
      return total + (module?.price || 0);
    }, 0);
  };

  const handleContinue = async () => {
    setLoading(true);
    
    try {
      // ✅ Guardar módulos en MongoDB
      await api.put(`/tenants/${tenantSlug}/modules`, {
        selectedModules,
        monthlyTotal: calculateTotal()
      });

      // Redirigir al dashboard
      window.location.href = `https://admin.jgsystemsgt.com/${tenantSlug}/dashboard`;
      
    } catch (err) {
      console.error('Error guardando módulos:', err);
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-dark-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¡Configura tu plan, {tenantName}!
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Elige los módulos que necesitas para tu negocio.
          </p>
        </div>

        <div className="sticky top-4 z-20 mb-8">
          <div className="glass rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-slate-400 text-sm">Total mensual</p>
                <p className="text-3xl font-bold text-gradient">Q{total}</p>
              </div>
              <div className="text-sm text-slate-400">
                {selectedModules.length} módulos
              </div>
            </div>
            <button
              onClick={handleContinue}
              disabled={loading}
              className="group bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:glow-effect transition-all duration-300 flex items-center gap-2"
            >
              {loading ? 'Guardando...' : 'Continuar'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_MODULES.map((module) => {
            const isSelected = selectedModules.includes(module.id);
            const isDisabled = module.required || 
              AVAILABLE_MODULES.some(m => 
                m.requires === module.id && selectedModules.includes(m.id)
              );
            const requiresModule = module.requires && !selectedModules.includes(module.requires);
            
            return (
              <GlowCard
                key={module.id}
                onClick={() => !isDisabled && !requiresModule && toggleModule(module.id)}
                className={`relative transition-all duration-300 ${
                  isSelected 
                    ? 'border-2 border-primary shadow-lg shadow-primary/20' 
                    : 'border border-slate-700/50 opacity-80'
                } ${(isDisabled || requiresModule) ? 'cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}`}
              >
                <div className="absolute top-3 right-3 flex gap-2">
                  {module.required && (
                    <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full border border-red-500/30 flex items-center gap-1">
                      <Lock size={10} /> Obligatorio
                    </span>
                  )}
                  {isSelected && (
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
                      <Check size={10} /> Seleccionado
                    </span>
                  )}
                </div>

                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4`}>
                  <module.icon size={28} className={module.iconColor} />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">{module.name}</h3>
                  <p className="text-xl font-bold text-gradient">Q{module.price}</p>
                </div>

                <p className="text-slate-400 text-sm mb-3">{module.description}</p>

                {module.requires && (
                  <p className={`text-xs mb-2 flex items-center gap-1 ${requiresModule ? 'text-yellow-400' : 'text-slate-500'}`}>
                    <Shield size={10} />
                    Requiere: {AVAILABLE_MODULES.find(m => m.id === module.requires)?.name}
                  </p>
                )}
              </GlowCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChooseModules;