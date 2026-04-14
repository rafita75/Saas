import { X, Check, Zap, Crown, Building2, Users, Package, Calendar, Calculator, Layout, Store, ShoppingBag, UserCog } from 'lucide-react';
import { GlowCard } from './GlowCard';

const moduleDetails = {
  'Landing Page': {
    icon: <Layout size={24} />,
    description: 'Crea páginas de aterrizaje profesionales con constructor drag & drop.',
    plans: [
      {
        name: 'Básico',
        price: 'Q39',
        features: [
          '1 página web',
          'Hasta 5 secciones',
          '3 plantillas básicas',
          'Subdominio gratis',
          'SSL incluido',
          'Formulario de contacto básico',
          'SEO básico'
        ],
        notIncluded: [
          'Dominio personalizado',
          'Analytics',
          'Chat en vivo',
          'A/B Testing'
        ]
      },
      {
        name: 'Pro',
        price: 'Q129',
        popular: true,
        features: [
          'Hasta 5 páginas',
          'Hasta 15 secciones',
          '15+ plantillas premium',
          'Dominio personalizado incluido',
          'SSL incluido',
          'Formulario avanzado',
          'SEO avanzado',
          'Google Analytics',
          'Chat en vivo (WhatsApp)'
        ],
        notIncluded: [
          'A/B Testing',
          'Código personalizado'
        ]
      },
      {
        name: 'Empresa',
        price: 'Q349',
        features: [
          'Páginas ilimitadas',
          'Secciones ilimitadas',
          'Todas las plantillas + exclusivas',
          'Dominio personalizado incluido',
          'SSL premium',
          'CRM integrado',
          'SEO avanzado + consultoría',
          'Heatmaps',
          'A/B Testing',
          'Chat propio',
          'Código HTML/CSS/JS personalizado'
        ],
        notIncluded: []
      }
    ]
  },
  'Registro de Clientes': {
    icon: <Users size={24} />,
    description: 'Base de datos de clientes con automatización de ofertas, seguimiento y niveles de seguridad.',
    required: true,
    requiredFor: ['Tienda en Línea', 'Reservas y Servicios', 'Punto de Venta'],
    plans: [
      {
        name: 'Básico',
        price: 'Q19',
        features: [
          'Hasta 100 clientes',
          '3 campos personalizados',
          'Historial de compras (30 días)',
          'Encriptación AES-256',
          'Backup semanal'
        ],
        notIncluded: [
          'Segmentación',
          'Automatización de ofertas',
          'Campañas de email',
          'Recordatorios automáticos',
          'Exportación de datos',
          '2FA'
        ]
      },
      {
        name: 'Pro',
        price: 'Q99',
        popular: true,
        features: [
          'Hasta 1,000 clientes',
          '15 campos personalizados',
          'Historial completo',
          '5 segmentos de clientes',
          'Automatización de ofertas (Email/SMS)',
          '3 campañas de email/mes',
          'Recordatorios automáticos',
          'Exportación CSV',
          '2FA',
          'Logs de actividad (30 días)',
          'Backup diario'
        ],
        notIncluded: [
          'WhatsApp Business',
          'IA predictiva',
          'API acceso'
        ]
      },
      {
        name: 'Empresa',
        price: 'Q399',
        features: [
          'Clientes ilimitados',
          'Campos personalizados ilimitados',
          'Análisis predictivo con IA',
          'Segmentos ilimitados',
          'Automatización WhatsApp incluida',
          'Campañas ilimitadas',
          'Exportación CSV, Excel, API',
          'Seguridad nivel bancario',
          'Logs de actividad (1 año)',
          'Backup cada 6 horas',
          'Auditoría de cambios',
          'API acceso'
        ],
        notIncluded: []
      }
    ]
  },
  'Tienda en Línea': {
    icon: <ShoppingBag size={24} />,
    description: 'Vende productos online con carrito, reseñas y cupones de descuento.',
    requires: 'Registro de Clientes',
    plans: [
      {
        name: 'Básico',
        price: 'Q99',
        features: [
          'Hasta 50 productos',
          '3 imágenes por producto',
          'Carrito de compras',
          'Checkout básico',
          'Reseñas de productos',
          'SEO básico',
          'Integración Paggo (2% comisión)',
          'Envíos manuales'
        ],
        notIncluded: [
          'Variantes de producto',
          'Cupones de descuento',
          'Alertas de stock',
          'Múltiples métodos de pago'
        ]
      },
      {
        name: 'Pro',
        price: 'Q199',
        popular: true,
        features: [
          'Hasta 500 productos',
          '10 imágenes por producto',
          'Variantes de producto (3 opciones)',
          'Cupones de descuento (5 activos)',
          'Alertas de stock bajo',
          'SEO avanzado',
          'Integración Paggo (1.5% comisión)',
          'Múltiples métodos de pago',
          'Envíos automáticos',
          'Tracking de envíos',
          'Reportes avanzados'
        ],
        notIncluded: [
          'API acceso',
          'WhatsApp notificaciones'
        ]
      },
      {
        name: 'Empresa',
        price: 'Q599',
        features: [
          'Productos ilimitados',
          'Imágenes ilimitadas',
          'Variantes ilimitadas',
          'Cupones ilimitados',
          'IA para productos relacionados',
          'Integración Paggo (1% comisión)',
          'Múltiples couriers',
          'Notificaciones WhatsApp',
          'API + Webhooks',
          'Personalización total'
        ],
        notIncluded: []
      }
    ]
  },
  'Inventario': {
    icon: <Package size={24} />,
    description: 'Control de stock, entradas/salidas y alertas de inventario bajo.',
    plans: [
      {
        name: 'Básico',
        price: 'Q49',
        features: [
          'Hasta 200 productos',
          '1 almacén/bodega',
          'Entradas/salidas manuales',
          'Alertas de stock bajo por email',
          'Historial 30 días'
        ],
        notIncluded: [
          'Proveedores',
          'Códigos de barras',
          'Órdenes de compra',
          'Exportación'
        ]
      },
      {
        name: 'Pro',
        price: 'Q99',
        popular: true,
        features: [
          'Hasta 2,000 productos',
          'Hasta 3 almacenes',
          'Importación CSV',
          'Alertas email + SMS',
          'Códigos de barras',
          'Hasta 20 proveedores',
          'Órdenes de compra manuales',
          'Recepción de mercancía',
          'Historial 6 meses',
          'Exportación CSV'
        ],
        notIncluded: [
          'Órdenes automáticas',
          'Múltiples bodegas ilimitadas'
        ]
      },
      {
        name: 'Empresa',
        price: 'Q399',
        features: [
          'Productos ilimitados',
          'Almacenes ilimitados',
          'Órdenes de compra automáticas',
          'Escaneo de códigos de barras',
          'Proveedores ilimitados',
          'Devoluciones a proveedor',
          'Historial ilimitado',
          'Reportes personalizados',
          'Exportación Excel, PDF, API'
        ],
        notIncluded: []
      }
    ]
  },
  'Punto de Venta': {
    icon: <Store size={24} />,
    description: 'Vende en tienda física con lector de código de barras integrado.',
    requires: 'Registro de Clientes',
    plans: [
      {
        name: 'Básico',
        price: 'Q29',
        features: [
          '1 sucursal',
          '1 caja registradora',
          '1 usuario vendedor',
          'Apertura/cierre de caja manual',
          'Arqueo básico',
          'Efectivo y tarjeta',
          'Ticket simple'
        ],
        notIncluded: [
          'Múltiples cajas',
          'Descuentos manuales',
          'Cortesías',
          'Reportes por turno'
        ]
      },
      {
        name: 'Pro',
        price: 'Q49',
        popular: true,
        features: [
          '1 sucursal',
          'Hasta 3 cajas',
          'Hasta 5 vendedores',
          'Arqueo avanzado',
          'Pagos combinados',
          'Descuentos con autorización',
          'Cortesías (límite diario)',
          'Devoluciones',
          'Nota de crédito',
          'Ticket con logo',
          'Lectura código de barras',
          'Reportes por turno/vendedor'
        ],
        notIncluded: [
          'Múltiples sucursales',
          'Facturación FEL',
          'Modo offline'
        ]
      },
      {
        name: 'Empresa',
        price: 'Q199',
        features: [
          'Sucursales ilimitadas',
          'Cajas ilimitadas',
          'Vendedores ilimitados',
          'Facturación electrónica FEL',
          'Pantalla de cliente',
          'Modo offline',
          'Apertura de cajón monedero',
          'Reportes por sucursal',
          'Integración hardware completa'
        ],
        notIncluded: []
      }
    ]
  },
  'Reservas y Servicios': {
    icon: <Calendar size={24} />,
    description: 'Agenda citas, vende servicios y envía recordatorios automáticos.',
    requires: 'Registro de Clientes',
    plans: [
      {
        name: 'Básico',
        price: 'Q49',
        features: [
          'Hasta 5 servicios',
          '1 empleado/recurso',
          'Calendario básico',
          'Reservas online',
          'Aprobación manual',
          'Anticipación 30 días',
          'Pago en persona'
        ],
        notIncluded: [
          'Recordatorios automáticos',
          'Pagos en línea',
          'Múltiples empleados'
        ]
      },
      {
        name: 'Pro',
        price: 'Q199',
        popular: true,
        features: [
          'Hasta 30 servicios',
          'Hasta 5 empleados',
          'Horarios personalizados',
          'Recordatorios email',
          'Pagos en línea (Paggo)',
          'Anticipos/señas',
          'Políticas de cancelación',
          'Cancelación automática',
          'Historial de clientes',
          'Reportes avanzados'
        ],
        notIncluded: [
          'WhatsApp/SMS',
          'Asignación automática',
          'Google Calendar Sync'
        ]
      },
      {
        name: 'Empresa',
        price: 'Q599',
        features: [
          'Servicios ilimitados',
          'Empleados ilimitados',
          'Asignación automática round-robin',
          'Recordatorios Email + SMS + WhatsApp',
          'Lista de espera automática',
          'Sincronización Google/Outlook',
          'Citas grupales',
          'Paquetes/bonos',
          'Facturación FEL',
          'API acceso'
        ],
        notIncluded: []
      }
    ]
  },
  'Contabilidad': {
    icon: <Calculator size={24} />,
    description: 'Control de ingresos, gastos y facturación electrónica FEL.',
    plans: [
      {
        name: 'Básico',
        price: 'Q99',
        features: [
          'Registro manual de ingresos/gastos',
          '10 categorías fijas',
          'Reporte simple de ganancia/pérdida',
          'Exportación Excel'
        ],
        notIncluded: [
          'Facturación FEL',
          'Cuentas por cobrar/pagar',
          'Estados financieros'
        ]
      },
      {
        name: 'Pro',
        price: 'Q399',
        popular: true,
        features: [
          '50 facturas FEL/mes',
          'Certificador FEL incluido',
          'Registro automático de ventas',
          'Categorías personalizadas',
          'Cuentas por cobrar/pagar',
          'Hasta 20 proveedores',
          'Balance General',
          'Estado de Resultados',
          'Flujo de Caja',
          'Cálculo de impuestos (IVA, ISR)'
        ],
        notIncluded: [
          'Facturas FEL ilimitadas',
          'Conciliación bancaria',
          'Múltiples monedas'
        ]
      },
      {
        name: 'Empresa',
        price: 'Q799',
        features: [
          'Facturas FEL ilimitadas',
          'Conciliación bancaria automática',
          'Importación de estados bancarios',
          'Múltiples cuentas y monedas',
          'Libros contables (Diario, Mayor)',
          'Cierre mensual/anual',
          'Auditoría de cambios',
          'Exportación formato SAT',
          'Reportes personalizados'
        ],
        notIncluded: []
      }
    ]
  },
  'Empleados': {
    icon: <UserCog size={24} />,
    description: 'Gestión de personal, roles, permisos y horarios laborales.',
    plans: [
      {
        name: 'Estándar',
        price: 'Q49',
        features: [
          'Hasta 5 empleados incluidos',
          'Perfil de empleado',
          'Roles personalizados',
          'Permisos por módulo/acción',
          'Horarios de trabajo',
          'Registro de asistencia manual',
          'Comisiones por venta/servicio',
          'Reporte de comisiones',
          'Historial de actividad (30 días)',
          '2FA (Autenticación 2 factores)',
          'Acceso restringido por IP'
        ],
        extra: 'Empleado adicional: Q19/mes c/u'
      }
    ]
  }
};

