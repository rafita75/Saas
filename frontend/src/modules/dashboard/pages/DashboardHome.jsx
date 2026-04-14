import { 
    TrendingUp, 
    Users, 
    ShoppingBag, 
    Package,
    ArrowUp,
    ArrowDown,
    MoreVertical,
    Clock
  } from 'lucide-react';
  import { GlowCard } from '../../../shared/components/GlowCard';
  
  const DashboardHome = () => {
    const tenantName = localStorage.getItem('tenant_name') || 'Mi Negocio';
    
    const stats = [
      {
        title: 'Ventas Hoy',
        value: 'Q 1,250',
        change: '+12.5%',
        trend: 'up',
        icon: TrendingUp,
        color: 'from-green-500/20 to-emerald-500/20',
        iconColor: 'text-green-400'
      },
      {
        title: 'Clientes',
        value: '48',
        change: '+8.2%',
        trend: 'up',
        icon: Users,
        color: 'from-blue-500/20 to-cyan-500/20',
        iconColor: 'text-blue-400'
      },
      {
        title: 'Órdenes',
        value: '12',
        change: '-2.1%',
        trend: 'down',
        icon: ShoppingBag,
        color: 'from-purple-500/20 to-pink-500/20',
        iconColor: 'text-purple-400'
      },
      {
        title: 'Productos',
        value: '156',
        change: '+5.0%',
        trend: 'up',
        icon: Package,
        color: 'from-orange-500/20 to-amber-500/20',
        iconColor: 'text-orange-400'
      }
    ];
  
    const recentActivity = [
      { action: 'Nueva orden', detail: '#ORD-001 - Q 450.00', time: 'Hace 5 min', status: 'success' },
      { action: 'Cliente registrado', detail: 'María González', time: 'Hace 15 min', status: 'info' },
      { action: 'Producto actualizado', detail: 'Zapatos deportivos', time: 'Hace 1 hora', status: 'warning' },
      { action: 'Pago recibido', detail: 'Factura #FAC-045 - Q 1,200.00', time: 'Hace 2 horas', status: 'success' },
      { action: 'Stock bajo', detail: 'Camisa azul (3 unidades)', time: 'Hace 3 horas', status: 'error' },
    ];
  
    const quickActions = [
      { label: 'Nuevo Producto', path: '/dashboard/products/new', color: 'bg-primary' },
      { label: 'Nueva Venta', path: '/dashboard/orders/new', color: 'bg-green-500' },
      { label: 'Agregar Cliente', path: '/dashboard/customers/new', color: 'bg-blue-500' },
    ];
  
    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="glass rounded-2xl p-6 border border-primary/20 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                ¡Bienvenido, {tenantName}!
              </h2>
              <p className="text-slate-400">
                Este es tu panel de control. Aquí podrás gestionar todo tu negocio.
              </p>
            </div>
            <div className="flex gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`${action.color} text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
  
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <GlowCard 
              key={index} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className={`text-xs flex items-center gap-1 mt-2 ${
                    stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    {stat.change}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={20} className={stat.iconColor} />
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
  
        {/* Recent Activity & Quick Info */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <GlowCard className="animate-fade-in-up animation-delay-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                Actividad Reciente
              </h3>
              <button className="p-1 rounded-lg hover:bg-dark-800/50 transition">
                <MoreVertical size={18} className="text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      activity.status === 'error' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-white text-sm">{activity.action}</p>
                      <p className="text-slate-400 text-xs">{activity.detail}</p>
                    </div>
                  </div>
                  <span className="text-slate-500 text-xs">{activity.time}</span>
                </div>
              ))}
            </div>
          </GlowCard>
  
          {/* Getting Started */}
          <GlowCard className="animate-fade-in-up animation-delay-300">
            <h3 className="text-lg font-semibold text-white mb-4">🚀 Primeros pasos</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 glass-light rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Configura tu negocio</p>
                  <p className="text-slate-400 text-xs">Agrega tu logo, nombre y detalles</p>
                </div>
                <button className="text-primary text-sm hover:underline">Configurar</button>
              </div>
              
              <div className="flex items-center gap-3 p-3 glass-light rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Agrega tus primeros productos</p>
                  <p className="text-slate-400 text-xs">Crea tu catálogo de productos o servicios</p>
                </div>
                <button className="text-primary text-sm hover:underline">Agregar</button>
              </div>
              
              <div className="flex items-center gap-3 p-3 glass-light rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Elige tus módulos</p>
                  <p className="text-slate-400 text-xs">Activa los módulos que necesitas</p>
                </div>
                <button className="text-primary text-sm hover:underline">Explorar</button>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    );
  };
  
  export default DashboardHome;