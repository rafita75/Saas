import { useState } from 'react';
import { GlowCard } from '../../../shared/components/GlowCard';
import { SectionTitle } from '../../../shared/components/SectionTitle';
import { ModuleModal } from '../../../shared/components/ModuleModal';
import { 
  ShoppingBag, 
  Package, 
  Store, 
  Calendar, 
  Calculator, 
  Users, 
  Layout, 
  Building2,
  UserCog, 
  Star,
  Shield,
  Lock
} from 'lucide-react';

const modules = [
  {
    icon: <Layout size={32} />,
    name: 'Landing Page',
    description: 'Crea páginas de aterrizaje profesionales con constructor drag & drop.',
    price: 'Q39',
    plans: ['Básico Q39', 'Pro Q129', 'Empresa Q349'],
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-cyan-400',
    popular: true,
    badge: 'Popular'
  },
  {
    icon: <Users size={32} />,
    name: 'Registro de Clientes',
    description: 'Base de datos de clientes con automatización de ofertas, seguimiento y niveles de seguridad.',
    price: 'Q19',
    plans: ['Básico Q19', 'Pro Q99', 'Empresa Q399'],
    color: 'from-emerald-500/20 to-green-500/20',
    iconColor: 'text-emerald-400',
    required: true,
    requiredFor: ['Tienda en Línea', 'Reservas y Servicios', 'Punto de Venta'],
    badge: '⚡ OBLIGATORIO',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30'
  },
  {
    icon: <ShoppingBag size={32} />,
    name: 'Tienda en Línea',
    description: 'Vende productos online con carrito, reseñas y cupones de descuento.',
    price: 'Q99',
    plans: ['Básico Q99', 'Pro Q199', 'Empresa Q599'],
    color: 'from-primary/20 to-secondary/20',
    iconColor: 'text-primary',
    popular: true,
    requires: 'Registro de Clientes',
    badge: 'Popular'
  },
  {
    icon: <Package size={32} />,
    name: 'Inventario',
    description: 'Control de stock, entradas/salidas y alertas de inventario bajo.',
    price: 'Q49',
    plans: ['Básico Q49', 'Pro Q99', 'Empresa Q399'],
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-400'
  },
  {
    icon: <Store size={32} />,
    name: 'Punto de Venta',
    description: 'Vende en tienda física con lector de código de barras integrado.',
    price: 'Q29',
    plans: ['Básico Q29', 'Pro Q49', 'Empresa Q199'],
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
    requires: 'Registro de Clientes'
  },
  {
    icon: <Calendar size={32} />,
    name: 'Reservas y Servicios',
    description: 'Agenda citas, vende servicios y envía recordatorios automáticos.',
    price: 'Q49',
    plans: ['Básico Q49', 'Pro Q199', 'Empresa Q599'],
    color: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-orange-400',
    requires: 'Registro de Clientes'
  },
  {
    icon: <Calculator size={32} />,
    name: 'Contabilidad',
    description: 'Control de ingresos, gastos y facturación electrónica FEL.',
    price: 'Q99',
    plans: ['Básico Q99', 'Pro Q399', 'Empresa Q799'],
    color: 'from-red-500/20 to-rose-500/20',
    iconColor: 'text-red-400'
  },
  {
    icon: <UserCog size={32} />,
    name: 'Empleados',
    description: 'Gestión de personal, roles, permisos y horarios laborales.',
    price: 'Q49',
    plans: ['Estándar Q49 (5 empleados)'],
    color: 'from-indigo-500/20 to-blue-500/20',
    iconColor: 'text-indigo-400'
  }/* ,
  {
    icon: <Building2 size={32} />,
    name: 'Sucursales',
    description: 'Gestiona múltiples ubicaciones con inventarios sincronizados.',
    price: 'Q99',
    plans: ['Estándar Q99'],
    color: 'from-yellow-500/20 to-amber-500/20',
    iconColor: 'text-yellow-400'
  } */
];