export const ModuleModal = ({ isOpen, onClose, moduleName }) => {
  if (!isOpen) return null;

  const module = moduleDetails[moduleName];
  if (!module) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-dark-950/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <GlowCard className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-scale-up">
        {/* Header */}
        <div className="sticky top-0 bg-dark-900/95 backdrop-blur-sm p-6 border-b border-primary/20 rounded-t-2xl z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-dark-800 transition"
          >
            <X size={20} className="text-slate-400" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-primary">{module.icon}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{moduleName}</h2>
              <p className="text-slate-400">{module.description}</p>
            </div>
          </div>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {module.required && (
              <span className="bg-red-500/20 text-red-400 text-xs px-3 py-1 rounded-full border border-red-500/30">
                ⚡ Módulo Obligatorio
              </span>
            )}
            {module.requires && (
              <span className="bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-500/30">
                Requiere: {module.requires}
              </span>
            )}
            {module.requiredFor && (
              <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/30">
                Requerido para: {module.requiredFor.join(', ')}
              </span>
            )}
          </div>
        </div>
        
        {/* Plans */}
        <div className="p-6">
          <div className={`grid gap-6 ${module.plans.length === 1 ? 'max-w-md mx-auto' : 'md:grid-cols-3'}`}>
            {module.plans.map((plan, index) => (
              <div 
                key={index}
                className={`relative glass rounded-xl p-6 ${plan.popular ? 'border-2 border-primary shadow-lg shadow-primary/20' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-primary to-secondary text-white text-xs px-4 py-1 rounded-full">
                    🔥 Más Popular
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-3xl font-bold text-gradient mb-4">
                  {plan.price}
                  <span className="text-sm text-slate-400 font-normal">/mes</span>
                </p>
                
                {plan.extra && (
                  <p className="text-xs text-slate-400 mb-4">{plan.extra}</p>
                )}
                
                <div className="space-y-3">
                  <p className="text-sm font-medium text-green-400 flex items-center gap-1">
                    <Check size={14} /> Incluye:
                  </p>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check size={14} className="text-green-400 mt-0.5 shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {plan.notIncluded && plan.notIncluded.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-primary/20 space-y-2">
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-1">
                      <X size={14} /> No incluye:
                    </p>
                    {plan.notIncluded.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <X size={14} className="text-red-400 mt-0.5 shrink-0" />
                        <span className="text-slate-500 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 bg-dark-900/95 backdrop-blur-sm p-4 border-t border-primary/20 rounded-b-2xl">
          <button className="w-full bg-linear-to-r from-primary to-secondary text-white py-3 rounded-lg font-medium hover:glow-effect transition">
            Comenzar con {moduleName}
          </button>
        </div>
      </GlowCard>
    </div>
  );
};