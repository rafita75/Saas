import { useAuth } from '../../auth/context/AuthContext';

const DashboardHome = () => {
  const { tenant } = useAuth();

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-8 border border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">¡Bienvenido, {tenant?.name}!</h2>
          <p className="text-slate-400 max-w-2xl">
            Este es tu nuevo centro de mando. Por ahora, hemos limpiado el panel para que puedas enfocarte 
            en configurar los detalles básicos de tu negocio desde la sección de <strong>Configuración</strong>.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="px-4 py-2 rounded-xl bg-dark-800/50 border border-slate-700 text-sm text-slate-300">
              <span className="text-slate-500 mr-2">Slug:</span>
              {tenant?.slug}.jgsystemsgt.com
            </div>
            <div className="px-4 py-2 rounded-xl bg-dark-800/50 border border-slate-700 text-sm text-slate-300">
              <span className="text-slate-500 mr-2">Estado:</span>
              <span className="text-emerald-400 font-medium">Activo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Próximos pasos</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-slate-400">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</div>
              Configura el nombre y logo de tu empresa
            </li>
            <li className="flex items-center gap-3 text-slate-500">
              <div className="w-6 h-6 rounded-full bg-dark-800 text-slate-600 flex items-center justify-center text-xs font-bold">2</div>
              Explora los módulos disponibles (Próximamente)
            </li>
            <li className="flex items-center gap-3 text-slate-500">
              <div className="w-6 h-6 rounded-full bg-dark-800 text-slate-600 flex items-center justify-center text-xs font-bold">3</div>
              Invita a tu equipo de trabajo (Próximamente)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;