import { TrendingUp, Users, ShoppingBag, Package } from 'lucide-react';
import { GlowCard } from '../../../shared/components/GlowCard';

const DashboardHome = () => {
  const tenant = JSON.parse(localStorage.getItem('tenant') || '{}');
  
  const stats = [
    { title: 'Ventas Hoy', value: 'Q 0', change: '+0%', trend: 'up', icon: TrendingUp, color: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-400' },
    { title: 'Clientes', value: '0', change: '+0%', trend: 'up', icon: Users, color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-400' },
    { title: 'Órdenes', value: '0', change: '0%', trend: 'up', icon: ShoppingBag, color: 'from-purple-500/20 to-pink-500/20', iconColor: 'text-purple-400' },
    { title: 'Productos', value: '0', change: '0%', trend: 'up', icon: Package, color: 'from-orange-500/20 to-amber-500/20', iconColor: 'text-orange-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 border border-primary/20">
        <h2 className="text-2xl font-bold text-white mb-1">¡Bienvenido, {tenant.name}!</h2>
        <p className="text-slate-400">Este es tu panel de control. Aquí podrás gestionar todo tu negocio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <GlowCard key={index}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={20} className={stat.iconColor} />
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;