export const Modules = () => {
  const [selectedModule, setSelectedModule] = useState(null);

  return (
    <section id="modules" className="py-20 px-4 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-linear-to-b from-dark-950 via-dark-900 to-dark-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionTitle 
          subtitle="Elige los módulos que tu negocio necesita y actívalos con un clic. Puedes agregar o quitar módulos en cualquier momento."
        >
          Módulos para cada necesidad
        </SectionTitle>
        
        {/* Leyenda */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-red-500/30 rounded border border-red-500/50" />
            <span className="text-slate-400">Obligatorio para otros módulos</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-primary/30 rounded border border-primary/50" />
            <span className="text-slate-400">Popular</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Shield size={12} className="text-yellow-400" />
            <span className="text-slate-400">Requiere módulo previo</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <GlowCard 
              key={index}
              onClick={() => setSelectedModule(module.name)}
              className={`relative overflow-hidden group animate-fade-in-up transition-all duration-300 cursor-pointer ${
                module.required 
                  ? 'border-2 border-red-500/30 hover:border-red-500/50' 
                  : module.popular 
                    ? 'border-primary/30' 
                    : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Badge superior */}
              {module.badge && (
                <div className="absolute top-3 right-3 z-10">
                  <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${
                    module.badgeColor || 'bg-linear-to-r from-primary to-secondary text-white border-primary/50'
                  }`}>
                    {module.badge === '⚡ OBLIGATORIO' && <Lock size={10} />}
                    {module.badge === 'Popular' && <Star size={10} />}
                    {module.badge}
                  </span>
                </div>
              )}
              
              {/* Badge "Requiere" en esquina superior izquierda */}
              {module.requires && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full border border-yellow-500/30">
                    <Shield size={10} />
                    Requiere {module.requires}
                  </span>
                </div>
              )}
              
              {/* Icono */}
              <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${module.color} flex items-center justify-center mb-4 ${
                module.required ? 'ring-2 ring-red-500/30' : ''
              }`}>
                <span className={module.iconColor}>{module.icon}</span>
              </div>
              
              {/* Nombre */}
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                {module.name}
                {module.required && (
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                    Obligatorio
                  </span>
                )}
              </h3>
              
              {/* Descripción */}
              <p className="text-slate-400 text-sm mb-3">
                {module.description}
              </p>
              
              {/* Requerido para... */}
              {module.requiredFor && (
                <div className="mb-3 p-2 bg-dark-800/50 rounded-lg border border-red-500/20">
                  <p className="text-xs text-red-400 mb-1 flex items-center gap-1">
                    <Lock size={10} />
                    Requerido para:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {module.requiredFor.map((mod, i) => (
                      <span key={i} className="text-xs bg-dark-700 text-slate-300 px-2 py-0.5 rounded">
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Precio */}
              <div className="mb-4">
                <p className="text-2xl font-bold text-gradient">
                  {module.price}
                  <span className="text-sm text-slate-400 font-normal">/mes</span>
                </p>
              </div>
              
              {/* Planes */}
              <div className="space-y-1.5">
                {module.plans.map((plan, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    <span>{plan}</span>
                  </div>
                ))}
              </div>
              
              {/* Efecto hover */}
              <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 pointer-events-none" />
              
              {/* Borde inferior para obligatorios */}
              {module.required && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 to-red-400" />
              )}
            </GlowCard>
          ))}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-slate-400">
            ¿No encuentras lo que buscas?{' '}
            <a 
              href="https://wa.me/50237674506" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary transition font-medium"
            >
              Contáctanos para un módulo personalizado →
            </a>
          </p>
        </div>
      </div>

      {/* Modal de detalles */}
      <ModuleModal 
        isOpen={!!selectedModule}
        onClose={() => setSelectedModule(null)}
        moduleName={selectedModule}
      />
    </section>
  );
};